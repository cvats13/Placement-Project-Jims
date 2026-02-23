const ShortlistedStudents = () => {
  const shortlisted = [
    {
      id: 1,
      name: "Vanshika",
      branch: "MCA",
      company: "Infosys",
      round: "Technical Round Cleared",
    },
    {
      id: 2,
      name: "Rahul",
      branch: "B.Tech CSE",
      company: "TCS",
      round: "HR Round Cleared",
    },
  ];

 return (
  <div className="page-transition min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Shortlisted Students</h1>

      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Student Name</th>
              <th className="text-left p-2">Branch</th>
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {shortlisted.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.branch}</td>
                <td className="p-2">{student.company}</td>
                <td className="p-2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded">
                    {student.round}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShortlistedStudents;
