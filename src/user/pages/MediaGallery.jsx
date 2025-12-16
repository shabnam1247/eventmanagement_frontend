import React, { useState } from "react";
import Header from "../components/Header";
import { Grid3x3, Filter, Search } from "lucide-react";

const categories = ["All", "Events", "Campus", "Sports", "Cultural", "Academic"];

const images = [
  { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop", category: "Campus", title: "College Campus" },
  { url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop", category: "Events", title: "Tech Symposium" },
  { url: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w-600&h=400&fit=crop", category: "Sports", title: "Sports Day" },
  { url: "https://images.unsplash.com/photo-1547825407-d21c9be4d481?w=600&h=400&fit=crop", category: "Cultural", title: "Cultural Fest" },
  { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop", category: "Academic", title: "Library" },
  { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop", category: "Campus", title: "Hostel Building" },
  { url: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=600&h=400&fit=crop", category: "Events", title: "Seminar" },
  { url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop", category: "Cultural", title: "Music Concert" },
  { url: "https://images.unsplash.com/photo-1526676037774-2c0e4f21d7f8?w=600&h=400&fit=crop", category: "Sports", title: "Football Match" },
  { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop", category: "Academic", title: "Classroom" },
  { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop", category: "Events", title: "Workshop" },
  { url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop", category: "Campus", title: "College Ground" },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredImages = images.filter((img) => {
    const matchesCategory = selectedCategory === "All" || img.category === selectedCategory;
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Grid3x3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Media Gallery</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore photos from campus events, activities, and daily life at our college
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-700">Filter by:</span>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Info */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredImages.length}</span> photo{filteredImages.length !== 1 ? 's' : ''}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {img.category}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900">{img.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No photos found</h3>
            <p className="text-gray-600">
              Try adjusting your search term or filter
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>All photos are from college events and activities. More photos added regularly.</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;