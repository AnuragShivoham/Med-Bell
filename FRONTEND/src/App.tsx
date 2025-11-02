import { useState, useEffect, useRef } from "react";
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
  Stethoscope,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Dashboard } from "./components/dashboard";
import { MedicinesSimple } from "./components/medicines-simple";
import { FamilySimple } from "./components/family-simple";
import { ProfileSimple } from "./components/profile-simple";
import { Login } from "./components/auth/login";
import { MedicalDocuments } from "./components/medical-documents";
import { Doctors } from "./components/doctors";
import { HealthTracking } from "./components/health-tracking";
import { HealthTips } from "./components/health-tips";
import { Toaster } from "./components/ui/sonner";
import IntroVideo from "./components/IntroVideo";
import { supabase } from "./utils/supabase/client";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setShowScrollButtons(scrollTop > 50 || scrollTop < scrollHeight - clientHeight - 50);
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const handleSignIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Login error:', error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    if (error) {
      console.error('Sign up error:', error.message);
    } else {
      setUser(data.user);
    }
  };

  const handleGoogleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) {
      console.error('Google sign in error:', error.message);
    }
  };

  const handleDemoSignIn = () => {
    // Set a mock user for demo mode
    setUser({
      id: 'demo-user',
      email: 'demo@medibell.com',
      user_metadata: {
        name: 'Demo User',
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleIntroEnd = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <IntroVideo onEnd={handleIntroEnd} />;
  }

  if (!user) {
    return <Login onLogin={handleSignIn} />;
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, gradient: "from-violet-500 to-purple-500" },
    { id: "medicines", label: "Medicines", icon: Pill, gradient: "from-blue-500 to-cyan-500" },
    { id: "documents", label: "Medical Documents", icon: FileText, gradient: "from-cyan-500 to-blue-500" },
    { id: "doctors", label: "My Doctors", icon: Stethoscope, gradient: "from-teal-500 to-emerald-500" },
    { id: "family", label: "Family", icon: Users, gradient: "from-pink-500 to-rose-500" },
    { id: "health", label: "Health Tracking", icon: Activity, gradient: "from-emerald-500 to-green-500" },
    { id: "tips", label: "Health Tips", icon: Heart, gradient: "from-green-500 to-emerald-500" },
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
      case "tips":
        return <HealthTips />;
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



        {/* Scrollable Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto relative">
          {/* Scroll Buttons */}
          {showScrollButtons && (
            <>
              <Button
                onClick={scrollToTop}
                size="sm"
                className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-white/30 shadow-lg"
              >
                <ChevronUp className="w-4 h-4" />
              </Button>
              <Button
                onClick={scrollToBottom}
                size="sm"
                className="absolute bottom-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90 border border-white/30 shadow-lg"
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Quick Stats */}
          <div className="p-4 border-b border-white/20">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Today's Medicines</span>
                <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-300/30 backdrop-blur-sm">
                  4
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Family Members</span>
                <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border border-purple-300/30 backdrop-blur-sm">
                  3
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Health Score</span>
                <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 border border-emerald-300/30 backdrop-blur-sm">
                  92/100
                </Badge>
              </div>
            </div>
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
          <nav className="px-4 space-y-2 pb-4">
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
                  <IconComponent className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                  {isActive && <Sparkles className="w-4 h-4 ml-auto text-white/80 animate-pulse" />}
                </button>
              );
            })}
          </nav>




        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Navigation */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/30 px-6 py-4 flex items-center justify-between shadow-lg relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5" />
          
          <div className="flex items-center gap-4 relative z-10">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden hover:bg-white/30 backdrop-blur-sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="hidden md:block">
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent capitalize">
                {navigation.find(nav => nav.id === activeTab)?.label || "Dashboard"}
              </h2>
              <p className="text-sm text-slate-500">Manage your health with ease</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative hover:bg-white/30 backdrop-blur-sm rounded-xl">
              <Bell className="w-5 h-5 text-slate-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-full shadow-lg">
                <div className="w-full h-full bg-gradient-to-r from-red-400 to-rose-400 rounded-full animate-ping" />
              </div>
            </Button>

            {/* User Menu with Sign Out */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-3 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 rounded-xl px-4 py-2"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="font-medium text-slate-800">
                      {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                    </p>
                    <p className="text-xs text-slate-500">Premium Member</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-89px)] relative">
          {renderContent()}
        </main>
      </div>
    </div>
    </>
  );
}