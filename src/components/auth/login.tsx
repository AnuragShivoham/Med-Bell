import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";


interface LoginProps {
  onLogin: (email: string, name?: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email) {
      // Save user name to localStorage when signing up or logging in
      const userName = formData.name || formData.email.split('@')[0];
      localStorage.setItem('medibell-user-name', userName);
      onLogin(formData.email, userName);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
        src="/src/assets/IntroVideo.mp4"
      />

      {/* Overlay for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-violet-900/30 to-fuchsia-900/40 backdrop-blur-sm" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-center">

        {/* Capsule-Shaped Login Form */}
        <div className="w-full max-w-md">
          <div className="relative">
            {/* Capsule Shape Container */}
            <div className="bg-white/95 backdrop-blur-xl rounded-[60px] shadow-2xl border-4 border-white/50 p-8 lg:p-10">
              
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-8 h-8 text-violet-600" />
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                    MediBELL
                  </h1>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-slate-600 text-sm">
                  {isSignUp
                    ? "IT'S TIME TO BE WELL"
                    : "Sign in to manage your health"}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="h-12 bg-violet-50/50 border-2 border-violet-200 focus:border-violet-500 rounded-2xl"
                      required={isSignUp}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-violet-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="h-12 pl-12 bg-violet-50/50 border-2 border-violet-200 focus:border-violet-500 rounded-2xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-violet-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="h-12 pl-12 pr-12 bg-violet-50/50 border-2 border-violet-200 focus:border-violet-500 rounded-2xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-4 text-violet-500 hover:text-violet-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 w-5 h-5 text-violet-500" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="h-12 pl-12 bg-violet-50/50 border-2 border-violet-200 focus:border-violet-500 rounded-2xl"
                        required={isSignUp}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 hover:from-violet-700 hover:via-purple-700 hover:to-fuchsia-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl"
                >
                  {isSignUp ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or continue with</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Button
                    type="button"
                    className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 font-semibold shadow-lg border-2 border-gray-200 hover:border-gray-300 rounded-2xl"
                    onClick={() => {
                      localStorage.setItem('medibell-user-name', 'Google User');
                      onLogin("user@gmail.com", "Google User");
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                  </Button>

                  <Button
                    type="button"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold shadow-lg rounded-2xl"
                    onClick={() => {
                      localStorage.setItem('medibell-user-name', 'Demo User');
                      onLogin("demo@medibell.com", "Demo User");
                    }}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Quick Demo
                  </Button>


                </div>
              </div>

              {!isSignUp && (
                <div className="mt-4 text-center">
                  <button className="text-sm text-violet-600 hover:text-violet-800 font-medium transition-colors">
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-white/90 drop-shadow-lg">
              By continuing, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>


    </div>
  );
}
