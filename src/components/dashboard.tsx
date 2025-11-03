import { useState, useEffect } from "react";
import { Clock, Pill, CheckCircle2, Bell, VolumeX, Volume2, Heart, TrendingUp, Zap, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { SlideToAction } from "./slide-to-action";
import { getCurrentTime24, formatTime, isTimeToTakeMedicine } from "../utils/time-utils";

interface MedicineWithStock {
  id: number;
  name: string;
  time: string;
  taken: boolean;
  dosage: string;
  stock?: number;
  stockUnit?: string;
}

export function Dashboard() {
  const [userName, setUserName] = useState("");
  const [medicines, setMedicines] = useState<MedicineWithStock[]>([
    { id: 1, name: "Vitamin D3", time: "8:00 AM", taken: true, dosage: "1000 IU", stock: 45, stockUnit: "tablets" },
    { id: 2, name: "Metformin", time: "12:00 PM", taken: false, dosage: "500mg", stock: 60, stockUnit: "tablets" },
    { id: 3, name: "Omega-3", time: "2:00 PM", taken: false, dosage: "1000mg", stock: 30, stockUnit: "capsules" },
    { id: 4, name: "Lisinopril", time: "8:00 PM", taken: false, dosage: "10mg", stock: 28, stockUnit: "tablets" }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [showSlideNotification, setShowSlideNotification] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState<MedicineWithStock | null>(null);

  useEffect(() => {
    // Get user name from localStorage
    const savedName = localStorage.getItem('medibell-user-name') || 'User';
    setUserName(savedName);

    // Listen for user name updates
    const handleUserNameUpdate = () => {
      const updatedName = localStorage.getItem('medibell-user-name') || 'User';
      setUserName(updatedName);
    };

    window.addEventListener('userNameUpdated', handleUserNameUpdate);
    return () => window.removeEventListener('userNameUpdated', handleUserNameUpdate);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && soundEnabled) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
    }
  }, [soundEnabled]);

  // Alarm system - check every minute if it's time to take medicine
  useEffect(() => {
    const checkMedicineTime = () => {
      const currentTime = getCurrentTime24();
      
      medicines.forEach(medicine => {
        if (!medicine.taken) {
          // Convert medicine time to 24h format for comparison
          let medicineTime24 = medicine.time;
          if (medicine.time.includes('AM') || medicine.time.includes('PM')) {
            const [time, modifier] = medicine.time.split(' ');
            const [hours, minutes] = time.split(':');
            let hour = parseInt(hours);
            
            if (modifier === 'PM' && hour !== 12) {
              hour += 12;
            } else if (modifier === 'AM' && hour === 12) {
              hour = 0;
            }
            
            medicineTime24 = `${String(hour).padStart(2, '0')}:${minutes}`;
          }
          
          if (isTimeToTakeMedicine(medicineTime24, currentTime)) {
            handleTriggerReminder(medicine);
          }
        }
      });
    };

    // Check immediately
    checkMedicineTime();

    // Check every minute
    const interval = setInterval(checkMedicineTime, 60000);

    return () => clearInterval(interval);
  }, [medicines, soundEnabled]);

  const playNotificationSound = () => {
    if (!audioContext || !soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const markMedicineTaken = (medicineId: number) => {
    setMedicines(prev => 
      prev.map(med => {
        if (med.id === medicineId) {
          // Decrease stock by 1
          const newStock = (med.stock || 0) - 1;
          
          // Show low stock warning
          if (newStock <= 5 && newStock > 0) {
            toast.warning(`Low stock alert for ${med.name}! 📦`, {
              description: `Only ${newStock} ${med.stockUnit} remaining.`,
            });
          } else if (newStock === 0) {
            toast.error(`Out of stock: ${med.name}! ⚠️`, {
              description: "Please restock immediately.",
            });
          }
          
          return { ...med, taken: true, stock: newStock };
        }
        return med;
      })
    );
    
    playNotificationSound();
    toast.success("Medicine marked as taken! 💊", {
      description: "Great job staying on track with your medication!",
    });
  };

  const handleTriggerReminder = (medicine: MedicineWithStock) => {
    setCurrentMedicine(medicine);
    setShowSlideNotification(true);
    playNotificationSound();
  };

  const handleMedicineTaken = () => {
    if (currentMedicine) {
      markMedicineTaken(currentMedicine.id);
      setShowSlideNotification(false);
      setCurrentMedicine(null);
    }
  };

  const handleMedicineNotTaken = () => {
    if (currentMedicine) {
      toast.info(`${currentMedicine.name} marked as not taken`, {
        description: "We'll remind you again later.",
      });
      setShowSlideNotification(false);
      setCurrentMedicine(null);
    }
  };

  const getNextMedicine = () => {
    const pendingMedicines = medicines.filter(med => !med.taken);
    return pendingMedicines.length > 0 ? pendingMedicines[0] : null;
  };

  const getTakenMedicines = () => {
    return medicines.filter(med => med.taken);
  };

  const nextMedicine = getNextMedicine();
  const takenMedicines = getTakenMedicines();
  const pendingCount = medicines.length - takenMedicines.length;
  const adherenceRate = Math.round((takenMedicines.length / medicines.length) * 100);

  return (
    <div className="p-6 space-y-8 min-h-screen">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/10 to-fuchsia-600/10" />
        <div className="relative p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-xl">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                Good Morning, {userName}! 
              </h1>
              <p className="text-lg text-slate-600 mt-1">Ready to take care of your health today?</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-300"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-violet-600" /> : <VolumeX className="w-4 h-4 text-violet-600" />}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl border border-blue-200/30 hover:border-blue-300/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-blue-600/80 text-sm">Total Medicines</p>
                <p className="text-2xl font-bold text-blue-700">{medicines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-purple-200/30 hover:border-purple-300/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-purple-600/80 text-sm">Family Members</p>
                <p className="text-2xl font-bold text-purple-700">3</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl border border-emerald-200/30 hover:border-emerald-300/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-emerald-600/80 text-sm">Health Score</p>
                <p className="text-2xl font-bold text-emerald-700">92/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xl border border-violet-200/30 hover:border-violet-300/50 transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-violet-600/80 text-sm">Adherence</p>
                <p className="text-2xl font-bold text-violet-700">{adherenceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Medicine Section */}
      {nextMedicine && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-indigo-200/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5" />
          <CardHeader className="relative text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Next Medicine
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative text-center space-y-6">
            <div className="p-8 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-xl">
                <Pill className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">{nextMedicine.name}</h3>
              <p className="text-xl text-slate-600 mb-4 flex items-center justify-center gap-2">
                <span className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-3 py-1 rounded-full text-indigo-700">
                  {nextMedicine.dosage}
                </span>
                <span className="text-slate-400">•</span>
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full text-purple-700">
                  {formatTime(nextMedicine.time)}
                </span>
              </p>
              {nextMedicine.stock !== undefined && (
                <div className="mb-6 inline-block bg-gradient-to-r from-violet-100/50 to-purple-100/50 border border-violet-200/30 rounded-full px-4 py-2">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="font-semibold">Stock:</span>
                    <span className="font-bold text-violet-700">{nextMedicine.stock} {nextMedicine.stockUnit}</span>
                    {nextMedicine.stock <= 5 && (
                      <span className="text-amber-600">⚠️ Low</span>
                    )}
                  </p>
                </div>
              )}
              <Button
                onClick={() => handleTriggerReminder(nextMedicine)}
                className="px-8 py-4 text-lg bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl"
              >
                <Bell className="w-5 h-5 mr-3" />
                Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Done State */}
      {!nextMedicine && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/10 via-green-500/10 to-teal-500/10 backdrop-blur-xl border border-emerald-200/30 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/5 via-green-600/5 to-teal-600/5" />
          <CardContent className="relative text-center p-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-xl">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
              All Done! 🎉
            </h3>
            <p className="text-xl text-emerald-600 mb-6">You've taken all your medicines for today. Outstanding work!</p>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-700 font-medium">Health Score: 100/100</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Medicines */}
      {takenMedicines.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl border border-green-200/30 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5" />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Completed Today ({takenMedicines.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative space-y-4">
            {takenMedicines.map((medicine) => (
              <div key={medicine.id} className="flex items-center justify-between p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-green-200/30 hover:border-green-300/50 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 shadow-sm animate-pulse" />
                  <div>
                    <p className="font-semibold text-slate-800">{medicine.name}</p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <span>{medicine.dosage}</span>
                      <span className="text-slate-400">•</span>
                      <span>{formatTime(medicine.time)}</span>
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-300/30 backdrop-blur-sm">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Taken
                </Badge>
              </div>
            ))}
            
            {/* Progress Bar */}
            <div className="mt-6 p-4 rounded-xl bg-white/30 backdrop-blur-sm border border-green-200/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">Today's Progress</span>
                <span className="text-sm font-bold text-green-600">{adherenceRate}%</span>
              </div>
              <Progress 
                value={adherenceRate} 
                className="h-2 bg-green-100/50" 
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slide to Action Notification */}
      {showSlideNotification && currentMedicine && (
        <SlideToAction
          medicineName={currentMedicine.name}
          onTaken={handleMedicineTaken}
          onNotTaken={handleMedicineNotTaken}
        />
      )}
    </div>
  );
}