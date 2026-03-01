const students = [
  {
    id: 1,
    name: "Harsh Gupta",
    enrollment: "MCA001",
    email: "harsh@gmail.com",
    contact: "9876543210",
    course: "MCA",
    courseCgpa: 8.3,
    tenthMarks: 88,
    twelfthMarks: 85,
    ugScore: 8.0,
    resume: "https://example.com/resume1.pdf",
    linkedin: "https://linkedin.com/in/harshgupta",
    github: "https://github.com/harshgupta",
    leetcode: "https://leetcode.com/harsh_mca",
    certifications: ["React Certification", "DSA Bootcamp"],
    semMarks: [7.8, 8.1, 7.9, 8.3, 8.5, 8.7],
    cie: [78, 82, 75, 80],
    mockTests: [65, 70, 72, 68, 75, 78, 80, 82, 79, 85],
    placements: [
      { company: "Infosys", rounds: [true, true, true, false] },
      { company: "TCS", rounds: [true, true, true, true] }
    ]
  },

  {
    id: 2,
    name: "Riya Sharma",
    enrollment: "MCA002",
    email: "riya@gmail.com",
    contact: "9123456780",
    course: "MCA",
    courseCgpa: 8.7,
    tenthMarks: 91,
    twelfthMarks: 89,
    ugScore: 8.5,
    resume: "https://example.com/resume2.pdf",
    linkedin: "https://linkedin.com/in/riyasharma",
    github: "https://github.com/riyasharma",
    leetcode: "https://leetcode.com/riya_codes",
    certifications: ["Python Advanced", "Cloud Basics"],
    semMarks: [8.2, 8.4, 8.6, 8.7, 8.8, 9.0],
    cie: [85, 88, 90, 87],
    mockTests: [70, 72, 75, 78, 80],
    placements: [{ company: "Wipro", rounds: [true, false] }]
  },

  {
    id: 3,
    name: "Aman Verma",
    enrollment: "BCA001",
    email: "aman@gmail.com",
    contact: "9988776655",
    course: "BCA",
    courseCgpa: 7.2,
    tenthMarks: 75,
    twelfthMarks: 78,
    ugScore: 7.0,
    resume: "https://example.com/resume3.pdf",
    linkedin: "https://linkedin.com/in/amanverma",
    github: "https://github.com/amanverma",
    leetcode: "https://leetcode.com/aman_bca",
    certifications: ["Java Certification"],
    semMarks: [6.8, 7.0, 7.2, 7.4, 7.6, 7.8],
    cie: [65, 68, 70, 72],
    mockTests: [55, 58, 60, 62, 65],
    placements: [{ company: "Capgemini", rounds: [true, true, false] }]
  },

  {
    id: 4,
    name: "Neha Singh",
    enrollment: "BCA002",
    email: "neha@gmail.com",
    contact: "9870011223",
    course: "BCA",
    courseCgpa: 8.0,
    tenthMarks: 84,
    twelfthMarks: 82,
    ugScore: 7.8,
    resume: "https://example.com/resume4.pdf",
    linkedin: "https://linkedin.com/in/nehasingh",
    github: "https://github.com/nehasingh",
    leetcode: "https://leetcode.com/neha_bca",
    certifications: ["Web Development", "UI/UX Basics"],
    semMarks: [7.2, 7.5, 7.8, 8.0, 8.1, 8.3],
    cie: [72, 75, 78, 80],
    mockTests: [60, 65, 68, 70, 72, 74],
    placements: [{ company: "Accenture", rounds: [true, true, true] }]
  },

  {
    id: 11,
    name: "Vanshika Batra",
    enrollment: "MCA006",
    email: "vanshika@gmail.com",
    contact: "9012345678",
    course: "MCA",
    courseCgpa: 9.0,
    tenthMarks: 93,
    twelfthMarks: 91,
    ugScore: 8.8,
    resume: "https://example.com/resume11.pdf",
    linkedin: "https://linkedin.com/in/vanshikabatra",
    github: "https://github.com/Vanshika000",
    leetcode: "https://leetcode.com/Vanshika111",
    certifications: ["MERN Stack", "Advanced DSA", "AWS Fundamentals"],
    semMarks: [8.4, 8.6, 8.7, 8.9, 9.0, 9.2],
    cie: [90, 92, 94, 93],
    mockTests: [82, 85, 88, 90],
    placements: [
      { company: "Google", rounds: [false, false, false, false, false] }
    ]
  }
];

export default students;