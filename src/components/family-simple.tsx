import { useState } from "react";
import { Plus, Search, Calendar, Clock, Pill, Heart, Users, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  age: number;
  medicines: number;
  healthScore: number;
  upcomingMeds: number;
  avatar: string;
  color: string;
}

export function FamilySimple() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      relation: "Self",
      age: 32,
      medicines: 4,
      healthScore: 92,
      upcomingMeds: 2,
      avatar: "SJ",
      color: "from-violet-500 to-purple-500"
    },
    {
      id: 2,
      name: "Mike Johnson",
      relation: "Spouse",
      age: 35,
      medicines: 2,
      healthScore: 88,
      upcomingMeds: 1,
      avatar: "MJ",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      name: "Emma Johnson",
      relation: "Daughter",
      age: 8,
      medicines: 1,
      healthScore: 95,
      upcomingMeds: 0,
      avatar: "EJ",
      color: "from-pink-500 to-rose-500"
    }
  ]);

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            Family Health
          </h1>
          <p className="text-slate-600 mt-1">Monitor your family's health together</p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search family members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/50 border-white/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Family Members</p>
                <p className="text-2xl font-bold text-pink-700">{familyMembers.length}</p>
              </div>
              <Users className="w-10 h-10 text-pink-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Medicines</p>
                <p className="text-2xl font-bold text-blue-700">
                  {familyMembers.reduce((acc, m) => acc + m.medicines, 0)}
                </p>
              </div>
              <Pill className="w-10 h-10 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Upcoming Doses</p>
                <p className="text-2xl font-bold text-amber-700">
                  {familyMembers.reduce((acc, m) => acc + m.upcomingMeds, 0)}
                </p>
              </div>
              <Clock className="w-10 h-10 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-300/30 backdrop-blur-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Avg Health Score</p>
                <p className="text-2xl font-bold text-emerald-700">
                  {Math.round(familyMembers.reduce((acc, m) => acc + m.healthScore, 0) / familyMembers.length)}
                </p>
              </div>
              <Heart className="w-10 h-10 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Family Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <Avatar className={`w-16 h-16 bg-gradient-to-br ${member.color} shadow-lg`}>
                  <AvatarFallback className="text-white font-bold text-lg">
                    {member.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-slate-600">{member.relation} • {member.age} years</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Health Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Health Score</span>
                  <span className="font-bold text-emerald-600">{member.healthScore}/100</span>
                </div>
                <Progress value={member.healthScore} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50/50 border border-blue-200/30 rounded-lg p-3">
                  <p className="text-xs text-slate-600 mb-1">Medicines</p>
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-blue-700">{member.medicines}</span>
                  </div>
                </div>
                <div className="bg-amber-50/50 border border-amber-200/30 rounded-lg p-3">
                  <p className="text-xs text-slate-600 mb-1">Upcoming</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-700">{member.upcomingMeds}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={() => setSelectedMember(member)}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-xl border border-white/30">
          <CardContent className="py-12 text-center">
            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No family members found</h3>
            <p className="text-slate-500">Try adjusting your search</p>
          </CardContent>
        </Card>
      )}

      {/* Add Family Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Add Family Member
            </DialogTitle>
            <DialogDescription>
              Add a new family member to monitor their health.
            </DialogDescription>
          </DialogHeader>
          <AddFamilyForm
            onClose={() => setIsAddDialogOpen(false)}
            onAdd={(newMember) => {
              const colors = ["from-violet-500 to-purple-500", "from-blue-500 to-cyan-500", "from-pink-500 to-rose-500", "from-emerald-500 to-green-500"];
              const member: FamilyMember = {
                ...newMember,
                id: Math.max(...familyMembers.map(m => m.id), 0) + 1,
                medicines: 0,
                healthScore: 85,
                upcomingMeds: 0,
                avatar: newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
                color: colors[familyMembers.length % colors.length]
              };
              setFamilyMembers(prev => [...prev, member]);
              setIsAddDialogOpen(false);
              toast.success(`${member.name} added to family!`);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Family Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className={`w-20 h-20 bg-gradient-to-br ${selectedMember.color} shadow-lg`}>
                  <AvatarFallback className="text-white font-bold text-2xl">
                    {selectedMember.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">{selectedMember.name}</h3>
                  <p className="text-slate-600">{selectedMember.relation} • {selectedMember.age} years</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Pill className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedMember.medicines}</p>
                      <p className="text-sm text-slate-600">Medicines</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Heart className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedMember.healthScore}</p>
                      <p className="text-sm text-slate-600">Health Score</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{selectedMember.upcomingMeds}</p>
                      <p className="text-sm text-slate-600">Upcoming</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMember(null)}>
                  Close
                </Button>
                <Button className="bg-gradient-to-r from-pink-600 to-purple-600">
                  Manage Medicines
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddFamilyForm({ onClose, onAdd }: { onClose: () => void; onAdd: (member: Partial<FamilyMember>) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    relation: "",
    age: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.relation || formData.age <= 0) {
      toast.error("Please fill in all fields!");
      return;
    }
    onAdd(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter name"
          className="bg-white/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="relation">Relation *</Label>
          <Select value={formData.relation} onValueChange={(value) => setFormData(prev => ({ ...prev, relation: value }))}>
            <SelectTrigger className="bg-white/50">
              <SelectValue placeholder="Select relation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Self">Self</SelectItem>
              <SelectItem value="Spouse">Spouse</SelectItem>
              <SelectItem value="Son">Son</SelectItem>
              <SelectItem value="Daughter">Daughter</SelectItem>
              <SelectItem value="Father">Father</SelectItem>
              <SelectItem value="Mother">Mother</SelectItem>
              <SelectItem value="Brother">Brother</SelectItem>
              <SelectItem value="Sister">Sister</SelectItem>
              <SelectItem value="Grandfather">Grandfather</SelectItem>
              <SelectItem value="Grandmother">Grandmother</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
            placeholder="Enter age"
            className="bg-white/50"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600">
          Add Member
        </Button>
      </div>
    </form>
  );
}
