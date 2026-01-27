import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./user/pages/Home";
import Login from "./user/pages/Login";
import EventPage from "./user/pages/Events";
import EventRegistration from "./user/pages/Register";
import EventRegister from "./user/pages/EventRegister";
import RegistrationSuccess from "./user/pages/RegistrationSuccess";
import EventDetails from "./user/pages/EventDetails";
import RegisterPage from "./user/pages/UserRegister";
import ContactPage from "./user/pages/Contact";
import ChatroomApp from "./user/pages/Chatroom";
import StudentCalendar from "./user/pages/StudentCalendar";
import Gallery from "./user/pages/MediaGallery";
import FeedbackForm from "./user/pages/Feedback";
import AboutPage from "./user/pages/Aboutus";
import StudentProfilePage from "./user/pages/Profile";
import MyEvents from "./user/pages/MyEvents";
import OTPVerification from "./user/pages/OTPPage";
import ViewEventPage from "./admin/pages/ViewEvent";
import AdminEventPanel from "./admin/pages/Events";
import AdminStudentPanel from "./admin/pages/Students";
import FacultyPanel from "./admin/pages/Faculty";
import AddEventPage from "./admin/pages/AddEvent";
import AddStudentPage from "./admin/pages/AddStudent";
import AddFacultyPage from "./admin/pages/AddFaculty";
import RegistrationList from "./admin/pages/RegistrationList";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminChatroomApp from "./admin/pages/Chatroom";
import EventDashboard from "./admin/pages/Analytics";
import AdminFeedbackList from "./admin/pages/Feedback";
import EditEventPage from "./admin/pages/EditEvent";
import CategoryManagement from "./admin/pages/Categories";
import FacultyEventPanel from "./faculty/pages/Events";
import FacultyStudentPanel from "./faculty/pages/Students";
import FacultyAddStudentPage from "./faculty/pages/AddStudent";
import FacultyAddEventPage from "./faculty/pages/AddEvent";
import FacultyLogin from "./faculty/pages/Login";
import FacultyRegistrationList from "./faculty/pages/EventRegistrations";
import FacultyCalendar from "./faculty/pages/Calendar";
import FacultyGallery from "./faculty/pages/Gallery";
import FacultyRegisterPage from "./faculty/pages/Register";
import FacultyOTPVerification from "./faculty/pages/OTPPage";
import FacultyEventDashboard from "./faculty/pages/Analytics";
import FacultyViewEventPage from "./faculty/pages/ViewEvent";
import FacultyEditEventPage from "./faculty/pages/EditEvent";
import AttendanceScanner from "./faculty/pages/AttendanceScanner";

import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/otp" element={<OTPVerification />}></Route>
        <Route path="/userregister" element={<RegisterPage />}></Route>
        <Route path="/event" element={<EventPage />}></Route>
        <Route path="/eventdetails/:id" element={<EventDetails />}></Route>
        <Route path="/eventregister/:id" element={<EventRegister />}></Route>
        <Route path="/registration-success" element={<RegistrationSuccess />}></Route>
        <Route path="/contact" element={<ContactPage />}></Route>
        <Route path="/chatroom" element={<ChatroomApp />}></Route>
        <Route path="/studentcalendar" element={<StudentCalendar />}></Route>
        <Route path="/mediagallery" element={<Gallery />}></Route>
        <Route path="/feedback" element={<FeedbackForm />}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/profile" element={<StudentProfilePage />}></Route>
        <Route path="/myevents" element={<MyEvents />}></Route>

        <Route path="/eventregister" element={<EventRegistration />}></Route>
        <Route path="/admin/event/:id" element={<ViewEventPage />} />
        <Route path="/admin/events" element={<AdminEventPanel />}></Route>
        <Route path="/admin/students" element={<AdminStudentPanel />} />
        <Route path="/admin/faculty" element={<FacultyPanel />} />
        <Route path="/admin/addevent" element={<AddEventPage />} />
        <Route path="/admin/addstudent" element={<AddStudentPage />} />
        <Route path="/admin/addfaculty" element={<AddFacultyPage />} />
        <Route path="/admin/registrationlist" element={<RegistrationList />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/chatroom" element={<AdminChatroomApp />} />
        <Route path="/admin/dashboard" element={<EventDashboard />} />
        <Route path="/admin/feedback" element={<AdminFeedbackList />} />
        <Route path="/admin/editevent/:id" element={<EditEventPage />} />
        <Route path="/admin/categories" element={<CategoryManagement />} />

        <Route path="/faculty/events" element={<FacultyEventPanel />} />
        <Route path="/faculty/login" element={<FacultyLogin />} />
        <Route path="/faculty/students" element={<FacultyStudentPanel />} />
        <Route path="/faculty/addstudent" element={<FacultyAddStudentPage />} />
        <Route path="/faculty/addevent" element={<FacultyAddEventPage />} />
        <Route path="/faculty/registrationlist" element={<FacultyRegistrationList />} />
        <Route path="/faculty/calendar" element={<FacultyCalendar />} />
        <Route path="/faculty/gallery" element={<FacultyGallery />} />
        <Route path='/faculty/register' element={<FacultyRegisterPage/>} />
        <Route path='/faculty/otp' element={<FacultyOTPVerification/>} />
        <Route path='/faculty/dashboard' element={<FacultyEventDashboard/>} />
        <Route path='/faculty/event/:id' element={<FacultyViewEventPage />} />
        <Route path='/faculty/editevent/:id' element={<FacultyEditEventPage />} />
        <Route path='/faculty/check-in' element={<AttendanceScanner />} />
      </Routes>
    </>
  );
}

export default App;
