import { useState } from "react";
import Navbar from "../../Components/Navbar";
import studentsData from "../../data/students";


export default function PlacementDashboard() {
  const [courseOpen, setCourseOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Filter students
  const filteredStudents = studentsData.filter((student) => {
    const matchCourse = selectedCourse
      ? student.course === selectedCourse
      : true;

    const matchSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.enrollment.toLowerCase().includes(search.toLowerCase());

    return matchCourse && matchSearch;
  });

  // Checkbox handler
  const toggleStudent = (id) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((sid) => sid !== id)
        : [...prev, id]
    );
  };

  const handleSend = () => {
    const selectedData = studentsData.filter((s) =>
      selectedStudents.includes(s.id)
    );

    console.log("Sending students:", selectedData);

    // ✅ Fixed template literal
    alert(`Sent ${selectedData.length} students`);
  };

  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Home Page</h1>

        {/* Controls */}
        <div className="flex gap-4 items-center mb-6 flex-wrap">
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

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search name or enrollment"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md outline-none w-64"
          />
        </div>

        {/* Students Table */}
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
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const mockAvg =
                    student.mockTests.reduce((a, b) => a + b, 0) /
                    student.mockTests.length;

                  return (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                        />
                      </td>

                      <td className="px-4 py-2 font-medium text-blue-600 cursor-pointer hover:underline">
                        {/* ✅ Fixed template literal */}
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
                  <td
                    colSpan="6"
                    className="text-center py-6 text-gray-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={selectedStudents.length === 0}
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </>
  );
}