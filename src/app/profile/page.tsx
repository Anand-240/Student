'use client';

import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Award, BookOpen, Settings, Edit2, Upload, X, Save, Loader2, Camera } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function Profile() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [session, setSession] = useState<any>(null); // For typing compatibility

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const loggedIn = document.cookie.includes('isLoggedIn=true');
      setStatus(loggedIn ? 'authenticated' : 'unauthenticated');
    }
  }, []);
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: '',
    major: '',
    year: '',
    phone: '',
    location: '',
    gpa: '',
    profilePhoto: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditForm({
          name: data.name || '',
          major: data.major || '',
          year: data.year || '',
          phone: data.phone || '',
          location: data.location || '',
          gpa: data.gpa || '',
          profilePhoto: data.profilePhoto || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic image validation
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      // Check size (e.g. max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large (max 5MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setEditForm(prev => ({ ...prev, profilePhoto: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-center px-4">
        <h1 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-200">Please Login to View Profile</h1>
        <p className="text-slate-500">You need to be signed in to see and edit your profile information.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Column: Picture and Summary */}
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="h-24 bg-gradient-to-r from-purple-600 to-pink-600 relative">
               <div className="absolute inset-x-0 bottom-[-40px] flex justify-center">
                  <div className="relative group shrink-0 w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                    <motion.div
                      whileHover={{ scale: isEditing ? 1.02 : 1.05 }}
                      className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl overflow-hidden shadow-inner"
                    >
                      {editForm.profilePhoto || profile.profilePhoto ? (
                        <img
                          src={isEditing ? editForm.profilePhoto : profile.profilePhoto}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>👩‍🎓</span>
                      )}
                    </motion.div>
                    
                    {isEditing && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-slate-900 text-white p-1.5 rounded-full shadow-lg hover:bg-slate-700 transition"
                        title="Upload Photo"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
               </div>
            </div>
            
            <div className="pt-14 pb-6 px-6 text-center">
               {isEditing ? (
                  <input
                    type="text"
                    className="w-full text-center text-xl font-bold bg-slate-100 dark:bg-slate-700 rounded text-slate-900 dark:text-white mb-2 py-1 outline-none"
                    value={editForm.name}
                    onChange={e => setEditForm({...editForm, name: e.target.value})}
                  />
               ) : (
                 <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{profile.name}</h1>
               )}
               
               <div className="text-slate-500 text-sm mb-4">
                 {isEditing ? (
                   <input
                     type="text"
                     className="w-full text-center text-slate-600 bg-slate-100 dark:bg-slate-700 rounded px-2 py-1 text-xs outline-none"
                     placeholder="e.g. Computer Science"
                     value={editForm.major}
                     onChange={e => setEditForm({...editForm, major: e.target.value})}
                   />
                 ) : (
                   <p>{profile.major || 'Undecided'}</p>
                 )}
               </div>

                {isEditing ? (
                  <div className="flex gap-2 justify-center mb-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1 shadow disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(false)}
                      className="bg-red-500 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1 shadow"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 font-semibold text-sm py-2 rounded-lg flex items-center justify-center gap-2 mb-4"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                )}

               <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-sm mb-2 text-left">
                 <div className="text-slate-500">Year</div>
                 <div className="font-semibold">{isEditing ? (
                    <input type="text" className="bg-white dark:bg-slate-600 w-16 text-right px-1 rounded outline-none" value={editForm.year} onChange={e=>setEditForm({...editForm, year: e.target.value})} />
                 ) : (profile.year || '-')}</div>
               </div>
               <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg text-sm text-left">
                 <div className="text-slate-500">GPA</div>
                 <div className="font-semibold">{isEditing ? (
                    <input type="text" className="bg-white dark:bg-slate-600 w-16 text-right px-1 rounded outline-none" value={editForm.gpa} onChange={e=>setEditForm({...editForm, gpa: e.target.value})} />
                 ) : (profile.gpa || '-')}</div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Info and activity */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
              <User className="w-5 h-5 text-purple-600" />
              Contact Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-400 mb-0.5">Email (Cannot be changed)</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-400 mb-0.5">Phone Number</p>
                  {isEditing ? (
                     <input type="text" className="bg-white dark:bg-slate-600 text-slate-900 dark:text-white w-full px-2 py-1 rounded outline-none" value={editForm.phone} onChange={e=>setEditForm({...editForm, phone: e.target.value})} placeholder="+1 234 567 8900" />
                  ) : (
                     <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{profile.phone || 'Not added yet'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs text-slate-400 mb-0.5">Location</p>
                  {isEditing ? (
                     <input type="text" className="bg-white dark:bg-slate-600 text-slate-900 dark:text-white w-full px-2 py-1 rounded outline-none" value={editForm.location} onChange={e=>setEditForm({...editForm, location: e.target.value})} placeholder="City, State" />
                  ) : (
                     <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{profile.location || 'Not set'}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-2xl shadow-lg relative overflow-hidden"
              >
                <BookOpen className="w-20 h-20 text-white/10 absolute right-[-10px] bottom-[-10px]" />
                <p className="text-white/80 font-medium mb-1">Courses Enrolled</p>
                <p className="text-4xl font-bold text-white mb-2">{profile.coursesEnrolled || '0'}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-pink-500 to-pink-700 p-6 rounded-2xl shadow-lg relative overflow-hidden"
              >
                <Award className="w-20 h-20 text-white/10 absolute right-[-10px] bottom-[-10px]" />
                <p className="text-white/80 font-medium mb-1">Achievements</p>
                <p className="text-4xl font-bold text-white mb-2">{profile.achievements || '0'}</p>
              </motion.div>
          </div>
          
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {['Joined the student platform', 'Updated profile information'].map((activity, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                  <p className="text-slate-700 dark:text-slate-300">{activity}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
