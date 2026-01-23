import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  User, 
  GraduationCap, 
  BookOpen, 
  Eye, 
  Edit, 
  Trash2,
  Filter,
  Mail,
  MoreVertical,
  ShieldCheck,
  ShieldAlert,
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";

const FacultyStudentPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/faculty/addstudent");
  };

  const students = [
    {
      id: 1,
      name: "Safna K",
      regno: "CS2025001",
      department: "Computer Science",
      year: "3rd Year",
      email: "safna@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul R",
      regno: "EC2025012",
      department: "Electronics",
      year: "2nd Year",
      email: "rahulr@gmail.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Anjali M",
      regno: "ME2025023",
      department: "Mechanical",
      year: "4th Year",
      email: "anjalim@gmail.com",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Vijay K",
      regno: "CS2025040",
      department: "Computer Science",
      year: "1st Year",
      email: "vijayk@gmail.com",
      status: "Active",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regno.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <FacultyLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Student <span className="text-blue-600">List</span></h1>
              <p className="text-gray-500 font-medium tracking-tight">Manage and monitor all student registrations</p>
           </div>
           
           <button
            onClick={handleAddClick}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            ADD NEW STUDENT
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <OverviewCard 
             label="Total Students" 
             value={students.length} 
             icon={<Users className="w-5 h-5 text-blue-600" />} 
             bg="bg-blue-50"
           />
           <OverviewCard 
             label="Active Status" 
             value={students.filter(s => s.status === "Active").length} 
             icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />} 
             bg="bg-emerald-50"
           />
           <OverviewCard 
             label="Inactive Status" 
             value={students.filter(s => s.status === "Inactive").length} 
             icon={<ShieldAlert className="w-5 h-5 text-rose-600" />} 
             bg="bg-rose-50"
           />
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative group w-full flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by name or registration number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer"
                  >
                    <option value="all">Department: All</option>
                    <option value="Computer Science">Dept: CS</option>
                    <option value="Electronics">Dept: EC</option>
                    <option value="Mechanical">Dept: ME</option>
                  </select>
               </div>
            </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="bg-gray-50/50">
                    <th className="py-6 px-10 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Student Details</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Academic Info</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Email Address</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="py-6 px-10 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-all group">
                       <td className="py-8 px-10">
                          <div className="flex items-center gap-5">
                             <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-gray-400 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                {student.name.charAt(0)}
                             </div>
                             <div>
                                <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{student.name}</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                   <GraduationCap className="w-3 h-3" /> {student.regno}
                                </p>
                             </div>
                          </div>
                       </td>
                       <td className="py-8 px-8">
                          <div className="text-sm font-black text-gray-800 uppercase tracking-tight">{student.department}</div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{student.year}</p>
                       </td>
                       <td className="py-8 px-8">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                             <Mail className="w-4 h-4 text-gray-300" />
                             {student.email}
                          </div>
                       </td>
                       <td className="py-8 px-8">
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest ${
                            student.status === "Active" 
                              ? "bg-emerald-50 text-emerald-600" 
                              : "bg-rose-50 text-rose-600"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${student.status === "Active" ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            {student.status}
                          </div>
                       </td>
                       <td className="py-8 px-10 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg rounded-xl transition-all active:scale-90">
                                <Eye className="w-5 h-5" />
                             </button>
                             <button className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-emerald-600 hover:shadow-lg rounded-xl transition-all active:scale-90">
                                <Edit className="w-5 h-5" />
                             </button>
                             <div className="w-px h-6 bg-gray-100 mx-2"></div>
                             <button className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-lg rounded-xl transition-all active:scale-90">
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
               </tbody>
             </table>
           </div>

           {/* Table Footer */}
           <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                Displaying {filteredStudents.length} students from registration record
              </p>
              <div className="flex gap-3">
                 <button className="px-6 py-3 bg-gray-50 text-gray-400 font-black text-xs uppercase rounded-xl hover:bg-white hover:shadow-md transition-all">Previous</button>
                 <button className="px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Next Page</button>
              </div>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
};


const OverviewCard = ({ label, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-50/50 flex items-center gap-6 transition-transform hover:scale-[1.02]">
     <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
     </div>
     <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tight mt-1">{value}</p>
     </div>
  </div>
);

export default FacultyStudentPanel;
