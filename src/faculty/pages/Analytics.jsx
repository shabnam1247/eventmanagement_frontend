import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Download,
  Filter,
  Sparkles,
  ArrowUpRight,
  Target,
  Medal,
  Activity,
  Loader2
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";

const FacultyEventDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  const facultyData = JSON.parse(localStorage.getItem("facultyData") || "{}");
  const facultyId = facultyData._id;

  useEffect(() => {
    if (facultyId) {
      fetchDashboardStats();
    }
  }, [facultyId]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/faculty/dashboard/stats/${facultyId}`);
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  // Default charts data if no real data available yet for trends
  const registrationTrend = stats?.registrationTrend || [
    { date: "Week 1", registrations: 0, attendance: 0 },
    { date: "Week 2", registrations: 0, attendance: 0 },
    { date: "Week 3", registrations: 0, attendance: 0 },
    { date: "Week 4", registrations: 0, attendance: 0 },
  ];

  // Transform real category stats from backend
  const categoryColors = ["#6366f1", "#8b5cf6", "#ec4899", "#3b82f6", "#10b981", "#f59e0b"];
  const eventCategories = stats?.categoryStats 
    ? Object.entries(stats.categoryStats).map(([name, count], index) => ({
        name,
        value: count, 
        color: categoryColors[index % categoryColors.length]
      }))
    : [
        { name: "No Data", value: 1, color: "#cbd5e1" }
      ];

  const totalEventsTotal = stats?.totalEvents || 0;
  const totalRegistrations = stats?.totalRegistrations || 0;
  const totalAttendance = stats?.totalAttendance || 0;
  const avgAttendanceRate = totalRegistrations > 0 ? ((totalAttendance / totalRegistrations) * 100).toFixed(1) : 0;
  const avgRating = stats?.avgRating || 0;

  if (loading) {
    return (
      <FacultyLayout>
        <div className="flex items-center justify-center min-h-[500px]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </FacultyLayout>
    );
  }

  const events = stats?.eventStats || [];

  const handleExportData = () => {
    if (!stats || !stats.eventStats || stats.eventStats.length === 0) {
      toast.error("No data available to export");
      return;
    }

    const headers = ["Event Name", "Date", "Registrations", "Attendance", "Success Rate (%)"];
    const rows = stats.eventStats.map(event => [
      `"${event.name}"`, 
      new Date(event.date).toLocaleDateString(),
      event.registrations,
      event.attended,
      ((event.attended / event.registrations) * 100 || 0).toFixed(1)
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Event_Analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Excel report exported successfully!");
  };

  return (
    <FacultyLayout>
      <div className="space-y-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="space-y-1">
             <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" /> Data Insights
             </div>
             <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Faculty <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Analytics</span></h1>
             <p className="text-gray-500 font-medium tracking-tight">Monitor your event performance and student engagement</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                {['D', 'W', 'M', 'Y'].map((range) => (
                   <button 
                    key={range}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${range === 'M' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    {range}
                  </button>
                ))}
             </div>
             <button 
                onClick={handleExportData}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-xl shadow-blue-100 active:scale-95"
             >
                <Download className="w-4 h-4" />
                GET REPORT
             </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Events" 
            value={totalEventsTotal} 
            icon={<Calendar className="w-6 h-6" />}
            trend="+2 this month"
            type="blue"
          />
          <StatCard 
            label="Registrations" 
            value={totalRegistrations} 
            icon={<Users className="w-6 h-6" />}
            trend="Live"
            type="purple"
          />
          <StatCard 
            label="Attendance Rate" 
            value={`${avgAttendanceRate}%`} 
            icon={<Activity className="w-6 h-6" />}
            trend="Average"
            type="emerald"
          />
          <StatCard 
            label="Avg. Rating" 
            value={`${avgRating}/5`} 
            icon={<Medal className="w-6 h-6" />}
            trend="Verified"
            type="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/20 p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 relative z-10 gap-4">
                <div>
                   <h3 className="text-lg font-bold text-gray-900 tracking-tight">Engagement Patterns</h3>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Registrations vs Actual Attendance</p>
                </div>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm shadow-blue-200"></div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Signups</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200"></div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Turnout</span>
                   </div>
                </div>
             </div>

             <div className="h-[350px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={registrationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                         <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                      />
                      <Area type="monotone" dataKey="registrations" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorReg)" />
                      <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAtt)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Pie Chart Section */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-50/20 p-8 relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50/30 rounded-full blur-3xl -ml-24 -mb-24"></div>
             
             <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-2 relative z-10">Event Split</h3>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10 relative z-10">Category distribution</p>

             <div className="h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={eventCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={100}
                        paddingAngle={10}
                        dataKey="value"
                      >
                        {eventCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                   </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                   <Target className="w-8 h-8 text-blue-100 mb-1" />
                   <span className="text-3xl font-bold text-gray-900">Live</span>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Statistics</span>
                </div>
             </div>

             <div className="space-y-2 mt-6 relative z-10">
                {eventCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-white border border-transparent hover:border-blue-50 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{cat.name}</span>
                     </div>
                     <span className="text-xs font-bold text-blue-600">{cat.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Events Data Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-indigo-50/30 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
               <h3 className="text-xl font-bold text-gray-900 tracking-tight">Performance Audit</h3>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Granular event performance details</p>
            </div>
            <button className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
               <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Project Name</th>
                  <th className="py-5 px-8 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Timeline</th>
                  <th className="py-5 px-8 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity</th>
                  <th className="py-5 px-8 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Turnout</th>
                  <th className="py-5 px-8 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const rate = ((event.attended / event.registrations) * 100).toFixed(1);
                  return (
                    <tr key={event.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center font-bold text-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                               {event.name.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-800 uppercase tracking-tight">{event.name}</span>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-sm font-semibold text-gray-500">{event.date}</td>
                      <td className="py-6 px-8 text-sm font-bold text-blue-600">{event.registrations}</td>
                      <td className="py-6 px-8 text-sm font-bold text-emerald-600">{event.attended}</td>
                      <td className="py-6 px-8 text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                           <div className={`w-1.5 h-1.5 rounded-full ${rate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                           <span className="text-xs font-bold text-gray-700">{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

const StatCard = ({ label, value, icon, trend, type }) => {
  const themes = {
    blue: {
      bg: "from-blue-600 to-blue-800",
      light: "bg-blue-50 text-blue-600 shadow-blue-100",
      accent: "bg-blue-400"
    },
    purple: {
      bg: "from-purple-600 to-purple-800",
      light: "bg-purple-50 text-purple-600 shadow-purple-100",
      accent: "bg-purple-400"
    },
    emerald: {
      bg: "from-emerald-500 to-emerald-700",
      light: "bg-emerald-50 text-emerald-600 shadow-emerald-100",
      accent: "bg-emerald-400"
    },
    amber: {
      bg: "from-amber-500 to-amber-700",
      light: "bg-amber-50 text-amber-600 shadow-amber-100",
      accent: "bg-amber-400"
    }
  };

  const theme = themes[type] || themes.blue;

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/20 group hover:shadow-2xl hover:shadow-blue-100/40 transition-all relative overflow-hidden">
       {/* Decorative Elements */}
       <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${theme.bg} opacity-[0.03] rounded-full -mr-16 -mt-16 transition-all group-hover:opacity-[0.06] group-hover:scale-150`}></div>
       <div className={`absolute bottom-0 left-0 w-16 h-16 ${theme.bg} opacity-[0.02] rounded-full -ml-8 -mb-8 transition-all`}></div>
       
       <div className="relative z-10">
          <div className={`w-14 h-14 ${theme.light} rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-transparent group-hover:shadow-blue-100`}>
             <div className="relative">
                {icon}
                <div className={`absolute -top-1 -right-1 w-2 h-2 ${theme.accent} rounded-full animate-pulse`}></div>
             </div>
          </div>
          
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          
          <div className="flex items-end justify-between">
             <div className="flex flex-col">
                <h4 className="text-3xl font-bold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{value}</h4>
             </div>
             
             <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100/50">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
                {trend}
             </div>
          </div>
       </div>
    </div>
  );
};


const LayoutDashboardWrapper = ({ children }) => <FacultyLayout children={children} />;

export default FacultyEventDashboard;
