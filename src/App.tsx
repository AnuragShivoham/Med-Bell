import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Pill, 
  Users, 
  Activity, 
  User, 
  Menu, 
  X,
  Bell,
  Search,
  LogOut,
  Sparkles,
  Heart,
  FileText,
  Stethoscope
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Dashboard } from "./components/dashboard";
import { MedicinesSimple } from "./components/medicines-simple";
import { FamilySimple } from "./components/family-simple";
import { ProfileSimple } from "./components/profile-simple";
import { Login } from "./components/auth/login";
import { MedicalDocuments } from "./components/medical-documents";
import { Doctors } from "./components/doctors";
import { HealthTracking } from "./components/health-tracking";
import { Chatbot } from "./components/chatbot";
import { Toaster } from "./components/ui/sonner";
import { SplashScreen } from "./components/splash-screen";


export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);


  // Disable zoom on mobile devices
  useEffect(() => {
    // Add or update viewport meta tag to prevent zooming
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.setAttribute('name', 'viewport');
      document.head.appendChild(viewportMeta);
    }
    
    viewportMeta.setAttribute(
      'content',
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );

    // Prevent double-tap zoom on iOS
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (event: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);



  const handleLogin = (email: string, name?: string) => {
    setUser(email);
    localStorage.setItem("medibell-user", email);
    if (name) {
      localStorage.setItem("medibell-user-name", name);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("medibell-user");
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-violet-500 to-purple-500" },
    { id: "medicines", label: "Medicines", icon: Pill, gradient: "from-blue-500 to-cyan-500" },
    { id: "documents", label: "Medical Documents", icon: FileText, gradient: "from-cyan-500 to-blue-500" },
    { id: "doctors", label: "My Doctors", icon: Stethoscope, gradient: "from-teal-500 to-emerald-500" },
    { id: "family", label: "Family", icon: Users, gradient: "from-pink-500 to-rose-500" },
    { id: "health", label: "Health Tracking", icon: Activity, gradient: "from-emerald-500 to-green-500" },
    { id: "profile", label: "Profile", icon: User, gradient: "from-amber-500 to-orange-500" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "medicines":
        return <MedicinesSimple />;
      case "documents":
        return <MedicalDocuments />;
      case "doctors":
        return <Doctors />;
      case "family":
        return <FamilySimple />;
      case "health":
        return <HealthTracking />;
      case "profile":
        return <ProfileSimple />;
      default:
        return <Dashboard />;
    }
  };



  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl border-r border-white/30 z-50 transform transition-all duration-300 ease-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                MediBELL
              </h1>
              <p className="text-xs text-slate-500">Health Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-white/20"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search features..."
              className="pl-10 bg-white/50 backdrop-blur-sm border-white/30 focus:bg-white/70 transition-all duration-300"
            />
          </div>
        </div>



        {/* Navigation */}
        <nav className="px-4 space-y-2 flex-1 overflow-y-auto pb-52">
          {navigation.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl transform scale-105` 
                    : 'hover:bg-white/40 text-slate-600 hover:text-slate-800 hover:transform hover:scale-102'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <IconComponent className={`w-5 h-5 relative z-10 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                <span className="relative z-10 font-medium truncate">{item.label}</span>
                {isActive && <Sparkles className="w-4 h-4 ml-auto text-white/80 animate-pulse shrink-0" />}
              </button>
            );
          })}
        </nav>


      </div>

      {/* Main Content */}
      <div className="lg:ml-72 min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/30 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5" />
          
          <div className="flex items-center gap-2 sm:gap-4 relative z-10 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-white/30 backdrop-blur-sm shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent capitalize truncate">
                {navigation.find(nav => nav.id === activeTab)?.label || "Dashboard"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">Manage your health with ease</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative z-10 shrink-0">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hover:bg-white/30 backdrop-blur-sm rounded-xl p-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-red-400 to-rose-400 rounded-full animate-ping" />
              </div>
            </Button>

            {/* Sign Out Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hover:bg-white/30 backdrop-blur-sm transition-all duration-300 rounded-xl p-2"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </Button>

            {/* User Menu */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("profile")}
              className="flex items-center gap-2 sm:gap-3 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 rounded-xl p-2 sm:px-4 sm:py-2"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="font-medium text-slate-800 truncate max-w-[120px]">
                  {user?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-slate-500">Premium Member</p>
              </div>
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-73px)] sm:min-h-[calc(100vh-89px)] relative">
          {renderContent()}
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />

      <Toaster position="top-right" />
    </div>
    </>
  );
}