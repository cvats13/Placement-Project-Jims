import { useParams, useNavigate } from "react-router-dom";
import studentsData from "../../data/students.js";

export default function StudentList() {
  const { id } = useParams();
  const navigate = useNavigate();

  // If ID exists → show details
  if (id) {
    const student = studentsData.find(
      (s) => s.id === Number(id)
    );

    if (!student) {
      return <p className="p-6">Student not found</p>;
    }

    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/placement/students")}
          className="mb-4 px-4 py-2 bg-slate-800 text-white rounded-md"
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start border-b pb-4">
            <h1 className="text-2xl font-bold">
              {student.name}
            </h1>

            <div className="text-right">
              <p className="text-blue-600 font-medium">
                GitHub: {student.github}
              </p>
              <p className="text-yellow-600 font-medium">
                LeetCode: {student.leetcode}
              </p>
            </div>
          </div>

          {/* Semester Marks */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">
              Semester Marks
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {student.semMarks?.map((mark, index) => (
                <div
                  key={index}
                  className="bg-slate-100 rounded-md p-2 text-center"
                >
                  <p className="text-sm text-gray-500">
                    Sem {index + 1}
                  </p>
                  <p className="font-semibold">
                    {mark}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mock Tests */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">
              Mock Test Marks
            </h2>

            <div className="flex flex-wrap gap-2">
              {student.mockTests?.map((score, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-200 rounded-md text-sm"
                >
                  {score}
                </span>
              ))}
            </div>
          </div>

          {/* CIE */}
          <div className="mt-6">
            <h2 className="font-semibold mb-2">
              CIE Marks
            </h2>

            <div className="flex gap-4 flex-wrap">
              {student.cie?.map((mark, index) => (
                <div
                  key={index}
                  className="bg-slate-100 px-4 py-2 rounded-md text-center"
                >
                  <p className="text-sm text-gray-500">
                    CIE {index + 1}
                  </p>
                  <p className="font-semibold">
                    {mark}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Placement */}
          <div className="mt-6">
            <h2 className="font-semibold mb-3 text-lg">
              Placement Status
            </h2>

            {student.placements?.length > 0 ? (
              <div className="space-y-4">
                {student.placements.map((placement, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4"
                  >
                    <p className="font-medium mb-2">
                      {placement.company}
                    </p>

                    <div className="flex gap-3 flex-wrap">
                      {placement.rounds.map((status, i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 flex items-center justify-center text-white font-semibold rounded-md
                          ${status ? "bg-green-500" : "bg-red-500"}`}
                        >
                          R{i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                No placement data available
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If NO ID → show list
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Student List
      </h1>

      <div className="grid gap-4">
        {studentsData.map((student) => (
          <div
            key={student.id}
            className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
          >
            <h2 className="font-semibold">
              {student.name}
            </h2>

            <button
              onClick={() =>
                navigate(<a href={`/placement/students/${student.id}`}></a>) 
              }
              className="px-4 py-2 bg-slate-800 text-white rounded-md"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}