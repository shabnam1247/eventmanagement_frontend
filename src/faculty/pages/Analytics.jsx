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
  const categoryColors = ["#2563eb", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  const eventCategories = stats?.categoryStats 
    ? Object.entries(stats.categoryStats).map(([name, count], index) => ({
        name,
        value: count, // This is count, Recharts Pie can handle raw values or we can calculate percentage
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
      `"${event.name}"`, // Quote to handle commas in titles
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
             <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-2">
                <Sparkles className="w-3 h-3" /> Dashboard Analytics
             </div>
             <h1 className="text-4xl font-black text-gray-900 tracking-tight">Event <span className="text-blue-600">Performance</span></h1>
             <p className="text-gray-500 font-medium tracking-tight">Monitoring event metrics and engagement stats</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
             <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100 flex gap-1">
                {['D', 'W', 'M', 'Y'].map((range) => (
                  <button 
                    key={range}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${range === 'M' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'}`}
                  >
                    {range}
                  </button>
                ))}
             </div>
             <button 
                onClick={handleExportData}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
             >
                <Download className="w-4 h-4" />
                EXPORT DATA
             </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Total Events" 
            value={totalEventsTotal} 
            icon={<Calendar className="w-6 h-6" />}
            trend="+0%"
            color="blue"
          />
          <StatCard 
            label="Total Registrations" 
            value={totalRegistrations} 
            icon={<Users className="w-6 h-6" />}
            trend="+0%"
            color="blue"
          />
          <StatCard 
            label="Attendance Rate" 
            value={`${avgAttendanceRate}%`} 
            icon={<Activity className="w-6 h-6" />}
            trend="Active"
            color="emerald"
          />
          <StatCard 
            label="Student Satisfaction" 
            value={`${avgRating}/5`} 
            icon={<Medal className="w-6 h-6" />}
            trend="Live"
            color="amber"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 p-8">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">Registration Trends</h3>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Registrations vs Actual Attendance</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Target</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Actual</span>
                   </div>
                </div>
             </div>

             <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={registrationTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                         <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                         </linearGradient>
                         <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                         </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 800 }}
                      />
                      <Area type="monotone" dataKey="registrations" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorReg)" />
                      <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorAtt)" />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Pie Chart Section */}
          <div className="lg:col-span-4 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 p-8">
             <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Category Split</h3>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10">Event type distribution</p>

             <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                      <Pie
                        data={eventCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
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
                   <Target className="w-8 h-8 text-gray-200 mb-1" />
                   <span className="text-2xl font-black text-gray-900">100%</span>
                   <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Scan</span>
                </div>
             </div>

             <div className="space-y-3 mt-6">
                {eventCategories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                        <span className="text-xs font-black text-gray-600 uppercase tracking-tight">{cat.name}</span>
                     </div>
                     <span className="text-xs font-black text-gray-900">{cat.value}%</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Events Data Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-50 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div>
               <h3 className="text-xl font-black text-gray-900 tracking-tight">Event List</h3>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Detailed performance metrics per event</p>
            </div>
            <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
               <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="py-5 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Event Name</th>
                  <th className="py-5 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="py-5 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Registrations</th>
                  <th className="py-5 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Attendance</th>
                  <th className="py-5 px-8 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Success Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => {
                  const rate = ((event.attended / event.registrations) * 100).toFixed(1);
                  return (
                    <tr key={event.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="py-6 px-8">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                               {event.name.charAt(0)}
                            </div>
                            <span className="font-black text-gray-900 uppercase tracking-tight">{event.name}</span>
                         </div>
                      </td>
                      <td className="py-6 px-8 text-sm font-bold text-gray-500 uppercase">{event.date}</td>
                      <td className="py-6 px-8 text-sm font-black text-blue-600">{event.registrations}</td>
                      <td className="py-6 px-8 text-sm font-black text-emerald-600">{event.attended}</td>
                      <td className="py-6 px-8 text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
                           <div className={`w-1.5 h-1.5 rounded-full ${rate >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                           <span className="text-xs font-black text-gray-700">{rate}%</span>
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

const StatCard = ({ label, value, icon, trend, color }) => {
  const colors = {
    blue: "bg-blue-600 text-blue-600 shadow-blue-100",
    emerald: "bg-emerald-600 text-emerald-600 shadow-emerald-100",
    amber: "bg-amber-600 text-amber-600 shadow-amber-100",
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 group hover:shadow-2xl hover:shadow-blue-50 transition-all relative overflow-hidden">
       <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full blur-3xl -mr-12 -mt-12 transition-all group-hover:bg-blue-50"></div>
       
       <div className="relative z-10">
          <div className={`w-14 h-14 ${colors[color].replace('bg-', 'bg-opacity-10 bg-')} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 shadow-inner`}>
             <div className={`${colors[color].split(' ')[1]}`}>
                {icon}
             </div>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
          <div className="flex items-end justify-between">
             <h4 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h4>
             <div className="flex items-center gap-1 text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
             </div>
          </div>
       </div>
    </div>
  );
};


const LayoutDashboardWrapper = ({ children }) => <FacultyLayout children={children} />;

export default FacultyEventDashboard;
