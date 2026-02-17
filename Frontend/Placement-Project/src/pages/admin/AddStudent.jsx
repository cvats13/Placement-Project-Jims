const AddStudent = () => {
  return (
    <div className="bg-white p-8 rounded shadow max-w-3xl">
      <h2 className="text-2xl font-bold mb-6">Add Student</h2>

      <form className="grid grid-cols-2 gap-4">

        <input type="text" placeholder="Name"
          className="border p-2 rounded" />

        <input type="text" placeholder="Roll No"
          className="border p-2 rounded" />

        <input type="text" placeholder="Branch"
          className="border p-2 rounded" />

        <input type="number" placeholder="CGPA"
          className="border p-2 rounded" />

        <input type="number" placeholder="CIE Marks"
          className="border p-2 rounded" />

        <input type="text" placeholder="LinkedIn URL"
          className="border p-2 rounded col-span-2" />

        <input type="text" placeholder="GitHub URL"
          className="border p-2 rounded col-span-2" />

        <textarea placeholder="Skills"
          className="border p-2 rounded col-span-2"></textarea>

        <button
          className="bg-blue-600 text-white py-2 rounded col-span-2">
          Submit
        </button>

      </form>
    </div>
  );
};

export default AddStudent;
