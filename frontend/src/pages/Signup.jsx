import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

/**
 * Signup Page — Multi-step with OTP verification
 *
 * Step 1: Name, Email, Password → Send OTP
 * Step 2: Enter OTP → Verify & Create Account
 * Step 3: Success → Redirect to Login
 */
const Signup = () => {
  const [step, setStep] = useState(1); // 1 = details, 2 = OTP

  // Step 1 fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 fields
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const { sendOtp, signup } = useAuth();
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    const result = await sendOtp(email);

    if (result.success) {
      setInfo(`OTP sent to ${email}. Please check your inbox (and spam folder).`);
      setStep(2);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Step 2: Verify OTP & Create Account
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signup(name, email, password, otp);

    if (result.success) {
      navigate('/login', { state: { successMessage: 'Account created! Please log in to continue.' } });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    const result = await sendOtp(email);
    if (result.success) {
      setInfo('A new OTP has been sent to your email.');
      setOtp('');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      {/* Left Side - Branding */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>

          <h1 className="auth-headline">It's okay to not be okay.</h1>
          <p className="auth-subtitle">
            Start your journey towards inner peace and wellness.
          </p>

          <div className="auth-illustration">
            <div className="calm-person"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Card */}
      <div className="auth-right">
        <div className="auth-card">
          <h2 className="auth-card-title">Create Account</h2>
          <p className="auth-card-subtitle">
            {step === 1 ? 'Join our supportive community' : 'Enter the OTP sent to your email'}
          </p>

          {/* Step indicator */}
          <div className="otp-step-indicator">
            <div className={`otp-step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`otp-step-line ${step >= 2 ? 'active' : ''}`}></div>
            <div className={`otp-step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {info && <div className="auth-info">{info}</div>}

          {/* Step 1: Account Details */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  className="input"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="input"
                  placeholder="•••••••• (min. 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading}
              >
                {loading ? 'Sending OTP...' : 'Send Verification Code →'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">6-Digit OTP</label>
                <input
                  type="text"
                  id="otp"
                  className="input otp-input"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                />
                <p className="otp-hint">
                  Sent to <strong>{email}</strong>
                </p>
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-submit"
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Creating account...' : 'Verify & Create Account ✓'}
              </button>

              <div className="otp-actions">
                <button
                  type="button"
                  className="otp-back-btn"
                  onClick={() => { setStep(1); setError(''); setInfo(''); setOtp(''); }}
                  disabled={loading}
                >
                  ← Change details
                </button>
                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={handleResendOtp}
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
