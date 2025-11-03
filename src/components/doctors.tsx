import { useState, useEffect } from "react";
import { Stethoscope, Plus, Phone, Mail, MapPin, Edit, Trash2, Search, User, Building2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email?: string;
  hospital?: string;
  address?: string;
  createdAt: string;
}

export function Doctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    hospital: "",
    address: "",
  });

  const userId = localStorage.getItem("medibell-user") || "guest";

  const specialties = [
    "General Physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Orthopedic",
    "Pediatrician",
    "Psychiatrist",
    "Gynecologist",
    "ENT Specialist",
    "Ophthalmologist",
    "Dentist",
    "Other"
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from Supabase first
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/doctors`,
          {
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`,
              "X-User-Id": userId,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setDoctors(data.doctors || []);
          // Save to localStorage as backup
          localStorage.setItem(`medibell-doctors-${userId}`, JSON.stringify(data.doctors || []));
          return;
        }
      } catch (backendError) {
        console.log("Backend not available, using local storage");
      }

      // Fallback to localStorage
      const localDoctors = localStorage.getItem(`medibell-doctors-${userId}`);
      if (localDoctors) {
        setDoctors(JSON.parse(localDoctors));
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      // Load from localStorage as final fallback
      const localDoctors = localStorage.getItem(`medibell-doctors-${userId}`);
      if (localDoctors) {
        setDoctors(JSON.parse(localDoctors));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.specialty || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const doctorData = {
        ...formData,
        id: editingDoctor?.id || `doctor-${Date.now()}`,
      };

      try {
        // Try to save to Supabase
        const url = editingDoctor
          ? `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/doctors/${editingDoctor.id}`
          : `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/doctors`;

        const response = await fetch(url, {
          method: editingDoctor ? "PUT" : "POST",
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
            "X-User-Id": userId,
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          toast.success(editingDoctor ? "Doctor updated in cloud! 👨‍⚕️☁️" : "Doctor added to cloud! 👨‍⚕️☁️");
        } else {
          throw new Error("Backend save failed");
        }
      } catch (backendError) {
        console.log("Saving to local storage");
        // Save to localStorage as fallback
        const localDoctors = localStorage.getItem(`medibell-doctors-${userId}`);
        const doctors = localDoctors ? JSON.parse(localDoctors) : [];
        
        if (editingDoctor) {
          const index = doctors.findIndex((d: Doctor) => d.id === editingDoctor.id);
          if (index !== -1) {
            doctors[index] = { ...doctors[index], ...formData };
          }
        } else {
          doctors.push(doctorData);
        }
        
        localStorage.setItem(`medibell-doctors-${userId}`, JSON.stringify(doctors));
        toast.success(editingDoctor ? "Doctor updated locally! 👨‍⚕️💾" : "Doctor added locally! 👨‍⚕️💾");
      }

      setDialogOpen(false);
      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error("Error saving doctor:", error);
      toast.error("Failed to save doctor");
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      phone: doctor.phone,
      email: doctor.email || "",
      hospital: doctor.hospital || "",
      address: doctor.address || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (doctor: Doctor) => {
    if (!confirm(`Are you sure you want to delete Dr. ${doctor.name}?`)) {
      return;
    }

    try {
      // Try to delete from Supabase
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-274198ea/doctors/${doctor.id}`,
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
      const localDoctors = localStorage.getItem(`medibell-doctors-${userId}`);
      if (localDoctors) {
        const doctors = JSON.parse(localDoctors);
        const filteredDoctors = doctors.filter((d: Doctor) => d.id !== doctor.id);
        localStorage.setItem(`medibell-doctors-${userId}`, JSON.stringify(filteredDoctors));
      }

      toast.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      console.error("Error deleting doctor:", error);
      toast.error("Failed to delete doctor");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      specialty: "",
      phone: "",
      email: "",
      hospital: "",
      address: "",
    });
    setEditingDoctor(null);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleCallDoctor = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleEmailDoctor = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.hospital?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-500/20 via-emerald-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-emerald-600/10 to-green-600/10" />
        <div className="relative p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-xl flex-shrink-0">
                <Stethoscope className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent">
                  My Doctors
                </h1>
                <p className="text-sm md:text-base text-slate-600 mt-1">Keep all your doctor contacts in one place</p>
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 h-10 md:h-11">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="text-sm md:text-base">Add Doctor</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/90 backdrop-blur-xl border-white/30 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                    {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingDoctor ? "Update doctor information" : "Add a doctor to your contacts"}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Doctor Name *</Label>
                      <Input
                        id="name"
                        placeholder="Dr. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty *</Label>
                      <Select 
                        value={formData.specialty} 
                        onValueChange={(value) => setFormData({ ...formData, specialty: value })}
                      >
                        <SelectTrigger className="bg-white/70 backdrop-blur-sm">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map(spec => (
                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="doctor@hospital.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-white/70 backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Clinic</Label>
                    <Input
                      id="hospital"
                      placeholder="City Hospital"
                      value={formData.hospital}
                      onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                      className="bg-white/70 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Medical Street, City"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="bg-white/70 backdrop-blur-sm"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
                    >
                      {editingDoctor ? "Update Doctor" : "Add Doctor"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogClose(false)}
                      className="bg-white/50 backdrop-blur-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
        <Input
          placeholder="Search doctors by name, specialty, or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-white/70 backdrop-blur-sm border-white/30 focus:bg-white/90 transition-all duration-300"
        />
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading doctors...</p>
        </div>
      ) : filteredDoctors.length === 0 ? (
        <Card className="bg-gradient-to-br from-slate-50 to-emerald-50/30 backdrop-blur-xl border-white/30">
          <CardContent className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-200 to-emerald-200 flex items-center justify-center">
              <Stethoscope className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              {searchQuery ? "No doctors found" : "No doctors added yet"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchQuery 
                ? "Try a different search term"
                : "Add your first doctor to keep their contact information handy"
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card 
              key={doctor.id}
              className="relative overflow-hidden bg-gradient-to-br from-white/80 to-emerald-50/30 backdrop-blur-xl border border-white/30 hover:border-emerald-300/50 transition-all duration-300 group hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/5 group-hover:to-emerald-500/5 transition-all duration-300" />
              <CardHeader className="relative pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Dr. {doctor.name}
                    </CardTitle>
                    <Badge className="mt-1 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-700 border border-teal-300/30">
                      {doctor.specialty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-3">
                {/* Phone */}
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="w-4 h-4 text-teal-600" />
                  <span className="flex-1">{doctor.phone}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleCallDoctor(doctor.phone)}
                    className="h-8 px-2 hover:bg-teal-50"
                  >
                    <Phone className="w-3 h-3" />
                  </Button>
                </div>

                {/* Email */}
                {doctor.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <span className="flex-1 truncate">{doctor.email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEmailDoctor(doctor.email!)}
                      className="h-8 px-2 hover:bg-teal-50"
                    >
                      <Mail className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Hospital */}
                {doctor.hospital && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <Building2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{doctor.hospital}</span>
                  </div>
                )}

                {/* Address */}
                {doctor.address && (
                  <div className="flex items-start gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                    <span className="flex-1">{doctor.address}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-emerald-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(doctor)}
                    className="flex-1 bg-white/50 backdrop-blur-sm hover:bg-emerald-50 border-emerald-200/30 hover:border-emerald-300/50 transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(doctor)}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-teal-500/10 to-emerald-500/10 backdrop-blur-xl border border-teal-200/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-teal-600/80">Total Doctors</p>
                <p className="text-2xl font-bold text-teal-700">{doctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-200/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600/80">Specialties</p>
                <p className="text-2xl font-bold text-blue-700">
                  {new Set(doctors.map(d => d.specialty)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-200/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-violet-600/80">Emergency Contacts</p>
                <p className="text-2xl font-bold text-violet-700">{doctors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
