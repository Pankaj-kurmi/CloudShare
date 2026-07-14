import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import  Upload  from "./pages/Upload.jsx";
import Myfiles from "./pages/Myfiles.jsx";
import Transcations from "./pages/Transcations.jsx";
import Subscription from "./pages/Subscription.jsx";
import PublicFileView from "./pages/PublicFileView.jsx";
import { RedirectToSignIn, useAuth } from "@clerk/react";

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
};

const App = () => {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/upload" element={
        <ProtectedRoute>
          <Upload />
        </ProtectedRoute>
      } />
      <Route path="/my-files" element={
        <ProtectedRoute>
          <Myfiles />
        </ProtectedRoute>
      } />
      <Route path="/transcations" element={
        <ProtectedRoute>
          <Transcations />
        </ProtectedRoute>
      } />
      <Route path="/subscription" element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } />
      <Route path="/public-files/:id" element={<PublicFileView />} />
      <Route path="*" element={<RedirectToSignIn />}/>

      
    </Routes>
    </BrowserRouter>
  )
}
export default App;