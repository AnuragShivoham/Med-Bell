import { useState } from "react";
import { User, Bell, Shield, Settings, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";

export function ProfileSimple() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Sarah Johnson",
    email: "demo@medibell.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "1993-05-15",
    bloodGroup: "O+",
    height: "165 cm",
    weight: "62 kg",
    allergies: "Penicillin, Peanuts"
  });

  const [notifications, setNotifications] = useState({
    medicineReminders: true,
    familyUpdates: true,
    healthTips: false,
    emailNotifications: true
  });

  const handleSave = () => {
    setIsEditing(false);
    // Show success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-slate-600 mt-1">Manage your account and preferences</p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <Avatar className="w-32 h-32 bg-gradient-to-br from-amber-500 to-orange-500 shadow-2xl">
                  <AvatarFallback className="text-white text-4xl font-bold">
                    SJ
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h3 className="font-bold text-xl">{profile.name}</h3>
                <p className="text-sm text-slate-600">{profile.email}</p>
              </div>
              <div className="w-full pt-4 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-blue-700">4</p>
                    <p className="text-xs text-slate-600">Medicines</p>
                  </div>
                  <div className="bg-emerald-50/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-emerald-700">92</p>
                    <p className="text-xs text-slate-600">Health Score</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                <CardTitle>Personal Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <CardTitle>Health Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="blood">Blood Group</Label>
                  <Input
                    id="blood"
                    value={profile.bloodGroup}
                    onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    disabled={!isEditing}
                    className="mt-1 bg-white/50"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  value={profile.allergies}
                  onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 bg-white/50"
                  placeholder="e.g., Penicillin, Peanuts"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <CardTitle>Notification Preferences</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Medicine Reminders</p>
                  <p className="text-sm text-slate-600">Get notified about upcoming doses</p>
                </div>
                <Switch
                  checked={notifications.medicineReminders}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, medicineReminders: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Family Updates</p>
                  <p className="text-sm text-slate-600">Receive family health notifications</p>
                </div>
                <Switch
                  checked={notifications.familyUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, familyUpdates: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Health Tips</p>
                  <p className="text-sm text-slate-600">Weekly health tips and advice</p>
                </div>
                <Switch
                  checked={notifications.healthTips}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, healthTips: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-600">Receive notifications via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
