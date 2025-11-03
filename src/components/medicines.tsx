import { useState } from "react";
import { Plus, Search, Clock, Pill, Edit, Trash2, Bell, AlertCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  type: string;
  prescribedBy: string;
  startDate: string;
  endDate?: string;
  stock: number;
  instructions: string;
  active: boolean;
}

export function Medicines() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      times: ["8:00 AM", "8:00 PM"],
      type: "Tablet",
      prescribedBy: "Dr. Smith",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      stock: 28,
      instructions: "Take with food",
      active: true
    },
    {
      id: 2,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once daily",
      times: ["8:00 AM"],
      type: "Capsule",
      prescribedBy: "Dr. Johnson",
      startDate: "2024-02-01",
      stock: 45,
      instructions: "Take with breakfast",
      active: true
    },
    {
      id: 3,
      name: "Omega-3",
      dosage: "1000mg",
      frequency: "Once daily",
      times: ["2:00 PM"],
      type: "Soft gel",
      prescribedBy: "Dr. Wilson",
      startDate: "2024-01-20",
      stock: 12,
      instructions: "Take with meals",
      active: true
    },
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      times: ["8:00 PM"],
      type: "Tablet",
      prescribedBy: "Dr. Brown",
      startDate: "2024-01-10",
      stock: 22,
      instructions: "Take at the same time daily",
      active: true
    }
  ]);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (stock: number) => {
    if (stock <= 7) return { label: "Low Stock", color: "destructive", bgColor: "from-red-500/10 to-rose-500/10", borderColor: "border-red-200/30" };
    if (stock <= 14) return { label: "Medium Stock", color: "secondary", bgColor: "from-amber-500/10 to-orange-500/10", borderColor: "border-amber-200/30" };
    return { label: "Good Stock", color: "default", bgColor: "from-green-500/10 to-emerald-500/10", borderColor: "border-green-200/30" };
  };

  const handleAddMedicine = (medicineData: any) => {
    const newMedicine: Medicine = {
      ...medicineData,
      id: Math.max(...medicines.map(m => m.id), 0) + 1,
      stock: parseInt(medicineData.stock) || 0,
      times: medicineData.times.filter((time: string) => time.trim() !== ""),
      active: true
    };
    
    setMedicines(prev => [...prev, newMedicine]);
    setIsAddDialogOpen(false);
    toast.success("Medicine added successfully! 💊", {
      description: `${newMedicine.name} has been added to your medication list.`,
    });
  };

  const handleUpdateMedicine = (updatedMedicine: Medicine) => {
    setMedicines(prev => 
      prev.map(med => 
        med.id === updatedMedicine.id ? updatedMedicine : med
      )
    );
    setEditingMedicine(null);
    toast.success("Medicine updated successfully! ✏️", {
      description: `${updatedMedicine.name} details have been updated.`,
    });
  };

  const handleDeleteMedicine = (medicineId: number) => {
    const medicine = medicines.find(m => m.id === medicineId);
    setMedicines(prev => prev.filter(med => med.id !== medicineId));
    toast.success("Medicine deleted successfully! 🗑️", {
      description: `${medicine?.name} has been removed from your list.`,
    });
  };

  return (
    <div className="p-6 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10 backdrop-blur-xl border border-blue-200/30">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            My Medicines
          </h1>
          <p className="text-blue-600/80 mt-1">Manage your medication schedule and tracking</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl">
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-white/30">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Add New Medicine
              </DialogTitle>
              <DialogDescription className="text-blue-600/80">
                Add a new medicine to your medication schedule with reminders and tracking.
              </DialogDescription>
            </DialogHeader>
            <AddMedicineForm onClose={() => setIsAddDialogOpen(false)} onAdd={handleAddMedicine} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/50 backdrop-blur-sm border-white/40 focus:bg-white/70 transition-all duration-300"
        />
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => {
          const stockStatus = getStockStatus(medicine.stock);
          return (
            <Card key={medicine.id} className={`relative overflow-hidden bg-gradient-to-br ${stockStatus.bgColor} backdrop-blur-xl border ${stockStatus.borderColor} hover:border-opacity-50 transition-all duration-300 group hover:scale-105`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-800">{medicine.name}</CardTitle>
                    <p className="text-sm text-slate-600">{medicine.dosage} • {medicine.type}</p>
                  </div>
                  <Badge 
                    variant={stockStatus.color}
                    className="bg-white/50 backdrop-blur-sm border border-white/30"
                  >
                    {stockStatus.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium">Frequency</p>
                    <p className="text-slate-700">{medicine.frequency}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Stock</p>
                    <p className="text-slate-700 flex items-center gap-1">
                      {medicine.stock} pills
                      {medicine.stock <= 7 && <AlertCircle className="w-3 h-3 text-red-500" />}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-sm mb-2 font-medium">Times</p>
                  <div className="flex flex-wrap gap-2">
                    {medicine.times.map((time, index) => (
                      <Badge key={index} variant="outline" className="gap-1 bg-white/40 backdrop-blur-sm border-white/40">
                        <Clock className="w-3 h-3" />
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-slate-500 text-sm font-medium">Prescribed by</p>
                  <p className="text-sm text-slate-700">{medicine.prescribedBy}</p>
                </div>

                {medicine.instructions && (
                  <div>
                    <p className="text-slate-500 text-sm font-medium">Instructions</p>
                    <p className="text-sm text-slate-700">{medicine.instructions}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4 border-t border-white/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-white/30 backdrop-blur-sm border-white/40 hover:bg-white/50"
                    onClick={() => setEditingMedicine(medicine)}
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 bg-red-500/10 backdrop-blur-sm border-red-300/40 hover:bg-red-500/20 text-red-600"
                    onClick={() => handleDeleteMedicine(medicine.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No medicines found */}
      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
            <Pill className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-slate-800">No medicines found</h3>
          <p className="text-slate-600 mb-6">
            {searchTerm ? `No medicines match "${searchTerm}"` : "You haven't added any medicines yet"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
            <Plus className="w-4 h-4" />
            Add Your First Medicine
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingMedicine} onOpenChange={() => setEditingMedicine(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/90 backdrop-blur-xl border border-white/30">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Medicine
            </DialogTitle>
            <DialogDescription className="text-blue-600/80">
              Update your medicine details, dosage, timing, and other information.
            </DialogDescription>
          </DialogHeader>
          {editingMedicine && (
            <EditMedicineForm 
              medicine={editingMedicine} 
              onClose={() => setEditingMedicine(null)} 
              onUpdate={handleUpdateMedicine} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddMedicineForm({ onClose, onAdd }: { onClose: () => void; onAdd: (medicine: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    type: "",
    frequency: "",
    times: [""],
    prescribedBy: "",
    startDate: "",
    endDate: "",
    stock: "",
    instructions: "",
    reminders: true
  });

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every other day",
    "Weekly",
    "As needed"
  ];

  const medicineTypes = [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Cream/Ointment",
    "Drops",
    "Inhaler",
    "Patch"
  ];

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, ""]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency) {
      toast.error("Please fill in required fields!");
      return;
    }
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Medicine Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Metformin"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 500mg"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {medicineTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="frequency">Frequency *</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map(freq => (
                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Reminder Times</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTimeSlot} className="bg-white/30 backdrop-blur-sm border-white/40">
            <Plus className="w-4 h-4 mr-1" />
            Add Time
          </Button>
        </div>
        <div className="space-y-2">
          {formData.times.map((time, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => updateTimeSlot(index, e.target.value)}
                className="flex-1 bg-white/50 backdrop-blur-sm border-white/40"
              />
              {formData.times.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  className="bg-red-500/10 backdrop-blur-sm border-red-300/40 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="prescribedBy">Prescribed By</Label>
          <Input
            id="prescribedBy"
            value={formData.prescribedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
            placeholder="e.g., Dr. Smith"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="stock">Current Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="Number of pills"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date (Optional)</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="instructions">Special Instructions</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="e.g., Take with food, avoid alcohol..."
          rows={3}
          className="bg-white/50 backdrop-blur-sm border-white/40"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="reminders"
          checked={formData.reminders}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminders: checked as boolean }))}
        />
        <Label htmlFor="reminders">Enable reminder notifications</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="bg-white/30 backdrop-blur-sm border-white/40">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
          <Check className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>
    </form>
  );
}

function EditMedicineForm({ medicine, onClose, onUpdate }: { medicine: Medicine; onClose: () => void; onUpdate: (medicine: Medicine) => void }) {
  const [formData, setFormData] = useState({
    name: medicine.name || "",
    dosage: medicine.dosage || "",
    type: medicine.type || "",
    frequency: medicine.frequency || "",
    times: medicine.times || [""],
    prescribedBy: medicine.prescribedBy || "",
    startDate: medicine.startDate || "",
    endDate: medicine.endDate || "",
    stock: medicine.stock?.toString() || "",
    instructions: medicine.instructions || "",
    reminders: medicine.active !== false
  });

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every other day",
    "Weekly",
    "As needed"
  ];

  const medicineTypes = [
    "Tablet",
    "Capsule",
    "Liquid",
    "Injection",
    "Cream/Ointment",
    "Drops",
    "Inhaler",
    "Patch"
  ];

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      times: [...prev.times, ""]
    }));
  };

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage || !formData.frequency) {
      toast.error("Please fill in required fields!");
      return;
    }

    const updatedMedicine = {
      ...medicine,
      ...formData,
      stock: parseInt(formData.stock) || 0,
      times: formData.times.filter(time => time.trim() !== "")
    };

    onUpdate(updatedMedicine);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Medicine Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Metformin"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="edit-dosage">Dosage *</Label>
          <Input
            id="edit-dosage"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 500mg"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {medicineTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="edit-frequency">Frequency *</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger className="bg-white/50 backdrop-blur-sm border-white/40">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {frequencies.map(freq => (
                <SelectItem key={freq} value={freq}>{freq}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Reminder Times</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTimeSlot} className="bg-white/30 backdrop-blur-sm border-white/40">
            <Plus className="w-4 h-4 mr-1" />
            Add Time
          </Button>
        </div>
        <div className="space-y-2">
          {formData.times.map((time, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="time"
                value={time}
                onChange={(e) => updateTimeSlot(index, e.target.value)}
                className="flex-1 bg-white/50 backdrop-blur-sm border-white/40"
              />
              {formData.times.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeTimeSlot(index)}
                  className="bg-red-500/10 backdrop-blur-sm border-red-300/40 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-prescribedBy">Prescribed By</Label>
          <Input
            id="edit-prescribedBy"
            value={formData.prescribedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
            placeholder="e.g., Dr. Smith"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="edit-stock">Current Stock</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
            placeholder="Number of pills"
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-startDate">Start Date</Label>
          <Input
            id="edit-startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
        <div>
          <Label htmlFor="edit-endDate">End Date (Optional)</Label>
          <Input
            id="edit-endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className="bg-white/50 backdrop-blur-sm border-white/40"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="edit-instructions">Special Instructions</Label>
        <Textarea
          id="edit-instructions"
          value={formData.instructions}
          onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
          placeholder="e.g., Take with food, avoid alcohol..."
          rows={3}
          className="bg-white/50 backdrop-blur-sm border-white/40"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-reminders"
          checked={formData.reminders}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, reminders: checked as boolean }))}
        />
        <Label htmlFor="edit-reminders">Enable reminder notifications</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="bg-white/30 backdrop-blur-sm border-white/40">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
          <Check className="w-4 h-4 mr-2" />
          Update Medicine
        </Button>
      </div>
    </form>
  );
}