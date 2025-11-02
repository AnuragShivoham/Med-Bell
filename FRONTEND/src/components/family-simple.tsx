import { useState } from "react";
import { Plus, Search, Calendar, Clock, Pill, Heart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";

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

  const [familyMembers] = useState<FamilyMember[]>([
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
        <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg">
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
              <Button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white">
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
    </div>
  );
}
