import React, { useState, useEffect } from "react";
import { Layers, Plus, Trash2, Loader2, Search, ArrowLeft, Tag, Info } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function CategoryManagement() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      toast.error("Broken connection to category vault");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/addcategory", {
        name: newCategory,
      });
      toast.success("New classification layer injected successfully");
      setNewCategory("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Injection failure");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to eliminate the "${name}" taxonomy?`)) return;

    try {
      const res = await axios.delete(`http://localhost:5000/api/admin/categorydelete/${id}`);
      if (res.data.success) {
        toast.success(`Taxonomy "${name}" successfully purged`);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      toast.error("Process interception: Data purge failed");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      <div className="py-2 max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Console
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-100 ring-4 ring-blue-50">
                 <Layers className="w-8 h-8 text-white" />
              </div>
              Taxonomy Management
            </h1>
            <p className="text-gray-500 font-medium mt-2">Manage the global classification system for all events</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Add Form Column */}
          <div className="lg:col-span-12">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>
                
                <h2 className="text-xl font-black text-gray-900 mb-8 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Register New Classification
                </h2>

                <form onSubmit={handleAddCategory} className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1 relative group">
                      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                         <Tag className="w-5 h-5" />
                      </div>
                      <input 
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Ex: Technical Workshops, Hackathons, Cultural Fest..."
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                      />
                   </div>
                   <button
                     type="submit"
                     disabled={loading}
                     className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                   >
                     {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                     {loading ? "PROCESSING..." : "REGISTER CATEGORY"}
                   </button>
                </form>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-12 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                 Active Taxonomy Matrix <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs">{categories.length}</span>
               </h3>
               <div className="relative group w-full max-w-xs">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search classes..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:ring-4 focus:ring-blue-50 transition-all font-medium text-sm shadow-sm"
                  />
               </div>
            </div>

            {fetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-[1.5rem] border border-gray-100"></div>
                ))}
              </div>
            ) : filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((cat) => (
                  <div 
                    key={cat._id} 
                    className="group bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-50/50 hover:border-blue-100 transition-all relative overflow-hidden flex items-center justify-between"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Tag className="w-5 h-5" />
                       </div>
                       <div>
                          <p className="font-black text-gray-900 text-lg leading-tight uppercase tracking-tight">{cat.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-1">ID: #{cat._id.slice(-8)}</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <Layers className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">No categories identified</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">Inject your first taxonomy layer using the form above to begin organizing events.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center text-gray-300 flex items-center justify-center gap-2">
           <Info className="w-4 h-4" />
           <p className="text-[10px] font-black uppercase tracking-widest">Global Data Schema Engine • Event Hub Admin Control</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default CategoryManagement;
