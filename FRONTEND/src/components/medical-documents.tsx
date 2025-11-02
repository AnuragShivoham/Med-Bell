import { useState, useEffect, useRef } from "react";
import { FileText, Upload, Download, Trash2, File, FileImage, FilePlus, Search, Calendar, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Document {
  id: string;
  fileName: string;
  filePath: string;
  mimeType: string;
  uploadedAt: string;
  size: number;
}

export function MedicalDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userId = localStorage.getItem("medibell-user") || "guest";

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/documents`,
          {
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`,
              "X-User-Id": userId,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
          // Save to localStorage as backup
          localStorage.setItem(`medibell-documents-${userId}`, JSON.stringify(data.documents || []));
          return;
        }
      } catch (backendError) {
        console.log("Backend not available, using local storage");
      }

      // Fallback to localStorage
      const localDocs = localStorage.getItem(`medibell-documents-${userId}`);
      if (localDocs) {
        setDocuments(JSON.parse(localDocs));
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      // Load from localStorage as final fallback
      const localDocs = localStorage.getItem(`medibell-documents-${userId}`);
      if (localDocs) {
        setDocuments(JSON.parse(localDocs));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 52428800) {
      toast.error("File size must be less than 50MB");
      return;
    }

    try {
      setUploading(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];

        // Create document object for local storage
        const newDoc: Document = {
          id: `doc-${Date.now()}`,
          fileName: file.name,
          filePath: base64Data, // Store base64 in localStorage
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
          size: file.size,
        };

        try {
          // Try to upload to Supabase
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/documents/upload`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${publicAnonKey}`,
                "Content-Type": "application/json",
                "X-User-Id": userId,
              },
              body: JSON.stringify({
                fileName: file.name,
                fileData: base64Data,
                mimeType: file.type,
              }),
            }
          );

          if (response.ok) {
            toast.success("Document uploaded to cloud! 📄☁️");
          } else {
            throw new Error("Backend upload failed");
          }
        } catch (backendError) {
          console.log("Saving to local storage");
          // Save to localStorage as fallback
          const localDocs = localStorage.getItem(`medibell-documents-${userId}`);
          const docs = localDocs ? JSON.parse(localDocs) : [];
          docs.push(newDoc);
          localStorage.setItem(`medibell-documents-${userId}`, JSON.stringify(docs));
          toast.success("Document saved locally! 📄💾");
        }

        setUploadDialogOpen(false);
        fetchDocuments();
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDownload = async (doc: Document) => {
    try {
      // If document has base64 data (local storage), download directly
      if (doc.filePath && doc.filePath.length > 100) {
        const link = document.createElement('a');
        link.href = `data:${doc.mimeType};base64,${doc.filePath}`;
        link.download = doc.fileName;
        link.click();
        toast.success("Document downloaded");
        return;
      }

      // Try to get from Supabase
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/documents/${doc.id}/url`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "X-User-Id": userId,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();
      window.open(data.url, '_blank');
      toast.success("Document opened in new tab");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`Are you sure you want to delete "${doc.fileName}"?`)) {
      return;
    }

    try {
      // Try to delete from Supabase
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/documents/${doc.id}`,
          {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`,
              "X-User-Id": userId,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Backend delete failed");
        }
      } catch (backendError) {
        console.log("Deleting from local storage");
      }

      // Always delete from localStorage
      const localDocs = localStorage.getItem(`medibell-documents-${userId}`);
      if (localDocs) {
        const docs = JSON.parse(localDocs);
        const filteredDocs = docs.filter((d: Document) => d.id !== doc.id);
        localStorage.setItem(`medibell-documents-${userId}`, JSON.stringify(filteredDocs));
      }

      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <FileImage className="w-5 h-5" />;
    }
    return <FileText className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10" />
        <div className="relative p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl flex-shrink-0">
                <File className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Medical Documents
                </h1>
                <p className="text-sm md:text-base text-slate-600 mt-1">Store and access your medical reports securely</p>
              </div>
            </div>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-10 md:h-11">
                  <Upload className="w-4 h-4 mr-2" />
                  <span className="text-sm md:text-base">Upload Document</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/90 backdrop-blur-xl border-white/30">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Upload Medical Document
                  </DialogTitle>
                  <DialogDescription>
                    Upload your medical reports, prescriptions, or lab results. Maximum file size: 50MB
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer bg-gradient-to-br from-blue-50/50 to-cyan-50/50 hover:bg-blue-100/50 transition-all duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FilePlus className="w-16 h-16 mb-4 text-blue-500" />
                        <p className="mb-2 text-lg font-semibold text-slate-700">
                          {uploading ? "Uploading..." : "Click to upload"}
                        </p>
                        <p className="text-sm text-slate-500">
                          PDF, PNG, JPG or any document (MAX. 50MB)
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        disabled={uploading}
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      />
                    </label>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-200/30">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Your documents are stored securely in the cloud and accessible from any device.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-white/70 backdrop-blur-sm border-white/30 focus:bg-white/90 transition-all duration-300"
        />
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-50 to-blue-50/30 backdrop-blur-xl border-white/30">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-200 to-blue-200 flex items-center justify-center">
              <FileText className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {searchQuery ? "No documents found" : "No documents yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery 
                ? "Try a different search term"
                : "Upload your first medical document to get started"
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Document
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card 
              key={doc.id}
              className="relative overflow-hidden bg-gradient-to-br from-white/80 to-blue-50/30 backdrop-blur-xl border border-white/30 hover:border-blue-300/50 transition-all duration-300 group hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300" />
              <CardHeader className="relative pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    {getFileIcon(doc.mimeType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base font-semibold text-slate-800 truncate">
                      {doc.fileName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs">{formatDate(doc.uploadedAt)}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3">
                <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-300/30">
                  {formatFileSize(doc.size)}
                </Badge>
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc)}
                    className="flex-1 bg-white/50 backdrop-blur-sm hover:bg-blue-50 border-blue-200/30 hover:border-blue-300/50 transition-all duration-300"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doc)}
                    className="bg-white/50 backdrop-blur-sm hover:bg-red-50 border-red-200/30 hover:border-red-300/50 text-red-600 hover:text-red-700 transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Storage Info */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-200/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <File className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-blue-700">Secure Cloud Storage</p>
                <p className="text-sm text-blue-600/80">{documents.length} document{documents.length !== 1 ? 's' : ''} stored</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 border border-emerald-300/30">
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
