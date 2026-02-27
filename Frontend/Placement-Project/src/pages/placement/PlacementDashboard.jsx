import { useState, useEffect } from "react";
import studentsData from "../../data/students";

export default function PlacementDashboard() {
  const [courseOpen, setCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");

  // ✅ NEW: students state (instead of filtering directly)
  const [students, setStudents] = useState([]);

  // ✅ Extract companies (for dropdown only)
  const companies = [
    ...new Set(
      studentsData.flatMap((student) =>
        student.placements?.map((p) => p.company)
      )
    ),
  ];

  // ✅ Simulate backend filtering
  useEffect(() => {
    // In real world:
    // fetch(`/api/students?course=${selectedCourse}&company=${selectedCompany}&search=${search}`)
    //   .then(res => res.json())
    //   .then(data => setStudents(data));

    // For now simulate backend using timeout
    const timer = setTimeout(() => {
      let result = studentsData;

      if (selectedCourse) {
        result = result.filter((s) => s.course === selectedCourse);
      }

      if (search) {
        result = result.filter(
          (s) =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.enrollment.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (selectedCompany) {
        result = result.filter((s) =>
          s.placements?.some(
            (p) => p.company === selectedCompany
          )
        );
      }

      setStudents(result);
    }, 300); // simulate network delay

    return () => clearTimeout(timer);
  }, [selectedCourse, search, selectedCompany]);

  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  const handleSend = () => {
    const selectedData = students.filter((s) =>
      selectedStudents.includes(s.id)
    );

    console.log("Sending students:", selectedData);
    alert(`Sent ${selectedData.length} students`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>

      {/* Controls */}
      <div className="flex gap-4 items-center mb-6 flex-wrap relative">
        {/* Course Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCourseOpen(!courseOpen)}
            className="px-4 py-2 bg-slate-800 text-white rounded-md"
          >
            {selectedCourse || "Select Course"} ▾
          </button>

          {courseOpen && (
            <div className="absolute mt-2 w-40 bg-white shadow-lg rounded-md z-10">
              {["MCA", "BCA", "BBA"].map((course) => (
                <p
                  key={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    setCourseOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-slate-100 cursor-pointer"
                >
                  {course}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search name or enrollment"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md outline-none w-64"
        />

        {/* Filter Button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Filter ⚙
        </button>

        {/* Filter Card */}
        {filterOpen && (
          <div className="absolute top-14 right-0 w-64 bg-white shadow-xl rounded-lg p-4 border z-20">
            <h2 className="font-semibold mb-3">Filter Options</h2>

            <label className="block text-sm mb-1">
              Company Drive
            </label>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full border px-3 py-2 rounded-md mb-3"
            >
              <option value="">All Companies</option>
              {companies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <button
              onClick={() => setSelectedCompany("")}
              className="w-full bg-red-500 text-white py-2 rounded-md"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-slate-200 text-left">
            <tr>
              <th className="px-4 py-2">Select</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Enrollment</th>
              <th className="px-4 py-2">GitHub</th>
              <th className="px-4 py-2">LeetCode</th>
              <th className="px-4 py-2">Mock Avg</th>
            </tr>
          </thead>

          <tbody>
            {students.length > 0 ? (
              students.map((student) => {
                const mockAvg =
                  student.mockTests.reduce((a, b) => a + b, 0) /
                  student.mockTests.length;

                return (
                  <tr key={student.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                      />
                    </td>

                    <td className="px-4 py-2 font-medium text-blue-600 hover:underline">
                      <a href={`students/${student.id}`}>
                        {student.name}
                      </a>
                    </td>

                    <td className="px-4 py-2">
                      {student.enrollment}
                    </td>

                    <td className="px-4 py-2 text-blue-600">
                      {student.github}
                    </td>

                    <td className="px-4 py-2 text-yellow-600">
                      {student.leetcode}
                    </td>

                    <td className="px-4 py-2 font-semibold">
                      {mockAvg.toFixed(1)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSend}
        disabled={selectedStudents.length === 0}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
}