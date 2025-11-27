import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    if (user) {
      logout();
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo & Brand */}
        <Link
          to="/"
          onClick={handleHomeClick}
          className="flex items-center gap-3 group"
        >
          <div className="rounded-xl p-2 bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md group-hover:shadow-lg transition-shadow">
            <GraduationCap className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TA Portal
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
          >
            Home
          </Link>
          <Link
            to="/faculty"
            className="text-slate-600 hover:text-indigo-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50"
          >
            Dashboard
          </Link>
          {/* <Link
            to="/login"
            className="btn btn-primary px-4 py-2 text-sm"
          >
            Login
          </Link> */}
        </div>
      </div>
    </div>
  );
}
