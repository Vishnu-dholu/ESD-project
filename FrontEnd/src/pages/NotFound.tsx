import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import Button from "../components/presentation/Button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Large Text */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-12 animate-slide-in">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-slate-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-slate-500">
            The URL might be mistyped or the page may have been moved.
          </p>
        </div>

        {/* Search Icon Illustration */}
        <div className="mb-12 flex justify-center">
          <div className="bg-white p-8 rounded-full shadow-lg animate-bounce-slow">
            <Search size={64} className="text-indigo-500" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full">
              <Home size={18} />
              Go to Home
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600 mb-4">You might want to visit:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Home
            </Link>
            <Link
              to="/login"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Login
            </Link>
            <Link
              to="/faculty"
              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Faculty Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
