import React from 'react';
import { Link } from 'react-router-dom';
import { CircleDot, MessageCircle, Briefcase, Code, Mail, ShieldCheck, Building, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { name: 'Social', url: '#', icon: MessageCircle },
    { name: 'Network', url: '#', icon: Briefcase },
    { name: 'Developers', url: '#', icon: Code },
  ];

  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-dark pt-20 pb-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-full flex flex-col justify-between">
        
        {/* Main Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & Intro */}
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
              <CircleDot size={20} className="text-primary" strokeWidth={3} />
              <h3 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white transition-colors m-0">
                InoviumAI
              </h3>
            </Link>
            <p className="text-slate-500 dark:text-gray-400 text-[13px] leading-relaxed mb-8 transition-colors">
              A next-generation enterprise AI company building intelligent, scalable platforms. We specialize in eliminating operational latency and automating complex workflows.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name} 
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-300 dark:hover:bg-primary/20 hover:text-slate-900 dark:hover:text-primary transition-all duration-300 border border-slate-300 dark:border-white/5"
                  aria-label={social.name}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest transition-colors">
              Quick Links
            </h4>
            <ul className="space-y-3 text-[13px] text-slate-600 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal & Resources */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest transition-colors">
              Resources & Legal
            </h4>
            <ul className="space-y-3 text-[13px] text-slate-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security Overview</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-slate-900 dark:text-white font-bold mb-6 text-sm uppercase tracking-widest transition-colors">
              Get in Touch
            </h4>
            <div className="space-y-4 text-[13px] text-slate-600 dark:text-gray-400">
              <p className="flex items-center gap-3">
                <Mail size={16} className="text-primary shrink-0"/> contact@inoviumai.com
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="text-primary shrink-0"/> <span>9884716042 / 9884946867</span>
              </p>
              <p className="flex items-start gap-3">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5"/> 
                <span>Plot No 428, VGP 2nd Cross Street<br/>VGP Layout, Uthandi, Chennai 600119</span>
              </p>
            </div>
          </div>

        </div>

        {/* Corporate Authority Details - Hidden & Shortened */}
        <details className="mb-8 text-xs text-slate-500 dark:text-gray-500 group cursor-pointer border-t border-slate-200 dark:border-white/10 pt-6">
          <summary className="font-semibold outline-none hover:text-primary transition-colors flex items-center gap-2 select-none">
            <ShieldCheck size={14} className="text-primary" /> View Corporate Registration Details
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-8 pl-6 border-l-2 border-slate-200 dark:border-white/10 opacity-80">
             <div>
               <p className="font-medium text-slate-700 dark:text-gray-300">Govt. of India | Ministry of Corporate Affairs</p>
               <p className="mt-1 text-[10px] italic">Disclaimer: Incorporation proof only. Not a business license.</p>
             </div>
             <div>
               <p className="font-medium text-slate-700 dark:text-gray-300 uppercase">INOVIUM AI PRIVATE LIMITED</p>
               <p className="mt-1 font-mono text-[10.5px]">CIN: U62011TN2024PTC170765 | PAN: AAHCI7029M | TAN: CHEI12079E | Inc: 03 Jun 2024</p>
             </div>
          </div>
        </details>

        {/* Bottom Bar Container */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 transition-colors">
          <p className="text-slate-500 dark:text-gray-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} INOVIUM AI PRIVATE LIMITED. All rights reserved. Registered under ROC.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500 dark:text-gray-500 transition-colors">
             <span className="flex items-center gap-1"><CircleDot size={12} className="text-primary" /> Active Systems Monitoring</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
