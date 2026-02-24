const students = [
  {
    id: 1,
    name: "Harsh Gupta",
    enrollment: "MCA001",
    course: "MCA",
    github: "harshgupta",
    leetcode: "harsh_mca",
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
    course: "MCA",
    github: "riyasharma",
    leetcode: "riya_codes",
    semMarks: [8.2, 8.4, 8.6, 8.7, 8.8, 9.0],
    cie: [85, 88, 90, 87],
    mockTests: [70, 72, 75, 78, 80],
    placements: [{ company: "Wipro", rounds: [true, false] }]
  },

  {
    id: 3,
    name: "Aman Verma",
    enrollment: "BCA001",
    course: "BCA",
    github: "amanverma",
    leetcode: "aman_bca",
    semMarks: [6.8, 7.0, 7.2, 7.4, 7.6, 7.8],
    cie: [65, 68, 70, 72],
    mockTests: [55, 58, 60, 62, 65],
    placements: [{ company: "Capgemini", rounds: [true, true, false] }]
  },

  {
    id: 4,
    name: "Neha Singh",
    enrollment: "BCA002",
    course: "BCA",
    github: "nehasingh",
    leetcode: "neha_bca",
    semMarks: [7.2, 7.5, 7.8, 8.0, 8.1, 8.3],
    cie: [72, 75, 78, 80],
    mockTests: [60, 65, 68, 70, 72, 74],
    placements: [{ company: "Accenture", rounds: [true, true, true] }]
  },


  {
    id: 5,
    name: "Karan Mehta",
    enrollment: "BBA001",
    course: "BBA",
    github: "karanmehta",
    leetcode: "karan_dsa",
    semMarks: [6.5, 6.8, 7.0, 7.2, 7.4, 7.6],
    cie: [60, 65, 68, 70],
    mockTests: [55, 57, 60, 62],
    placements: [{ company: "Deloitte", rounds: [true, true, false] }]
  },

  {
    id: 6,
    name: "Pooja Patel",
    enrollment: "MCA003",
    course: "MCA",
    github: "poojapatel",
    leetcode: "pooja_mca",
    semMarks: [8.0, 8.3, 8.5, 8.6, 8.8, 9.1],
    cie: [88, 90, 92, 91],
    mockTests: [78, 80, 82, 85, 88, 90],
    placements: [
      { company: "Amazon", rounds: [true, true, true, true, true] },
      { company: "Microsoft", rounds: [true, true, false] }
    ]
  },

  {
    id: 7,
    name: "Rahul Khanna",
    enrollment: "MCA004",
    course: "MCA",
    github: "rahulkhanna",
    leetcode: "rahul_algo",
    semMarks: [7.5, 7.8, 8.0, 8.2, 8.4, 8.6],
    cie: [75, 78, 80, 82],
    mockTests: [68, 70, 72, 75, 77],
    placements: [{ company: "IBM", rounds: [true, true, true, false] }]
  },

  {
    id: 8,
    name: "Sneha Joshi",
    enrollment: "BCA003",
    course: "BCA",
    github: "snehajoshi",
    leetcode: "sneha_codes",
    semMarks: [7.9, 8.1, 8.3, 8.5, 8.6, 8.8],
    cie: [80, 82, 85, 87],
    mockTests: [70, 72, 75, 78, 80],
    placements: [{ company: "Cognizant", rounds: [true, true, false] }]
  },

  {
    id: 9,
    name: "Ankit Yadav",
    enrollment: "BBA002",
    course: "BBA",
    github: "ankityadav",
    leetcode: "ankit_logic",
    semMarks: [6.9, 7.1, 7.3, 7.5, 7.6, 7.8],
    cie: [68, 70, 72, 74],
    mockTests: [60, 62, 64, 66],
    placements: [{ company: "EY", rounds: [true, false] }]
  },

  {
    id: 10,
    name: "Priya Malhotra",
    enrollment: "MCA005",
    course: "MCA",
    github: "priyamalhotra",
    leetcode: "priya_dp",
    semMarks: [8.4, 8.6, 8.7, 8.9, 9.0, 9.2],
    cie: [90, 92, 94, 93],
    mockTests: [82, 85, 88, 90],
    placements: [
      { company: "Google", rounds: [true, true, true, true, true] }
    ]
  }
  ,
  {
    id: 11,
    name: "Vanshika Batra",
    enrollment: "MCA005",
    course: "MCA",
    github: "Vanshika000",
    leetcode: "Vanshika111",
    semMarks: [8.4, 8.6, 8.7, 8.9, 9.0, 9.2],
    cie: [90, 92, 94, 93],
    mockTests: [82, 85, 88, 90],
    placements: [
      { company: "Google", rounds: [false, false, false, false, false] }
    ]
  }
];

export default students;