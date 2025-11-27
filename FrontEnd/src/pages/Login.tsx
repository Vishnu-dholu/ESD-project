import React from "react";
import Button from "../components/presentation/Button";
import { GraduationCap, ArrowRight } from "lucide-react";

const BACKEND = import.meta.env.BACKEND_URL || "http://localhost:8080";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 animate-scale-in">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-6 shadow-lg">
              <GraduationCap size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Faculty Login</h1>
            <p className="text-slate-600">
              Sign in using your university Google account
            </p>
          </div>

          {/* Login Button */}
          <a
            href={`${BACKEND}/oauth2/authorization/google`}
            className="block w-full"
          >
            <Button className="w-full py-3.5 text-base flex items-center justify-center gap-3 group">
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              Continue with Google
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
          </a>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Secure authentication powered by Google OAuth 2.0
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-slate-600 animate-fade-in">
          <p>Need help? Contact your system administrator</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

