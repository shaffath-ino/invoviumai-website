import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, ShieldCheck, ArrowRight, Loader2, Lock, User, Hash, Building2, GraduationCap } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export default function Login() {
  const [step, setStep] = useState('login'); // 'login' | 'signup' | 'success'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [accountType, setAccountType] = useState('student'); // 'student' | 'company'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // OTP specific states
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      toast.success(response.data.message || 'Login successful!');
      
      // Save token to localStorage
      localStorage.setItem('token', response.data.token);
      
      const { user } = response.data;
      login(user.email, user.accountType, user.id, 'Standard', user.name, 'Main');
      setStep('success');
      
      // Auto-redirect based on account type
      setTimeout(() => {
        if (user.accountType === 'student') {
          window.location.href = '/student-dashboard'; // Redirecting to Student Page
        } else {
          window.location.href = '/company-dashboard'; // Redirecting to Company Page
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to login';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email first.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    setIsSendingOtp(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/send-otp`, { email, type: step });
      toast.success(response.data.message || 'OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to send OTP';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsVerifyingOtp(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
      toast.success(response.data.message || 'OTP verified!');
      setOtpVerified(true);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Invalid or expired OTP';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      toast.error('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      toast.error('Passwords do not match.');
      return;
    }
    if (!otpVerified) {
      setError('Please verify your email with OTP first.');
      toast.error('Please verify your email with OTP first.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, {
        accountType,
        name,
        email,
        password
      });

      toast.success(response.data.message || 'Account created successfully!');
      
      // Auto login
      localStorage.setItem('token', response.data.token);
      
      const { user } = response.data;
      login(user.email, user.accountType, user.id, 'Standard', user.name, 'Main');
      setStep('success');

      // Auto-redirect based on account type
      setTimeout(() => {
        if (user.accountType === 'student') {
          window.location.href = '/student-dashboard'; // Redirecting to Student Page
        } else {
          window.location.href = '/company-dashboard'; // Redirecting to Company Page
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to create account';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!otpVerified) {
      toast.error('Please verify your email with OTP first.');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/reset-password`, { email, password });
      toast.success(response.data.message || 'Password reset successfully! Please log in.');
      setStep('login'); 
      setPassword('');
      setConfirmPassword('');
      setOtpVerified(false);
      setOtpSent(false);
      setOtp('');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || 'Failed to reset password';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to restrict OTP input to digits only
  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
  };

  return (
    <div className="w-full relative px-6 py-24 min-h-[90vh] flex items-center justify-center max-w-7xl mx-auto z-10 transition-colors">
      <Toaster position="top-right" duration={4000} />
      
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-md glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl group transition-all">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        <AnimatePresence mode="wait">
          {step === 'login' && (
            <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <Lock size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">System Login</h2>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 transition-colors">Enter your clearance credentials to access InvoviumAI infrastructure.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs text-center p-3 rounded-lg font-bold">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                      <Mail size={18} />
                    </div>
                    <input 
                      type="email" 
                      required 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                      placeholder="Email Address" 
                    />
                  </div>

                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                      <KeyRound size={18} />
                    </div>
                    <input 
                      type="password" 
                      required 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-widest" 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>
                
                <div className="flex justify-end mt-[-10px]">
                  <button type="button" onClick={() => { setStep('forgot'); setError(''); setOtpVerified(false); setOtpSent(false); }} className="text-xs font-bold text-primary hover:text-secondary transition-colors cursor-pointer">Forgot Password?</button>
                </div>

                <button type="submit" disabled={isLoading || !email || !password} className="btn-primary w-full flex items-center justify-center gap-2 h-12 shadow-[0_0_20px_rgba(230,57,70,0.3)] disabled:opacity-70 group/btn relative overflow-hidden transition-all mt-2">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Access System <ShieldCheck size={18} /></>}
                  </span>
                </button>
              </form>
              <div className="text-center mt-2">
                <button type="button" onClick={() => { setStep('signup'); setError(''); }} className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
                  Don't have an account? <span className="text-primary hover:underline">Sign Up</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'forgot' && (
            <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <KeyRound size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Reset Password</h2>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 transition-colors">Recover your clearance credentials.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs text-center p-3 rounded-lg font-bold">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  {/* Email & OTP Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Input + Send OTP Button */}
                    <div className="flex flex-col gap-2">
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          required 
                          disabled={otpVerified}
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 disabled:opacity-60" 
                          placeholder="Email Address" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !email || otpVerified}
                        className="py-2.5 w-full rounded-xl bg-primary/10 text-primary border border-primary/30 text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50 flex justify-center items-center h-[42px]"
                      >
                        {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : (otpSent ? 'Resend OTP' : 'Send OTP')}
                      </button>
                    </div>
                    
                    {/* OTP Input + Verify OTP Button */}
                    <div className="flex flex-col gap-2">
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                          <Hash size={18} />
                        </div>
                        <input 
                          type="text" 
                          required 
                          disabled={otpVerified}
                          maxLength={6}
                          value={otp} 
                          onChange={handleOtpChange} 
                          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 disabled:opacity-60" 
                          placeholder="6-Digit OTP" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || !otp || otp.length !== 6 || otpVerified}
                        className={`py-2.5 w-full rounded-xl border text-xs font-bold transition-all focus:outline-none flex justify-center items-center h-[42px]
                          ${otpVerified 
                            ? 'bg-green-500/20 text-green-600 border-green-500/50' 
                            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 disabled:opacity-50'}`}
                      >
                        {isVerifyingOtp ? <Loader2 size={16} className="animate-spin" /> : (otpVerified ? 'Verified ✓' : 'Verify OTP')}
                      </button>
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                        <KeyRound size={18} />
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-widest" 
                        placeholder="New Password" 
                      />
                    </div>

                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                        <KeyRound size={18} />
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-widest" 
                        placeholder="Confirm Password" 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading || !email || !password || !otpVerified} className="btn-primary w-full flex items-center justify-center gap-2 h-12 shadow-[0_0_20px_rgba(230,57,70,0.3)] disabled:opacity-70 group/btn relative overflow-hidden transition-all mt-2">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Reset Password <ArrowRight size={18} /></>}
                  </span>
                </button>
              </form>
              <div className="text-center mt-2">
                <button type="button" onClick={() => { setStep('login'); setError(''); }} className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
                  Remembered your password? <span className="text-primary hover:underline">Log In</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'signup' && (
            <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="text-center mb-2">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Create Account</h2>
                <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 transition-colors">Register for new clearance credentials.</p>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs text-center p-3 rounded-lg font-bold">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSignup} className="flex flex-col gap-5">
                <div className="flex flex-col gap-4">
                  {/* Account Type Selector */}
                  <div className="w-full grid grid-cols-2 gap-3 mb-1">
                    <button type="button" onClick={() => setAccountType('student')} className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${accountType === 'student' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-primary/30'}`}>
                      <GraduationCap size={16} /> Student
                    </button>
                    <button type="button" onClick={() => setAccountType('company')} className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${accountType === 'company' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-slate-200 dark:border-white/10 text-slate-500 hover:border-primary/30'}`}>
                      <Building2 size={16} /> Company
                    </button>
                  </div>

                  {/* Name field */}
                  <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                      <User size={18} />
                    </div>
                    <input 
                      type="text" 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500" 
                      placeholder="Full Name" 
                    />
                  </div>

                  {/* Email & OTP Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email Input + Send OTP Button */}
                    <div className="flex flex-col gap-2">
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                          <Mail size={18} />
                        </div>
                        <input 
                          type="email" 
                          required 
                          disabled={otpVerified}
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 disabled:opacity-60" 
                          placeholder="Email Address" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !email || otpVerified}
                        className="py-2.5 w-full rounded-xl bg-primary/10 text-primary border border-primary/30 text-xs font-bold hover:bg-primary/20 transition-all disabled:opacity-50 flex justify-center items-center h-[42px]"
                      >
                        {isSendingOtp ? <Loader2 size={16} className="animate-spin" /> : (otpSent ? 'Resend OTP' : 'Send OTP')}
                      </button>
                    </div>
                    
                    {/* OTP Input + Verify OTP Button */}
                    <div className="flex flex-col gap-2">
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                          <Hash size={18} />
                        </div>
                        <input 
                          type="text" 
                          required 
                          disabled={otpVerified}
                          maxLength={6}
                          value={otp} 
                          onChange={handleOtpChange} 
                          className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 disabled:opacity-60" 
                          placeholder="6-Digit OTP" 
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={handleVerifyOtp}
                        disabled={isVerifyingOtp || !otp || otp.length !== 6 || otpVerified}
                        className={`py-2.5 w-full rounded-xl border text-xs font-bold transition-all focus:outline-none flex justify-center items-center h-[42px]
                          ${otpVerified 
                            ? 'bg-green-500/20 text-green-600 border-green-500/50' 
                            : 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 disabled:opacity-50'}`}
                      >
                        {isVerifyingOtp ? <Loader2 size={16} className="animate-spin" /> : (otpVerified ? 'Verified ✓' : 'Verify OTP')}
                      </button>
                    </div>
                  </div>

                  {/* Password & Confirm - Note: The UI is completely intact for glassmorphism */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                        <KeyRound size={18} />
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-widest" 
                        placeholder="Password" 
                      />
                    </div>

                    <div className="relative group/input">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within/input:text-primary transition-colors">
                        <KeyRound size={18} />
                      </div>
                      <input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-500 tracking-widest" 
                        placeholder="Confirm" 
                      />
                    </div>
                  </div>
                </div>


                <button type="submit" disabled={isLoading || !name || !email || !password || !otpVerified} className="btn-primary w-full flex items-center justify-center gap-2 h-12 shadow-[0_0_20px_rgba(230,57,70,0.3)] disabled:opacity-70 group/btn relative overflow-hidden transition-all mt-2">
                  <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out z-0"></span>
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                  </span>
                </button>
              </form>
              <div className="text-center mt-2">
                <button type="button" onClick={() => { setStep('login'); setError(''); }} className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-primary transition-colors">
                  Already have an account? <span className="text-primary hover:underline">Log In</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-4 py-6">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay: 0.2 }} className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <ShieldCheck size={40} className="text-green-500" />
              </motion.div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white transition-colors">Authentication Successful</h2>
              <p className="text-slate-500 dark:text-gray-400 text-sm transition-colors">Welcome back, <span className="font-bold text-slate-800 dark:text-white">{email}</span>. Initializing protocols...</p>
              
              <button onClick={() => {
                 setStep('login'); 
                 setPassword('');
                 login('', '', '', '', '', '');
                 localStorage.clear();
              }} className="mt-4 text-xs font-bold text-primary hover:text-secondary uppercase tracking-wider transition-colors hover:underline">
                 Log Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
