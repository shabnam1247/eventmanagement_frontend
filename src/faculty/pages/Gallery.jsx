import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Grid3x3, 
  Upload, 
  X, 
  Image as ImageIcon,
  Loader2,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import FacultyLayout from '../components/FacultyLayout';
import axios from 'axios';
import toast from 'react-hot-toast';

const categories = ["Events", "Campus", "Sports", "Cultural", "Academic", "Other"];

const FacultyGallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: '',
    category: 'Events',
    description: '',
    image: null
  });

  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/gallery");
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      toast.error("Title and Image are required");
      return;
    }

    const facultyData = JSON.parse(localStorage.getItem('facultyData'));
    if (!facultyData) {
      toast.error("Faculty session expired");
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('image', formData.image);
    data.append('uploadedBy', facultyData._id);

    try {
      setUploading(true);
      const response = await axios.post("http://localhost:5000/api/gallery/add", data);
      if (response.data.success) {
        toast.success("Added to gallery!");
        setShowModal(false);
        resetForm();
        fetchGallery();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this from the gallery?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/gallery/${id}`);
        if (response.data.success) {
          toast.success("Item removed");
          fetchGallery();
        }
      } catch (error) {
        toast.error("Delete failed");
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: '', category: 'Events', description: '', image: null });
    setPreviewUrl(null);
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = selectedFilter === "All" || item.category === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <FacultyLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Gallery <span className="text-blue-600">Sync</span></h1>
            <p className="text-gray-500 font-medium">Curate and manage campus event highlights</p>
          </div>
          
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            UPLOAD HIGHLIGHT
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1 lg:col-span-2 relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-16 pr-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
            />
          </div>
          
          <div className="flex items-center gap-2 px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer w-full"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="bg-blue-600 rounded-[1.5rem] p-4 text-white flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Items</p>
              <p className="text-2xl font-black">{items.length}</p>
            </div>
            <Grid3x3 className="w-8 h-8 opacity-20" />
          </div>
        </div>

        {loading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Accessing Vault...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredItems.map((item) => (
              <div key={item._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 overflow-hidden hover:-translate-y-2 transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="text-white font-black text-sm uppercase tracking-tight">{item.title}</p>
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase rounded-lg shadow-sm">{item.category}</span>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs">
                        {item.uploadedBy?.name?.charAt(0)}
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Uploaded by</p>
                        <p className="text-xs font-bold text-gray-700">{item.uploadedBy?.name}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="col-span-full py-24 text-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 border border-dashed border-gray-200">
                    <ImageIcon className="w-10 h-10 text-gray-200" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800">No memories found</h3>
                 <p className="text-gray-400 text-sm mt-2">Be the first to upload an event highlight!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100] animate-in fade-in transition-all">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden scale-in animate-in zoom-in-[0.95]">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
               <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Upload <span className="text-blue-600">Memory</span></h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Add a new photo to the public gallery</p>
               </div>
               <button onClick={() => setShowModal(false)} className="p-4 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Photo Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="e.g. Science Fair Highlights"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Featured Image</label>
                <div className="relative group">
                  {previewUrl ? (
                    <div className="relative aspect-video rounded-3xl overflow-hidden group">
                       <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                       <button 
                        type="button"
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video bg-gray-50 border-2 border-dashed border-gray-100 rounded-[2rem] cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all group">
                       <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-7 h-7 text-blue-600" />
                       </div>
                       <p className="text-sm font-black text-gray-900">Click to Browse</p>
                       <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase">JPG, PNG or WEBP (Max 5MB)</p>
                       <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    COMPRESSING & UPLOADING...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    PUBLISH TO GALLERY
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </FacultyLayout>
  );
};

export default FacultyGallery;
