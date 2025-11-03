import { useState } from "react";
import { Plus, Search, Calendar, Clock, Pill, UserPlus, Settings, Bell, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";

export function Family() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddFamilyDialogOpen, setIsAddFamilyDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const familyMembers = [
    {
      id: 1,
      name: "Mom",
      age: 58,
      relationship: "Mother",
      email: "mom@example.com",
      phone: "+1234567890",
      avatar: "https://images.unsplash.com/photo-1758691463331-2ac00e6f676f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxmYW1pbHklMjBoZWFsdGhjYXJlJTIwZG9jdG9yfGVufDF8fHx8MTc1OTc3MjE5OXww&ixlib=rb-4.1.0&q=80&w=150",
      medicines: [
        { name: "Blood Pressure Med", time: "8:00 AM", taken: true },
        { name: "Calcium", time: "12:00 PM", taken: false },
        { name: "Vitamin B12", time: "8:00 PM", taken: false }
      ],
      nextMedicine: "12:00 PM - Calcium",
      adherenceRate: 92,
      conditions: ["Hypertension", "Osteoporosis"],
      emergencyContact: true
    },
    {
      id: 2,
      name: "Dad",
      age: 62,
      relationship: "Father",
      email: "dad@example.com", 
      phone: "+1234567891",
      avatar: "",
      medicines: [
        { name: "Metformin", time: "8:00 AM", taken: true },
        { name: "Statin", time: "8:00 PM", taken: false }
      ],
      nextMedicine: "8:00 PM - Statin",
      adherenceRate: 88,
      conditions: ["Diabetes Type 2", "High Cholesterol"],
      emergencyContact: true
    },
    {
      id: 3,
      name: "Sister",
      age: 25,
      relationship: "Sister",
      email: "sister@example.com",
      phone: "+1234567892",
      avatar: "",
      medicines: [
        { name: "Birth Control", time: "9:00 AM", taken: true }
      ],
      nextMedicine: "Tomorrow - 9:00 AM",
      adherenceRate: 96,
      conditions: [],
      emergencyContact: false
    },
    {
      id: 4,
      name: "Grandpa",
      age: 84,
      relationship: "Grandfather",
      email: "",
      phone: "+1234567893",
      avatar: "",
      medicines: [
        { name: "Heart Medication", time: "6:00 AM", taken: true },
        { name: "Aspirin", time: "12:00 PM", taken: true },
        { name: "Blood Thinner", time: "6:00 PM", taken: false },
        { name: "Sleep Aid", time: "10:00 PM", taken: false }
      ],
      nextMedicine: "6:00 PM - Blood Thinner",
      adherenceRate: 85,
      conditions: ["Heart Disease", "Insomnia"],
      emergencyContact: true
    }
  ];

  const filteredMembers = familyMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Family Health</h1>
          <p className="text-muted-foreground">Monitor and manage your family's medications</p>
        </div>
        <Dialog open={isAddFamilyDialogOpen} onOpenChange={setIsAddFamilyDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Add Family Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
              <DialogDescription>
                Add a new family member to share health tracking and medication management.
              </DialogDescription>
            </DialogHeader>
            <AddFamilyMemberForm onClose={() => setIsAddFamilyDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search family members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Family Members Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedMember(member.id.toString())}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.name} />
                  ) : (
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{member.relationship}, {member.age}</p>
                </div>
                {member.emergencyContact && (
                  <Badge variant="destructive" className="text-xs">
                    Emergency
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Medicines Today</span>
                <span>{member.medicines.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Adherence Rate</span>
                <span className={getAdherenceColor(member.adherenceRate)}>
                  {member.adherenceRate}%
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Next Medicine</p>
                <p className="text-sm font-medium">{member.nextMedicine}</p>
              </div>

              {member.conditions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Conditions</p>
                  <div className="flex flex-wrap gap-1">
                    {member.conditions.slice(0, 2).map((condition, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                    {member.conditions.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.conditions.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed View Dialog */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <FamilyMemberDetails 
              member={familyMembers.find(m => m.id.toString() === selectedMember)!}
              onClose={() => setSelectedMember(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No family members found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? `No family members match "${searchTerm}"` : "Add family members to monitor their health"}
          </p>
          <Button onClick={() => setIsAddFamilyDialogOpen(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Family Member
          </Button>
        </div>
      )}
    </div>
  );
}

function AddFamilyMemberForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    relationship: "",
    email: "",
    phone: "",
    emergencyContact: false
  });

  const relationships = [
    "Father", "Mother", "Son", "Daughter", "Brother", "Sister", 
    "Grandfather", "Grandmother", "Uncle", "Aunt", "Cousin", "Spouse", "Other"
  ];

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            placeholder="Enter age"
          />
        </div>
        <div>
          <Label htmlFor="relationship">Relationship *</Label>
          <Select value={formData.relationship} onValueChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationships.map(rel => (
                <SelectItem key={rel} value={rel}>{rel}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="Enter email address"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          placeholder="Enter phone number"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Member
        </Button>
      </div>
    </form>
  );
}

function FamilyMemberDetails({ member, onClose }: { member: any; onClose: () => void }) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div>
      <DialogHeader className="pb-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {member.avatar ? (
              <AvatarImage src={member.avatar} alt={member.name} />
            ) : (
              <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <DialogTitle className="text-2xl">{member.name}</DialogTitle>
            <DialogDescription className="text-base">
              {member.relationship}, {member.age} years old
            </DialogDescription>
            {member.emergencyContact && (
              <Badge variant="destructive" className="mt-1">Emergency Contact</Badge>
            )}
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="health">Health Info</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="medicines" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Today's Medicines</h3>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Medicine
            </Button>
          </div>

          <div className="space-y-3">
            {member.medicines.map((medicine: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${medicine.taken ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <div>
                    <p className="font-medium">{medicine.name}</p>
                    <p className="text-sm text-muted-foreground">{medicine.time}</p>
                  </div>
                </div>
                {!medicine.taken && (
                  <Button size="sm" variant="outline">
                    Mark Taken
                  </Button>
                )}
                {medicine.taken && (
                  <Badge variant="secondary">Taken</Badge>
                )}
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-medium mb-2">Adherence Rate</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This Month</span>
                <span className={getAdherenceColor(member.adherenceRate)}>{member.adherenceRate}%</span>
              </div>
              <Progress value={member.adherenceRate} className="h-2" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          {member.conditions.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Medical Conditions</h4>
              <div className="flex flex-wrap gap-2">
                {member.conditions.map((condition: string, index: number) => (
                  <Badge key={index} variant="outline">{condition}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Health Metrics</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Pressure</p>
                      <p className="font-medium">120/80 mmHg</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Medications</p>
                      <p className="font-medium">{member.medicines.length} active</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="space-y-3">
            {member.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{member.email}</p>
              </div>
            )}
            {member.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{member.phone}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="gap-2">
              <Bell className="w-4 h-4" />
              Send Reminder
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Edit Info
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  function getAdherenceColor(rate: number) {
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-yellow-600";
    return "text-red-600";
  }
}