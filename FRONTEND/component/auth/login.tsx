import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Pill,
  Users,
  Activity,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

interface LoginProps {
  onLogin: (email: string) => void;
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
      onLogin(formData.email);
    }
  };

  const features = [
    {
      icon: Pill,
      title: "Medicine Reminders",
      description:
        "Never miss your medications with smart reminders",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Family Health",
      description: "Monitor your family's health in one place",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Activity,
      title: "Health Tracking",
      description:
        "Track vitals and symptoms with detailed analytics",
      color: "from-green-500 to-emerald-500",
    },
    {
}