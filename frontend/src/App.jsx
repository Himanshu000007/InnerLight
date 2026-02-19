import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Share from './pages/Share';
import Journal from './pages/Journal';
import Calm from './pages/Calm';
import Games from './pages/Games';
import Contact from './pages/Contact';
import MoodTracker from './pages/MoodTracker';
import InnersoulChat from './components/InnersoulChat';

/**
 * App Component
 * 
 * Main application component with routing.
 * Wraps everything in AuthProvider for authentication context.
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/share" element={<Share />} />
              <Route path="/games" element={<Games />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Routes (require authentication) */}
              <Route
                path="/journal"
                element={
                  <ProtectedRoute>
                    <Journal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calm"
                element={
                  <ProtectedRoute>
                    <Calm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mood"
                element={
                  <ProtectedRoute>
                    <MoodTracker />
                  </ProtectedRoute>
                }
              />

              {/* Redirect unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <InnersoulChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
