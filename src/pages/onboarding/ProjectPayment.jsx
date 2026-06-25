import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { CreditCard, ArrowLeft, CheckCircle, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function ProjectPayment() {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online'); // 'online' or 'manual'
  const [screenshot, setScreenshot] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const PROJECT_PRICE = 5000;

  const handlePayment = async () => {
    if (screenshot) {
      setProcessing(true);
      setUploadProgress(0);

      // Simulate smooth progress up to 90%
      let currentProgress = 0;
      let lastTime = performance.now();
      let animationFrameId;

      const updateProgress = (time) => {
        if (time - lastTime >= 100) {
          currentProgress += Math.floor(Math.random() * 8) + 4;
          if (currentProgress >= 90) {
            currentProgress = 90;
            setUploadProgress(currentProgress);
            return;
          }
          setUploadProgress(currentProgress);
          lastTime = time;
        }
        animationFrameId = requestAnimationFrame(updateProgress);
      };
      animationFrameId = requestAnimationFrame(updateProgress);

      try {
        const token = localStorage.getItem('token');
        const base64data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(screenshot);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

        await axios.post(`${import.meta.env.VITE_API_URL}/payments/upload-screenshot`, 
          {
            screenshotBase64: base64data,
            amount: PROJECT_PRICE
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        cancelAnimationFrame(animationFrameId);
        setUploadProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 600));

        toast.success('Screenshot uploaded successfully! Pending verification.');
        navigate(`/dashboard`);
      } catch (error) {
        cancelAnimationFrame(animationFrameId);
        toast.error(error.response?.data?.message || 'Failed to upload screenshot');
        setProcessing(false);
      }
      return;
    }

    if (paymentMethod === 'manual') {
      toast.error("Please upload a payment screenshot.");
      return;
    }

    setProcessing(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setProcessing(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // 1. Create Order
      const { data: order } = await axios.post(`${import.meta.env.VITE_API_URL}/payments/create-order`, 
        { amount: PROJECT_PRICE }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'dummy_key', // Make sure this is in .env
        amount: order.amount,
        currency: order.currency,
        name: "InoviumAI",
        description: `Payment for Final Year Project`,
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await axios.post(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            if (verifyRes.data.message === "Payment verified successfully") {
              toast.success('Payment successful! Your project allocation is confirmed.');
              navigate(`/dashboard`);
            }
          } catch (error) {
            toast.error(error.response?.data?.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: "Student", // Could fetch from context or profile
          email: "student@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#9333ea" // purple color to match project panel
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI",
                instruments: [
                  { method: "upi" }
                ]
              },
              other: {
                name: "Other Payment Modes",
                instruments: [
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" }
                ]
              }
            },
            sequence: ["block.upi", "block.other"],
            preferences: {
              show_default_blocks: false
            }
          }
        }
      };

      // 4. Open Razorpay
      const razor = new window.Razorpay(options);
      razor.on('payment.failed', function (response){
        toast.error(`Payment failed: ${response.error.description}`);
      });
      razor.open();
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      if(paymentMethod !== 'manual') setProcessing(false);
    }
  };

  return (
    <div className="w-full relative px-6 py-12 md:py-24 min-h-screen flex flex-col items-center max-w-4xl mx-auto z-10">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      {processing && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md p-8 rounded-3xl bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Glowing line */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse" />
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -inset-1 rounded-full bg-purple-500/20 blur-lg animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Upload className="w-10 h-10 text-purple-500 animate-bounce" />
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                {screenshot ? 'Uploading Screenshot' : 'Processing Payment'}
              </h3>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                {screenshot 
                  ? 'Transmitting secure payment receipt. Please keep this browser window open.'
                  : 'Contacting secure gateway. Please wait...'}
              </p>

              {screenshot && (
                <div className="w-full space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>PROGRESS</span>
                    <span className="text-purple-500">{uploadProgress}%</span>
                  </div>
                  
                  {/* Progress Bar Container */}
                  <div className="w-full h-3 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-slate-200/50 dark:border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-[0_0_10px_rgba(147,51,234,0.5)] transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  
                  {/* Subtitle animation indicator */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-purple-500 font-medium mt-2 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                    <span>Sending base64 stream payload...</span>
                  </div>
                </div>
              )}

              {!screenshot && (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="w-5 h-5 text-purple-500 animate-spin" />
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Initializing gateway...</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-full glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Project Payment</h2>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Service Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Service:</span> Final Year Project Allocation</p>
              <p><span className="font-medium">Includes:</span> Source code, documentation, and live mentorship</p>
              <p><span className="font-medium">Amount:</span> ₹{PROJECT_PRICE}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Payment Method</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('online')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'online' 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-slate-200 dark:border-white/10 hover:border-purple-500/50'
                }`}
              >
                <CreditCard size={24} className={paymentMethod === 'online' ? 'text-purple-500' : 'text-slate-400'} />
                <div className="text-left">
                  <p className={`font-medium ${paymentMethod === 'online' ? 'text-purple-500' : 'text-slate-900 dark:text-white'}`}>Online Payment</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Cards, UPI, Netbanking</p>
                </div>
                {paymentMethod === 'online' && <CheckCircle size={20} className="text-purple-500 ml-auto" />}
              </button>

              <button
                onClick={() => setPaymentMethod('manual')}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'manual' 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-slate-200 dark:border-white/10 hover:border-purple-500/50'
                }`}
              >
                <ImageIcon size={24} className={paymentMethod === 'manual' ? 'text-purple-500' : 'text-slate-400'} />
                <div className="text-left">
                  <p className={`font-medium ${paymentMethod === 'manual' ? 'text-purple-500' : 'text-slate-900 dark:text-white'}`}>Manual Payment</p>
                  <p className="text-xs text-slate-500 dark:text-gray-400">Upload Screenshot</p>
                </div>
                {paymentMethod === 'manual' && <CheckCircle size={20} className="text-purple-500 ml-auto" />}
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10">
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Please pay ₹{PROJECT_PRICE} using your preferred method and upload the payment screenshot below. Our team will verify your payment shortly.
              </p>
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <input 
                    type="file" 
                    id="screenshot-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setScreenshot(e.target.files[0])}
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload size={32} className="text-purple-500" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {screenshot ? screenshot.name : 'Click to Upload Screenshot'}
                    </span>
                    <span className="text-xs text-slate-500">Max size 5MB (JPG, PNG)</span>
                  </label>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            disabled={processing || (paymentMethod === 'manual' && !screenshot)}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold text-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {processing && <Loader2 className="w-5 h-5 animate-spin" />}
            {processing 
              ? 'Processing...' 
              : screenshot 
                ? 'Submit Screenshot for Verification'
                : paymentMethod === 'manual' 
                  ? 'Submit for Verification' 
                  : `Pay ₹${PROJECT_PRICE}`
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
}