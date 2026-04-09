import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

export function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default to Student

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword || !role) {
      toast.error("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await axios.post('http://localhost:3000/api/users/signup', {
        name,
        email,
        password,
        role
      });
      
      toast.success("Registration successful! Please wait for admin approval.");
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.error || "Registration failed. This account may already exist.");
    }
  };

  return (
    <div className="min-h-screen flex w-full h-full font-sans">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 flex-col justify-center items-center text-white">
        <div className="max-w-md space-y-6">
          <div className="w-full h-64 rounded-lg overflow-hidden relative shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDF8fHx8MTc3MjY1OTE3NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="College Placement"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Join the Portal</h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Create an account to track your applications, manage events, and explore placement opportunities.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md my-8">
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
              <p className="text-gray-500">Register your placement account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 flex flex-col">
                <label htmlFor="name" className="text-sm font-medium leading-none">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label htmlFor="role" className="text-sm font-medium leading-none">Select Role</label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="user">Student</option>
                  <option value="placement_officer">Placement Officer</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col">
                <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 flex flex-col">
                  <label htmlFor="password" className="text-sm font-medium leading-none">Password</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Create"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">Confirm</label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 font-medium"
              >
                Sign Up
              </button>

              <div className="text-center">
                <span className="text-sm text-gray-500">Already have an account? </span>
                <Link
                  to="/login"
                  className="text-sm text-indigo-600 hover:underline font-medium"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
