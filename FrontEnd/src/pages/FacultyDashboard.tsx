import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { getErrorMessage } from "../utils/errorHandler";
import Button from "../components/presentation/Button";
import Toast from "../components/presentation/Toast";
import { BookOpen, Users, Plus, LayoutDashboard } from "lucide-react";

interface Course {
  id: number;
  code: string;
  title: string;
}

interface Assignment {
  id: number;
  studentEmail: string;
  studentName: string;
  course: Course;
}

type TabType = "overview" | "manage-tas" | "manage-courses";

const FacultyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [studentEmail, setStudentEmail] = useState("");
  const [studentName, setStudentName] = useState("");

  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [reassignTarget, setReassignTarget] = useState<Record<number, number>>(
    {}
  );

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: "error" | "success" | "info" | "warning";
  } | null>(null);

  const loadCourses = async () => {
    try {
      const res = await api.get<Course[]>("/api/faculty/my-courses");
      const list = res.data || [];
      setCourses(list);

      if (!selectedCourseId && list.length > 0) {
        setSelectedCourseId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to load courses", err);
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const loadAssignments = async (courseId: number | null) => {
    if (!courseId) {
      setAssignments([]);
      return;
    }

    try {
      const res = await api.get<Assignment[]>(
        `/api/faculty/assigned/${courseId}`
      );
      setAssignments(res.data || []);
    } catch (err) {
      console.error("Failed to load TA assignments", err);
      setAssignments([]);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadAssignments(selectedCourseId);
  }, [selectedCourseId]);

  const assignTA = async () => {
    if (!selectedCourseId) {
      setToast({ message: "Select a course first", type: "warning" });
      return;
    }
    if (!studentEmail || !studentName) {
      setToast({ message: "Enter student email AND name", type: "warning" });
      return;
    }

    try {
      await api.post("/api/faculty/assign", {
        courseId: selectedCourseId,
        studentEmail,
        studentName,
      });

      setToast({ message: "TA assigned successfully", type: "success" });
      setStudentEmail("");
      setStudentName("");

      loadAssignments(selectedCourseId);
    } catch (err: any) {
      console.error(err);
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const addCourse = async () => {
    if (!newCode || !newTitle) {
      setToast({ message: "Enter code and title!", type: "warning" });
      return;
    }

    try {
      await api.post("/api/faculty/add-course", {
        code: newCode,
        title: newTitle,
      });

      setToast({ message: "Course added successfully", type: "success" });
      setNewCode("");
      setNewTitle("");

      loadCourses();
    } catch (err: any) {
      console.error(err);
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const removeAssignment = async (assignmentId: number) => {
    if (!confirm("Remove this TA assignment?")) return;

    try {
      await api.delete(`/api/faculty/assigned/${assignmentId}`);

      setToast({ message: "Assignment removed successfully", type: "success" });
      loadAssignments(selectedCourseId);
      loadCourses();
    } catch (err: any) {
      console.error(err);
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  const reassign = async (assignmentId: number) => {
    const targetCourseId = reassignTarget[assignmentId];

    if (!targetCourseId) {
      setToast({ message: "Select a target course first", type: "warning" });
      return;
    }

    try {
      await api.put("/api/faculty/reassign", {
        assignmentId,
        targetCourseId,
      });

      setToast({ message: "TA moved successfully", type: "success" });
      loadAssignments(selectedCourseId);
      loadCourses();
    } catch (err: any) {
      console.error(err);
      setToast({ message: getErrorMessage(err), type: "error" });
    }
  };

  // Get the selected course object
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  // Calculate totals
  const totalTAs = assignments.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Faculty Dashboard
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your courses and teaching assistants
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav animate-slide-in">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <LayoutDashboard size={18} className="inline mr-2" />
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "manage-tas" ? "active" : ""}`}
            onClick={() => setActiveTab("manage-tas")}
          >
            <Users size={18} className="inline mr-2" />
            Manage TAs
          </button>
          <button
            className={`tab-button ${activeTab === "manage-courses" ? "active" : ""}`}
            onClick={() => setActiveTab("manage-courses")}
          >
            <BookOpen size={18} className="inline mr-2" />
            Manage Courses
          </button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Course Selector */}
              <div className="card-no-hover">
                <label className="block text-sm font-semibold mb-3 text-slate-700">
                  Select Active Course
                </label>
                <select
                  value={selectedCourseId ?? ""}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="input"
                >
                  <option value="">-- choose a course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium mb-1">Total Courses</p>
                      <p className="text-4xl font-bold">{courses.length}</p>
                    </div>
                    <BookOpen size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium mb-1">Total TAs</p>
                      <p className="text-4xl font-bold">{totalTAs}</p>
                    </div>
                    <Users size={40} className="opacity-80" />
                  </div>
                </div>

                <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium mb-1">Selected Course</p>
                      <p className="text-lg font-semibold truncate">
                        {selectedCourse ? selectedCourse.code : "None"}
                      </p>
                    </div>
                    <LayoutDashboard size={40} className="opacity-80" />
                  </div>
                </div>
              </div>

              {/* Current Course Info */}
              {selectedCourse && (
                <div className="card-no-hover">
                  <h3 className="font-semibold text-lg mb-3 text-slate-800">
                    Current Course Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Course Code:</span>
                      <span className="font-semibold text-slate-900">{selectedCourse.code}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Course Title:</span>
                      <span className="font-semibold text-slate-900">{selectedCourse.title}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm font-medium text-slate-600">Assigned TAs:</span>
                      <span className="badge-primary">{totalTAs}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MANAGE TAs TAB */}
          {activeTab === "manage-tas" && (
            <div className="space-y-6">
              {/* Course Selector */}
              <div className="card-no-hover bg-indigo-50 border-indigo-200">
                <label className="block text-sm font-semibold mb-3 text-slate-700">
                  Select Course to Manage TAs
                </label>
                <select
                  value={selectedCourseId ?? ""}
                  onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                  className="input"
                >
                  <option value="">-- choose a course --</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign New TA */}
              <div className="card-no-hover">
                <div className="flex items-center gap-2 mb-4">
                  <Plus size={20} className="text-indigo-600" />
                  <h3 className="font-semibold text-lg text-slate-800">
                    Assign New Teaching Assistant
                  </h3>
                </div>

                <div className="space-y-3">
                  <input
                    placeholder="Student Name"
                    className="input"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />

                  <input
                    placeholder="Student Email"
                    className="input"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                  />

                  <Button className="w-full" onClick={assignTA}>
                    <Plus size={18} />
                    Assign TA
                  </Button>
                </div>
              </div>

              {/* Assigned TAs List */}
              <div className="card-no-hover">
                <h3 className="font-semibold text-lg mb-4 text-slate-800">
                  Assigned TAs{" "}
                  <span className="badge-primary ml-2">{assignments.length}</span>
                </h3>

                {assignments.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Users size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No TAs assigned to this course yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignments.map((a) => (
                      <div
                        key={a.id}
                        className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                      >
                        <div>
                          <div className="font-semibold text-slate-900 text-lg">
                            {a.studentName}
                          </div>
                          <div className="text-sm text-slate-600">{a.studentEmail}</div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <select
                            className="input py-2 px-3 text-sm"
                            value={reassignTarget[a.id] ?? ""}
                            onChange={(e) =>
                              setReassignTarget((prev) => ({
                                ...prev,
                                [a.id]: Number(e.target.value),
                              }))
                            }
                          >
                            <option value="">Move to...</option>
                            {courses
                              .filter((c) => c.id !== a.course.id)
                              .map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.code} — {c.title}
                                </option>
                              ))}
                          </select>

                          <Button variant="outline" onClick={() => reassign(a.id)}>
                            Move
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() => removeAssignment(a.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MANAGE COURSES TAB */}
          {activeTab === "manage-courses" && (
            <div className="space-y-6">
              {/* Add New Course */}
              <div className="card-no-hover">
                <div className="flex items-center gap-2 mb-4">
                  <Plus size={20} className="text-indigo-600" />
                  <h3 className="font-semibold text-lg text-slate-800">Add New Course</h3>
                </div>

                <div className="space-y-3">
                  <input
                    placeholder="Course Code (e.g., CS301)"
                    className="input"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                  />

                  <input
                    placeholder="Course Title"
                    className="input"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />

                  <Button className="w-full" onClick={addCourse}>
                    <Plus size={18} />
                    Add Course
                  </Button>
                </div>
              </div>

              {/* All Courses List */}
              <div className="card-no-hover">
                <h3 className="font-semibold text-lg mb-4 text-slate-800">
                  All Courses{" "}
                  <span className="badge-primary ml-2">{courses.length}</span>
                </h3>

                {courses.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <BookOpen size={48} className="mx-auto mb-3 opacity-30" />
                    <p>No courses added yet. Add your first course above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <div
                        key={course.id}
                        className="border border-slate-200 rounded-lg p-5 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-lg text-slate-900 mb-1">
                              {course.code}
                            </h4>
                            <p className="text-sm text-slate-600 mb-3">{course.title}</p>
                          </div>
                          <BookOpen size={24} className="text-indigo-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default FacultyDashboard;

