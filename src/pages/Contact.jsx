import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("System initialized. Request sent to command servers.");
  };

  return (
    <div className="w-full relative px-6 py-24 max-w-7xl mx-auto">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="text-center mb-20 max-w-3xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">
           Architect your <span className="text-gradient">Future.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-lg text-gray-400 leading-relaxed max-w-xl mx-auto font-medium">
          Ready to deploy uncompromising AI scale? Contact us today or schedule a demonstration with our systems architecture team.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative z-10">
        
        {/* Animated Floating Label Form */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="glass-card p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Secure Channel</h2>
          <p className="text-gray-400 mb-10 text-sm">Transmission protocols are strictly confidential.</p>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative z-0 w-full group">
                <input type="text" name="entity" id="entity" className="block py-3 px-0 w-full text-base text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-300 dark:border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" placeholder=" " required />
                <label htmlFor="entity" className="peer-focus:font-bold absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider">Entity Name</label>
              </div>
              <div className="relative z-0 w-full group">
                <input type="email" name="email" id="email" className="block py-3 px-0 w-full text-base text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-300 dark:border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" placeholder=" " required />
                <label htmlFor="email" className="peer-focus:font-bold absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider">Comms Protocol (Email)</label>
              </div>
            </div>
            
            <div className="relative z-0 w-full group mt-2">
              <input type="text" name="subject" id="subject" className="block py-3 px-0 w-full text-base text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-300 dark:border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors" placeholder=" " required />
              <label htmlFor="subject" className="peer-focus:font-bold absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider">Deployment Subject</label>
            </div>

            <div className="relative z-0 w-full group mt-2">
              <textarea name="reqs" id="reqs" required rows="4" className="block py-3 px-0 w-full text-base text-slate-900 dark:text-white bg-transparent border-0 border-b-2 border-slate-300 dark:border-white/20 appearance-none focus:outline-none focus:ring-0 focus:border-primary peer transition-colors resize-none" placeholder=" "></textarea>
              <label htmlFor="reqs" className="peer-focus:font-bold absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 uppercase tracking-wider">Operational Requirements</label>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
              <button type="submit" className="btn-primary w-full sm:w-auto relative group overflow-hidden shadow-[0_0_20px_rgba(230,57,70,0.3)]">
                 <span className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                 <span className="relative flex items-center justify-center gap-2">Contact Us</span>
              </button>
              <button type="button" onClick={handleSubmit} className="btn-outline w-full sm:w-auto hover:bg-white/10 group relative overflow-hidden">
                 <span className="relative flex items-center justify-center gap-2">Book Demo</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Company Details */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="flex flex-col gap-10 lg:pt-12">
          
          <div className="flex items-start gap-6 group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-lg">
              <Mail className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Direct Communications</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-0.5">For sales and integrations:</p>
              <span className="text-primary font-bold">contact@invoviumai.com</span>
            </div>
          </div>

          <div className="flex items-start gap-6 group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-lg">
              <Phone className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Voice Protocols</h4>
              <p className="text-gray-400 text-sm leading-relaxed mb-0.5">Standard business hours operation.</p>
              <span className="text-primary font-bold">9884716042, 9884946867</span>
            </div>
          </div>

          <div className="flex items-start gap-6 group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/50 transition-all shadow-lg">
              <MapPin className="text-primary" size={24} />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Global Headquarters</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Plot No 428, VGP 2nd Cross Street<br/>
                VGP Layout, Uthandi<br/>
                Chennai 600119
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
