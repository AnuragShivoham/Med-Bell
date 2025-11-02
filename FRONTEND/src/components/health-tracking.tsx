import { useState } from "react";
import { Plus, Calendar, TrendingUp, TrendingDown, Heart, Activity, Thermometer, Weight, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export function HealthTracking() {
  const [isAddVitalDialogOpen, setIsAddVitalDialogOpen] = useState(false);
  const [isAddSymptomDialogOpen, setIsAddSymptomDialogOpen] = useState(false);

  const vitals = [
    {
      id: 1,
      type: "Blood Pressure",
      value: "120/80",
      unit: "mmHg",
      date: "2024-01-06",
      time: "08:30",
      status: "Normal",
      icon: Heart,
      color: "text-green-600"
    },
    {
      id: 2,
      type: "Heart Rate",
      value: "72",
      unit: "bpm",
      date: "2024-01-06",
      time: "08:30",
      status: "Normal",
      icon: Activity,
      color: "text-green-600"
    },
    {
      id: 3,
      type: "Body Temperature",
      value: "98.6",
      unit: "°F",
      date: "2024-01-05",
      time: "19:00",
      status: "Normal",
      icon: Thermometer,
      color: "text-green-600"
    },
    {
      id: 4,
      type: "Weight",
      value: "68",
      unit: "kg",
      date: "2024-01-05",
      time: "07:00",
      status: "Stable",
      icon: Weight,
      color: "text-blue-600"
    }
  ];

  const symptoms = [
    {
      id: 1,
      symptom: "Headache",
      severity: "Mild",
      date: "2024-01-06",
      duration: "2 hours",
      notes: "Started after working on computer for long hours",
      triggers: ["Screen time", "Stress"]
    },
    {
      id: 2,
      symptom: "Fatigue",
      severity: "Moderate",
      date: "2024-01-05",
      duration: "All day",
      notes: "Feeling tired despite getting enough sleep",
      triggers: ["Poor sleep quality"]
    }
  ];

  const bloodPressureData = [
    { date: "Jan 1", systolic: 118, diastolic: 78 },
    { date: "Jan 2", systolic: 122, diastolic: 82 },
    { date: "Jan 3", systolic: 120, diastolic: 80 },
    { date: "Jan 4", systolic: 115, diastolic: 75 },
    { date: "Jan 5", systolic: 125, diastolic: 85 },
    { date: "Jan 6", systolic: 120, diastolic: 80 }
  ];

  const weightData = [
    { date: "Dec 1", weight: 70 },
    { date: "Dec 8", weight: 69.5 },
    { date: "Dec 15", weight: 69 },
    { date: "Dec 22", weight: 68.5 },
    { date: "Dec 29", weight: 68.2 },
    { date: "Jan 5", weight: 68 }
  ];

  const symptomFrequency = [
    { symptom: "Headache", count: 3 },
    { symptom: "Fatigue", count: 5 },
    { symptom: "Nausea", count: 1 },
    { symptom: "Dizziness", count: 2 }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "mild": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "severe": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1>Health Tracking</h1>
          <p className="text-muted-foreground">Monitor your vitals, symptoms, and health trends</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddVitalDialogOpen} onOpenChange={setIsAddVitalDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Vital
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vital Signs</DialogTitle>
                <DialogDescription>
                  Record your vital signs like blood pressure, heart rate, weight, and temperature.
                </DialogDescription>
              </DialogHeader>
              <AddVitalForm onClose={() => setIsAddVitalDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddSymptomDialogOpen} onOpenChange={setIsAddSymptomDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Log Symptom
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Symptom</DialogTitle>
                <DialogDescription>
                  Record any symptoms or health concerns you're experiencing for tracking.
                </DialogDescription>
              </DialogHeader>
              <AddSymptomForm onClose={() => setIsAddSymptomDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vitals">Vitals</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Latest Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {vitals.map((vital) => {
                  const IconComponent = vital.icon;
                  return (
                    <div key={vital.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className={`w-5 h-5 ${vital.color}`} />
                        <p className="font-medium">{vital.type}</p>
                      </div>
                      <p className="text-2xl font-bold">{vital.value}</p>
                      <p className="text-sm text-muted-foreground">{vital.unit}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className={vital.color}>
                          {vital.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">{vital.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#dc2626" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#2563eb" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vitals" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blood Pressure History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bloodPressureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="systolic" stroke="#dc2626" strokeWidth={2} name="Systolic" />
                    <Line type="monotone" dataKey="diastolic" stroke="#2563eb" strokeWidth={2} name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weight Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#059669" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {vitals.map((vital) => {
                  const IconComponent = vital.icon;
                  return (
                    <div key={vital.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 ${vital.color}`} />
                        <div>
                          <p className="font-medium">{vital.type}</p>
                          <p className="text-sm text-muted-foreground">{vital.date} at {vital.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{vital.value} {vital.unit}</p>
                        <Badge variant="outline" className={vital.color}>
                          {vital.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={symptomFrequency}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symptom" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Symptom Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {symptoms.map((symptom) => (
                  <div key={symptom.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{symptom.symptom}</h4>
                        <Badge className={getSeverityColor(symptom.severity)}>
                          {symptom.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{symptom.date}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Duration: {symptom.duration}</p>
                    <p className="text-sm mb-2">{symptom.notes}</p>
                    {symptom.triggers.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Possible triggers:</p>
                        <div className="flex flex-wrap gap-1">
                          {symptom.triggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Monthly Health Summary</h4>
                    <p className="text-sm text-muted-foreground">January 2024 comprehensive report</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Download
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Blood Work Results</h4>
                    <p className="text-sm text-muted-foreground">Lab results from December 2023</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Medication Adherence Report</h4>
                    <p className="text-sm text-muted-foreground">Quarterly adherence analysis</p>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Upload className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddVitalForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    type: "",
    value: "",
    unit: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
    notes: ""
  });

  const vitalTypes = [
    { name: "Blood Pressure", unit: "mmHg" },
    { name: "Heart Rate", unit: "bpm" },
    { name: "Body Temperature", unit: "°F" },
    { name: "Weight", unit: "kg" },
    { name: "Blood Sugar", unit: "mg/dL" },
    { name: "Oxygen Saturation", unit: "%" }
  ];

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="type">Vital Type *</Label>
        <Select 
          value={formData.type} 
          onValueChange={(value) => {
            const vital = vitalTypes.find(v => v.name === value);
            setFormData(prev => ({ 
              ...prev, 
              type: value,
              unit: vital?.unit || ""
            }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select vital type" />
          </SelectTrigger>
          <SelectContent>
            {vitalTypes.map(vital => (
              <SelectItem key={vital.name} value={vital.name}>{vital.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="value">Value *</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            placeholder="e.g., 120/80"
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
            placeholder="e.g., mmHg"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Add Vital
        </Button>
      </div>
    </form>
  );
}

function AddSymptomForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    symptom: "",
    severity: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }).slice(0, 5),
    duration: "",
    triggers: "",
    notes: ""
  });

  const commonSymptoms = [
    "Headache", "Fatigue", "Nausea", "Dizziness", "Fever", "Cough", 
    "Sore throat", "Muscle pain", "Joint pain", "Shortness of breath"
  ];

  const severityLevels = ["Mild", "Moderate", "Severe"];

  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="symptom">Symptom *</Label>
        <Select value={formData.symptom} onValueChange={(value) => setFormData(prev => ({ ...prev, symptom: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select or type symptom" />
          </SelectTrigger>
          <SelectContent>
            {commonSymptoms.map(symptom => (
              <SelectItem key={symptom} value={symptom}>{symptom}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="severity">Severity *</Label>
        <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            {severityLevels.map(level => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="time">Time</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          value={formData.duration}
          onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
          placeholder="e.g., 2 hours, all day"
        />
      </div>

      <div>
        <Label htmlFor="triggers">Possible Triggers</Label>
        <Input
          id="triggers"
          value={formData.triggers}
          onChange={(e) => setFormData(prev => ({ ...prev, triggers: e.target.value }))}
          placeholder="e.g., stress, food, weather"
        />
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Describe the symptom in more detail..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Log Symptom
        </Button>
      </div>
    </form>
  );
}