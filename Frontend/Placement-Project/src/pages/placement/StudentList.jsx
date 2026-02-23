const StudentList = () => {
  return (
  <div className="page-transition min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>

      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Branch</th>
              <th className="text-left p-2">CGPA</th>
              <th className="text-left p-2">CIE</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Vanshika</td>
              <td className="p-2">MCA</td>
              <td className="p-2">8.5</td>
              <td className="p-2">75</td>
              <td className="p-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
