import { useState } from "react";
import { Plus, Search, Clock, Pill, Edit, Trash2, Bell, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner@2.0.3";

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  type: string;
  withFood: boolean;
  startDate: string;
  endDate: string;
  notes: string;
  color: string;
  stock: number; // Total stock available
  stockUnit: string; // e.g., "tablets", "capsules", "ml"
}

export function MedicinesSimple() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 1,
      name: "Vitamin D3",
      dosage: "1000 IU",
      frequency: "Once Daily",
      times: ["8:00 AM"],
      type: "Vitamin",
      withFood: true,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      notes: "Take with breakfast for better absorption",
      color: "from-amber-500 to-yellow-500",
      stock: 45,
      stockUnit: "tablets"
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      frequency: "Twice Daily",
      times: ["8:00 AM", "8:00 PM"],
      type: "Diabetes",
      withFood: true,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      notes: "For blood sugar control",
      color: "from-blue-500 to-cyan-500",
      stock: 60,
      stockUnit: "tablets"
    },
    {
      id: 3,
      name: "Omega-3",
      dosage: "1000mg",
      frequency: "Once Daily",
      times: ["2:00 PM"],
      type: "Supplement",
      withFood: true,
      startDate: "2025-01-01",
      endDate: "2025-06-30",
      notes: "Heart health supplement",
      color: "from-emerald-500 to-green-500",
      stock: 30,
      stockUnit: "capsules"
    },
    {
      id: 4,
      name: "Lisinopril",
      dosage: "10mg",
      frequency: "Once Daily",
      times: ["8:00 PM"],
      type: "Blood Pressure",
      withFood: false,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      notes: "Blood pressure medication",
      color: "from-red-500 to-rose-500",
      stock: 28,
      stockUnit: "tablets"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      "Vitamin": "bg-amber-500/10 text-amber-700 border-amber-300/30",
      "Diabetes": "bg-blue-500/10 text-blue-700 border-blue-300/30",
      "Supplement": "bg-emerald-500/10 text-emerald-700 border-emerald-300/30",
      "Blood Pressure": "bg-red-500/10 text-red-700 border-red-300/30",
      "Pain Relief": "bg-purple-500/10 text-purple-700 border-purple-300/30",
      "Antibiotic": "bg-pink-500/10 text-pink-700 border-pink-300/30",
      "Other": "bg-slate-500/10 text-slate-700 border-slate-300/30"
    };
    return colors[type] || colors["Other"];
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            My Medicines
          </h1>
          <p className="text-slate-600 mt-1">Manage your medication schedule</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search medicines by name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/50 border-white/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Medicines</p>
                <p className="text-2xl font-bold text-blue-700">{medicines.length}</p>
              </div>
              <Pill className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Today's Doses</p>
                <p className="text-2xl font-bold text-emerald-700">8</p>
              </div>
              <Clock className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Upcoming</p>
                <p className="text-2xl font-bold text-amber-700">3</p>
              </div>
              <Bell className="w-10 h-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-2xl font-bold text-purple-700">5</p>
              </div>
              <Check className="w-10 h-10 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medicine List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMedicines.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30">
            <CardContent className="py-12 text-center">
              <Pill className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No medicines found</h3>
              <p className="text-slate-500 mb-4">Try adjusting your search or add a new medicine</p>
            </CardContent>
          </Card>
        ) : (
          filteredMedicines.map((medicine) => (
            <Card key={medicine.id} className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-br ${medicine.color} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Pill className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{medicine.name}</CardTitle>
                        <p className="text-sm text-slate-600">{medicine.dosage} • {medicine.frequency}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={() => {
                        setEditingMedicine(medicine);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setMedicines(prev => prev.filter(m => m.id !== medicine.id));
                        toast.success("Medicine deleted successfully!");
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getTypeColor(medicine.type)}>
                      {medicine.type}
                    </Badge>
                    {medicine.withFood && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300/30">
                        Take with food
                      </Badge>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-slate-600 mb-2">Schedule:</p>
                    <div className="flex flex-wrap gap-2">
                      {medicine.times.map((time, idx) => (
                        <Badge key={idx} variant="outline" className="bg-slate-50 text-slate-700">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {medicine.notes && (
                    <div className="bg-blue-50/50 border border-blue-200/30 rounded-lg p-3">
                      <p className="text-sm text-slate-700">{medicine.notes}</p>
                    </div>
                  )}

                  {/* Stock Information */}
                  <div className="bg-gradient-to-r from-violet-50/50 to-purple-50/50 border border-violet-200/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Pill className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Current Stock</p>
                          <p className="font-bold text-slate-800">
                            {medicine.stock} {medicine.stockUnit}
                          </p>
                        </div>
                      </div>
                      {medicine.stock && medicine.stock <= 10 && (
                        <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-orange-700 border border-orange-300/30">
                          Low Stock
                        </Badge>
                      )}
                      {medicine.stock && medicine.stock === 0 && (
                        <Badge className="bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-700 border border-red-300/30">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      {medicine.startDate} to {medicine.endDate}
                    </p>
                    <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-green-500 text-white">
                      <Check className="w-4 h-4 mr-1" />
                      Mark as Taken
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Medicine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Add New Medicine
            </DialogTitle>
            <DialogDescription>
              Add a new medicine to your medication schedule.
            </DialogDescription>
          </DialogHeader>
          <AddMedicineForm 
            onClose={() => setIsAddDialogOpen(false)}
            onAdd={(newMed) => {
              const medicine: Medicine = {
                ...newMed,
                id: Math.max(...medicines.map(m => m.id), 0) + 1,
              };
              setMedicines(prev => [...prev, medicine]);
              setIsAddDialogOpen(false);
              toast.success(`${medicine.name} added successfully!`);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Edit Medicine
            </DialogTitle>
            <DialogDescription>
              Update your medicine details.
            </DialogDescription>
          </DialogHeader>
          {editingMedicine && (
            <EditMedicineForm 
              medicine={editingMedicine}
              onClose={() => {
                setIsEditDialogOpen(false);
                setEditingMedicine(null);
              }}
              onUpdate={(updatedMed) => {
                setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
                setIsEditDialogOpen(false);
                setEditingMedicine(null);
                toast.success(`${updatedMed.name} updated successfully!`);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddMedicineForm({ onClose, onAdd }: { onClose: () => void; onAdd: (medicine: Partial<Medicine>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "Once Daily",
    times: ["08:00"],
    type: "Other",
    withFood: false,
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    notes: "",
    color: "from-blue-500 to-cyan-500",
    stock: 30,
    stockUnit: "tablets"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
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
            placeholder="e.g., Aspirin"
            className="bg-white/50"
          />
        </div>
        <div>
          <Label htmlFor="dosage">Dosage *</Label>
          <Input
            id="dosage"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            placeholder="e.g., 500mg"
            className="bg-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vitamin">Vitamin</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
              <SelectItem value="Pain Relief">Pain Relief</SelectItem>
              <SelectItem value="Antibiotic">Antibiotic</SelectItem>
              <SelectItem value="Supplement">Supplement</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="frequency">Frequency</Label>
          <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
            <SelectTrigger className="bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Once Daily">Once Daily</SelectItem>
              <SelectItem value="Twice Daily">Twice Daily</SelectItem>
              <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
              <SelectItem value="As Needed">As Needed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="bg-white/50"
          />
        </div>
        <div>
          <Label htmlFor="stockUnit">Stock Unit</Label>
          <Select value={formData.stockUnit} onValueChange={(value) => setFormData(prev => ({ ...prev, stockUnit: value }))}>
            <SelectTrigger className="bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tablets">Tablets</SelectItem>
              <SelectItem value="capsules">Capsules</SelectItem>
              <SelectItem value="ml">ML</SelectItem>
              <SelectItem value="doses">Doses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Special instructions..."
          className="bg-white/50"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
          Add Medicine
        </Button>
      </div>
    </form>
  );
}

function EditMedicineForm({ medicine, onClose, onUpdate }: { medicine: Medicine; onClose: () => void; onUpdate: (medicine: Medicine) => void }) {
  const [formData, setFormData] = useState(medicine);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) {
      toast.error("Please fill in required fields!");
      return;
    }
    onUpdate(formData);
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
            className="bg-white/50"
          />
        </div>
        <div>
          <Label htmlFor="edit-dosage">Dosage *</Label>
          <Input
            id="edit-dosage"
            value={formData.dosage}
            onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            className="bg-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-stock">Stock Quantity</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
            className="bg-white/50"
          />
        </div>
        <div>
          <Label htmlFor="edit-type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="bg-white/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Vitamin">Vitamin</SelectItem>
              <SelectItem value="Diabetes">Diabetes</SelectItem>
              <SelectItem value="Blood Pressure">Blood Pressure</SelectItem>
              <SelectItem value="Pain Relief">Pain Relief</SelectItem>
              <SelectItem value="Antibiotic">Antibiotic</SelectItem>
              <SelectItem value="Supplement">Supplement</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="edit-notes">Notes</Label>
        <Textarea
          id="edit-notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="bg-white/50"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-blue-600 to-cyan-600">
          Update Medicine
        </Button>
      </div>
    </form>
  );
}
