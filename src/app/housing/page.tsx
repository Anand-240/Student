'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Home, MapPin, Filter, DollarSign, Users } from 'lucide-react';

export default function HousingPage() {
  const [filterType, setFilterType] = useState('all');
  const [priceRange, setPriceRange] = useState([5000, 25000]);

  const listings = [
    { id: '1', name: '1 BHK PG', area: 'Indiranagar', price: 8000, beds: 1, amenities: 'WiFi, AC, Food', verified: true },
    { id: '2', name: '2 BHK Flat', area: 'Whitefield', price: 15000, beds: 2, amenities: 'WiFi, Gym, Security', verified: true },
    { id: '3', name: '1 BHK Hostel', area: 'Marathahalli', price: 6000, beds: 1, amenities: 'Meals, WiFi, Laundry', verified: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-orange-600 bg-opacity-20">
            <Home className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Housing</h1>
            <p className="text-slate-400 text-sm">Find your perfect PG, flat or hostel</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* Filters */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" /> Filters
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">Type</label>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="all">All Types</option>
                  <option value="pg">PG</option>
                  <option value="flat">Flat</option>
                  <option value="hostel">Hostel</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">Price Range</label>
                <div className="text-white text-sm">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-sm font-semibold block mb-2">Search</label>
                <input type="text" placeholder="Area, location..." className="w-full bg-slate-700 text-white rounded-lg p-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500" />
              </div>
            </div>
          </motion.div>

          {/* Listings */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {listings.map((listing, idx) => (
              <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-slate-600 hover:bg-slate-750 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-lg">{listing.name}</h3>
                      {listing.verified && <span className="px-2 py-1 bg-green-600 bg-opacity-20 text-green-400 text-xs font-bold rounded">✓ Verified</span>}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                      <MapPin className="w-4 h-4" /> {listing.area}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">₹{listing.price}</div>
                    <p className="text-slate-400 text-sm">/month</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-sm mb-4 pb-4 border-b border-slate-700">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {listing.beds} bed{listing.beds > 1 ? 's' : ''}
                  </span>
                  <span>•</span>
                  <span>{listing.amenities}</span>
                </div>

                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  View Details
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
