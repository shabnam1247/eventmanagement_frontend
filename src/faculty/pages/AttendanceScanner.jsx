import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Scan, CheckCircle, AlertCircle, RefreshCw, 
  User, Mail, Building2, GraduationCap, Calendar, Clock,
  Camera, StopCircle, Search, Keyboard
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import FacultySidebar from '../components/FacultySidebar';

export default function AttendanceScanner() {
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [manualId, setManualId] = useState("");
  
  const scannerRef = useRef(null);
  const isStoppingRef = useRef(false);

  // Initialize scanner on mount
  useEffect(() => {
    // We don't initialize here to avoid ID conflicts if the element isn't ready
    return () => {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().then(() => {
            scannerRef.current.clear();
          }).catch(err => console.error("Cleanup error:", err));
        } else {
          scannerRef.current.clear();
        }
      }
    };
  }, []);

  const getScanner = () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode("reader");
    }
    return scannerRef.current;
  };

  const startScanner = async () => {
    setResult(null);
    setCameraError(null);
    
    try {
      const scanner = getScanner();
      
      const config = {
        fps: 20,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await scanner.start(
        { facingMode: "environment" },
        config,
        onScanSuccess
      );
      setScanning(true);
    } catch (err) {
      console.error("Scanner start failed:", err);
      setCameraError("Camera access failed. Please ensure permissions are granted.");
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (isStoppingRef.current) return;
    const scanner = scannerRef.current;
    
    if (scanner && scanner.isScanning) {
      isStoppingRef.current = true;
      try {
        await scanner.stop();
        setScanning(false);
      } catch (err) {
        console.error("Stop error:", err);
      } finally {
        isStoppingRef.current = false;
      }
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Extract ID
    let regId = decodedText;
    if (decodedText.startsWith("REG_TICKET:")) {
      regId = decodedText.split(":")[1];
    }
    
    await stopScanner();
    await processCheckIn(regId);
  };

  const processCheckIn = async (regId) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/faculty/mark-attendance/${regId}`);
      if (response.data.success) {
        setResult({
          type: 'success',
          message: "Check-in Successful",
          registration: response.data.registration
        });
        toast.success("Student Verified");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error processing check-in";
      setResult({
        type: 'error',
        message: message,
        registration: error.response?.data?.registration || null
      });
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = (e) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    processCheckIn(manualId.trim());
    setManualId("");
  };

  const resetScanner = () => {
    setResult(null);
    startScanner();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <FacultySidebar />
      
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Rapid <span className="text-blue-600">Scan</span></h1>
            <p className="text-gray-500 font-medium">Verify event attendees efficiently</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Scanner Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${scanning ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                      {scanning ? 'Camera Active' : 'Camera Standby'}
                    </span>
                  </div>
                  {loading && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />}
                </div>

                {/* THE READER CONTAINER - STABLE */}
                <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-gray-900 rounded-[32px] overflow-hidden group">
                  <div id="reader" className="w-full h-full"></div>
                  
                  {/* Overlay for Camera Standby */}
                  {!scanning && !result && (
                    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10 transition-all duration-500">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                      <button 
                        onClick={startScanner}
                        className="bg-white text-blue-600 font-black px-10 py-5 rounded-3xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-xl"
                      >
                        ACTIVATE CAMERA
                      </button>
                    </div>
                  )}

                  {/* Visual Guides - Only when scanning */}
                  {scanning && (
                    <>
                      <div className="absolute inset-0 border-[60px] border-black/30 pointer-events-none z-10"></div>
                      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,1)] animate-sweep pointer-events-none z-20"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-blue-400/40 rounded-3xl pointer-events-none z-20"></div>
                    </>
                  )}
                </div>

                {scanning && (
                  <button 
                    onClick={stopScanner}
                    className="w-full mt-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-red-100"
                  >
                    <StopCircle className="w-5 h-5" /> Deactivate Camera
                  </button>
                )}
              </div>

              {/* Offline/Manual Entry */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
                  <Keyboard className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Manual Fallback</span>
                </div>
                <form onSubmit={handleManualCheckIn} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type Registration ID..."
                    className="flex-1 bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition-all"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                  />
                  <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100">
                    Verify
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Result/Profile Column */}
            <div className="lg:col-span-5">
              {!result ? (
                <div className="bg-white h-full min-h-[400px] rounded-[40px] shadow-sm border border-gray-100 flex flex-col items-center justify-center p-12 text-center text-gray-400">
                   <div className="w-24 h-24 bg-gray-50 rounded-[35px] flex items-center justify-center mb-6 border border-dashed border-gray-200">
                      <Search className="w-10 h-10 opacity-30" />
                   </div>
                   <h3 className="text-xl font-bold text-gray-800 tracking-tight">Lobby Standing By</h3>
                   <p className="text-sm mt-3 opacity-70">Once a scan is successful, the student profile will appear here instantly.</p>
                </div>
              ) : (
                <div className={`h-full bg-white rounded-[40px] shadow-2xl border-2 transition-all duration-500 transform animate-in zoom-in slide-in-from-right-10 ${
                  result.type === 'success' ? 'border-green-500' : 'border-amber-500'
                }`}>
                  {/* Status Banner */}
                  <div className={`p-8 text-center ${result.type === 'success' ? 'bg-green-600' : 'bg-amber-500'}`}>
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md rotate-3 border-2 border-white/20">
                      {result.type === 'success' ? <CheckCircle className="w-12 h-12 text-white" /> : <AlertCircle className="w-12 h-12 text-white" />}
                    </div>
                    <h2 className="text-4xl font-black text-white tracking-tighter">
                      {result.type === 'success' ? 'VERIFIED' : 'DENIED'}
                    </h2>
                    <p className="text-sm font-bold text-white uppercase tracking-widest opacity-80 mt-1">
                      {result.type === 'success' ? 'Access Granted' : result.message}
                    </p>
                  </div>

                  <div className="p-8 space-y-6">
                    {result.registration ? (
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Attendee</p>
                           <p className="text-3xl font-black text-gray-900 tracking-tighter">{result.registration.firstName} {result.registration.lastName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-gray-50 p-4 rounded-2xl">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Department</p>
                              <p className="font-bold text-gray-900 truncate">{result.registration.department}</p>
                           </div>
                           <div className="bg-gray-50 p-4 rounded-2xl">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Year</p>
                              <p className="font-bold text-gray-900">{result.registration.year}</p>
                           </div>
                        </div>

                        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                           <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3 h-3 text-blue-400" />
                              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Linked Event</p>
                           </div>
                           <p className="font-bold text-blue-900">{result.registration.eventTitle}</p>
                        </div>

                        {result.registration.attendedAt && (
                           <div className="bg-white border-2 border-blue-600 p-5 rounded-3xl flex items-center justify-between shadow-xl shadow-blue-50">
                              <div>
                                 <p className="text-[10px] font-black text-gray-400 uppercase mb-0.5">Check-in Log</p>
                                 <p className="text-2xl font-black text-blue-600">
                                   {new Date(result.registration.attendedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                 </p>
                              </div>
                              <Clock className="w-10 h-10 text-blue-100" />
                           </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12 px-6">
                        <p className="text-gray-400 font-bold mb-4">Error fetching registration details for ID: {manualId}</p>
                        <AlertCircle className="w-12 h-12 text-gray-100 mx-auto" />
                      </div>
                    )}

                    <button 
                      onClick={resetScanner} 
                      className={`w-full py-5 rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all text-white ${
                        result.type === 'success' ? 'bg-green-600 hover:bg-green-700 shadow-green-100' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                      }`}
                    >
                      SCAN NEXT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sweep {
          0% { top: 0%; opacity: 0.1; }
          50% { opacity: 0.8; }
          100% { top: 100%; opacity: 0.1; }
        }
        .animate-sweep {
          animation: sweep 2s linear infinite;
        }
        #reader video {
          object-fit: cover !important;
          width: 100% !important;
          height: 100% !important;
          border-radius: 32px !important;
        }
        #reader__scan_region {
           border: none !important;
        }
        #reader__dashboard {
           display: none !important;
        }
      `}} />
    </div>
  );
}
