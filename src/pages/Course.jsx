import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, CheckCircle, Play } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Course() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStage, setCurrentStage] = useState('Beginner');

  useEffect(() => {
    fetchEnrollment();
  }, [enrollmentId]);

  const fetchEnrollment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/course/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = response.data.find(e => e._id === enrollmentId);
      if (found && found.status === 'activated') {
        setEnrollment(found);
        setCurrentStage(found.currentStage || 'Beginner');
      } else {
        toast.error('Course not activated');
        navigate('/my-courses');
      }
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/my-courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (stage) => {
    setCurrentStage(stage);
    // Update current stage in backend
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/course/update-stage', 
        { enrollmentId, currentStage: stage }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to update stage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading course...</div>
      </div>
    );
  }

  const stages = ['Beginner', 'Intermediate', 'Advanced'];
  const currentStageData = enrollment?.courseId.stages.find(s => s.level === currentStage);

  return (
    <div className="w-full relative px-6 py-24 min-h-screen flex flex-col items-center max-w-7xl mx-auto z-10">
      {/* Background Radiance */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.6 }}
        className="w-full glass-card p-8 md:p-10 relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary pointer-events-none" />

        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/my-courses')}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">{enrollment?.courseId.title}</h2>
            <p className="text-slate-500 dark:text-gray-400">Current Stage: {currentStage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Stage Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Course Stages</h3>
              {stages.map((stage, index) => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  className={`w-full p-4 rounded-xl border transition-all ${
                    currentStage === stage
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStage === stage ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-white/20'
                    }`}>
                      {stages.indexOf(currentStage) > index ? (
                        <CheckCircle size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </div>
                    <span className="font-medium">{stage}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Stage Content */}
          <div className="lg:col-span-3">
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-white/5">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{currentStage} Level</h3>
              {currentStageData ? (
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                    {currentStageData.content}
                  </p>
                </div>
              ) : (
                <p className="text-slate-500 dark:text-gray-400">Content for this stage is being prepared.</p>
              )}
              
              <div className="mt-6 flex gap-4">
                {stages.indexOf(currentStage) < stages.length - 1 && (
                  <button
                    onClick={() => handleStageChange(stages[stages.indexOf(currentStage) + 1])}
                    className="px-6 py-2 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all"
                  >
                    Next Stage
                  </button>
                )}
                {stages.indexOf(currentStage) > 0 && (
                  <button
                    onClick={() => handleStageChange(stages[stages.indexOf(currentStage) - 1])}
                    className="px-6 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-gray-300 font-bold hover:bg-slate-300 dark:hover:bg-white/20 transition-all"
                  >
                    Previous Stage
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}