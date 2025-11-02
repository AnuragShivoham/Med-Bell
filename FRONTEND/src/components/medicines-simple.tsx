import { useState } from "react";
import { Plus, Search, Clock, Pill, Edit, Trash2, Bell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

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
}

export function MedicinesSimple() {
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
      color: "from-amber-500 to-yellow-500"
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
      color: "from-blue-500 to-cyan-500"
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
      color: "from-emerald-500 to-green-500"
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
      color: "from-red-500 to-rose-500"
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
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg">
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
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
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
    </div>
  );
}
