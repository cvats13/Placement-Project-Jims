const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Total Students</h2>
          <p className="text-2xl font-bold mt-2">250</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Companies Visited</h2>
          <p className="text-2xl font-bold mt-2">35</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold">Students Placed</h2>
          <p className="text-2xl font-bold mt-2">120</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
