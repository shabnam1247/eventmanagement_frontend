import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { Grid3x3, Filter, Search, Loader2, Calendar, User, Eye, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const categories = ["All", "Events", "Campus", "Sports", "Cultural", "Academic", "Other"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/gallery");
      if (response.data.success) {
        setImages(response.data.items);
      }
    } catch (error) {
      console.error("Gallery fetch error:", error);
      toast.error("Failed to load gallery highlights");
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter((img) => {
    const matchesCategory = selectedCategory === "All" || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section - Matching Events Page */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Media Gallery
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Capturing memories and highlights from our campus life and events
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filters Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search photos by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading highlights...</p>
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img._id}
                onClick={() => setSelectedImage(img)}
                className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Aspect Ratio Container */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={img.imageUrl}
                    alt={img.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                     <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase rounded-lg">
                       {img.category}
                     </span>
                  </div>
                </div>
                
                {/* Info Area */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-blue-600 transition-colors">
                    {img.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{img.uploadedBy?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-2xl border border-dashed border-gray-300">
            <ImageIcon className="w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No photos found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
            <button 
              onClick={() => { setSelectedCategory("All"); setSearchTerm(""); }}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              Show All Photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"></div>
          
          <div 
            className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute top-4 right-4 p-2 bg-gray-900/50 hover:bg-gray-900 text-white rounded-full transition-all z-50"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Box */}
            <div className="flex-1 bg-black flex items-center justify-center overflow-hidden">
               <img src={selectedImage.imageUrl} className="w-full h-full object-contain" alt={selectedImage.title} />
            </div>

            {/* Details Box */}
            <div className="w-full md:w-[320px] p-6 md:p-8 flex flex-col justify-between bg-white border-l border-gray-100">
               <div className="overflow-y-auto">
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg mb-4 inline-block">
                    {selectedImage.category}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{selectedImage.title}</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {selectedImage.description || "No description provided for this campus highlight."}
                  </p>
                  
                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {selectedImage.uploadedBy?.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Curated By</p>
                          <p className="font-bold text-gray-900 text-sm">{selectedImage.uploadedBy?.name}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                       <Calendar className="w-3.5 h-3.5" />
                       <span>Published on {new Date(selectedImage.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
               </div>
               
               <button 
                 onClick={() => setSelectedImage(null)}
                 className="mt-8 w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-all"
               >
                 Close Preview
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;