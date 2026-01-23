import React from 'react';
import FacultySidebar from './FacultySidebar';

const FacultyLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <FacultySidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300 relative">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl -z-10 -mr-64 -mt-64"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50/30 rounded-full blur-3xl -z-10 -ml-64 -mb-64"></div>
         
         <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            {children}
         </div>
      </main>
    </div>
  );
};

export default FacultyLayout;
