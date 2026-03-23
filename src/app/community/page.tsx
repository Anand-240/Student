'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Users, Calendar, MapPin, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'lostfound' | 'projects'>('events');

  const events = [
    { id: '1', title: 'Tech Talk 2025', cat: 'Tech', date: 'Jan 25', location: 'Auditorium', rsvp: 45, cap: 100 },
    { id: '2', title: 'Sports Tournament', cat: 'Sports', date: 'Jan 28', location: 'Ground', rsvp: 78, cap: 200 },
    { id: '3', title: 'Culture Night', cat: 'Cultural', date: 'Feb 1', location: 'Main Hall', rsvp: 92, cap: 150 },
  ];

  const lostfound = [
    { id: '1', type: 'lost', title: 'Blue Backpack', desc: 'Lost near library', date: 'Jan 20', status: 'active' },
    { id: '2', type: 'found', title: 'Student ID Card', desc: 'Found in cafeteria', date: 'Jan 22', status: 'active' },
    { id: '3', type: 'lost', title: 'Watch', desc: 'Golden watch with leather band', date: 'Jan 15', status: 'resolved' },
  ];

  const projects = [
    { id: '1', title: 'AI Chatbot', skills: ['Python', 'NLP'], rating: 4.8 },
    { id: '2', title: 'Mobile App Dev', skills: ['React', 'Node.js'], rating: 4.6 },
    { id: '3', title: 'Web Design', skills: ['UI/UX', 'Figma'], rating: 4.9 },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-green-600 bg-opacity-20">
            <Users className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Community</h1>
            <p className="text-slate-400 text-sm">Events, lost & found, partnerships</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mb-8 border-b border-slate-700 pb-4">
            {['events', 'lostfound', 'projects'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 font-semibold rounded-lg ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                {tab === 'lostfound' ? 'Lost & Found' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </motion.div>

          {activeTab === 'events' && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((e, idx) => (
                <motion.div key={e.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-750 transition-all">
                  <h3 className="text-white font-bold text-lg mb-2">{e.title}</h3>
                  <div className="space-y-2 text-slate-400 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {e.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> {e.location}
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
                    <span className="text-slate-400 text-sm">{e.rsvp}/{e.cap} attending</span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-semibold">
                      RSVP
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'lostfound' && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {lostfound.map((item, idx) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-bold text-lg">{item.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${item.type === 'lost' ? 'bg-orange-600 bg-opacity-20 text-orange-400' : 'bg-green-600 bg-opacity-20 text-green-400'}`}>
                          {item.type === 'lost' ? '❌ Lost' : '✓ Found'}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{item.desc}</p>
                      <p className="text-slate-500 text-xs">{item.date}</p>
                    </div>
                    <button className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-semibold whitespace-nowrap ml-4">
                      Contact
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          )}

          {activeTab === 'projects' && (
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p, idx) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-750 transition-all">
                  <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {p.skills.map(s => (
                      <span key={s} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <span className="text-yellow-400 font-semibold flex items-center gap-1">
                      ⭐ {p.rating}
                    </span>
                    <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-semibold">
                      Join
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.section>
          )}
        </div>
      </main>
    </div>
  );
}
