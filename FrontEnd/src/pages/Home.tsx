import { GraduationCap, ArrowRight } from "lucide-react";

const BACKEND = import.meta.env.BACKEND_URL || "http://localhost:8080";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-slate-100 p-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <div className="relative z-10 text-center animate-fade-in">
        {/* Logo/Icon */}
        <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white mb-8 shadow-xl animate-scale-in">
          <GraduationCap size={40} strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold mb-4 text-slate-900 tracking-tight">
          TA Registration Portal
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
          Streamline teaching assistant assignments and manage courses with ease
        </p>

        {/* CTA Button */}
        <button
          className="btn btn-primary text-lg px-8 py-4 rounded-xl shadow-lg group"
          onClick={() =>
            (window.location.href = `${BACKEND}/oauth2/authorization/google`)
          }
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-6 h-6"
          />
          Login with Google
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </button>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft hover:shadow-medium transition-all">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-lg mb-2">Manage Courses</h3>
            <p className="text-sm text-slate-600">Add and organize your courses effortlessly</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft hover:shadow-medium transition-all">
            <div className="text-3xl mb-3">👨‍🎓</div>
            <h3 className="font-semibold text-lg mb-2">Assign TAs</h3>
            <p className="text-sm text-slate-600">Quickly assign teaching assistants to courses</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-soft hover:shadow-medium transition-all">
            <div className="text-3xl mb-3">🔄</div>
            <h3 className="font-semibold text-lg mb-2">Easy Reassignment</h3>
            <p className="text-sm text-slate-600">Move TAs between courses seamlessly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

