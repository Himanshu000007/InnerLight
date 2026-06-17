import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Routes from './routes/Routes';
import BreathingWidget from './components/common/BreathingWidget';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes />
          <BreathingWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1E293B',
                color: '#F8FAFC',
                border: '1px solid #334155',
              },
            }}
          />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;