import { useState } from "react";

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: "Infosys",
      role: "Software Engineer",
      minCGPA: 7.5,
      minCIE: 70,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    minCGPA: "",
    minCIE: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddCompany = (e) => {
    e.preventDefault();

    const newCompany = {
      id: companies.length + 1,
      ...formData,
    };

    setCompanies([...companies, newCompany]);

    setFormData({
      name: "",
      role: "",
      minCGPA: "",
      minCIE: "",
    });
  };

  const handleDelete = (id) => {
    setCompanies(companies.filter((company) => company.id !== id));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Company Management</h1>

      {/* Add Company Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Company</h2>

        <form onSubmit={handleAddCompany} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            name="role"
            placeholder="Job Role"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="minCGPA"
            placeholder="Minimum CGPA"
            value={formData.minCGPA}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            name="minCIE"
            placeholder="Minimum CIE"
            value={formData.minCIE}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="col-span-2 bg-green-500 text-white py-2 rounded"
          >
            Add Company
          </button>
        </form>
      </div>

      {/* Company List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Company List</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Min CGPA</th>
              <th className="text-left p-2">Min CIE</th>
              <th className="text-left p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b">
                <td className="p-2">{company.name}</td>
                <td className="p-2">{company.role}</td>
                <td className="p-2">{company.minCGPA}</td>
                <td className="p-2">{company.minCIE}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyManagement;
