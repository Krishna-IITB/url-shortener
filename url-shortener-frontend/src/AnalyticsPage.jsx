// // src/AnalyticsPage.jsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { useParams, Link } from 'react-router-dom';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   Legend,
// } from 'recharts';

// const API_BASE =
//   import.meta.env.VITE_API_URL ||
//   'https://url-shortener-production-9379.up.railway.app';

// export default function AnalyticsPage() {
//   const { code } = useParams();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         setLoading(true);
//         setError('');
//         const res = await axios.get(`${API_BASE}/api/stats/${code}`);
//         setStats(res.data.data);
//       } catch (err) {
//         const msg = err.response?.data?.error || 'Failed to load stats';
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStats();
//   }, [code]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
//         <p className="text-sm text-slate-300">Loading analytics…</p>
//       </div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
//         <p className="mb-4 text-red-400">{error || 'No data'}</p>
//         <Link
//           to="/"
//           className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold shadow-md shadow-indigo-500/40"
//         >
//           Back to Shortener
//         </Link>
//       </div>
//     );
//   }

//   const {
//     total_clicks,
//     unique_ips,
//     clicks_by_date,
//     device_breakdown,
//     top_countries,
//     top_referrers,
//   } = stats;

//   const clickRate =
//     unique_ips > 0 ? (total_clicks / unique_ips).toFixed(2) : 'N/A';

//   const timelineData = (clicks_by_date || []).map((d) => ({
//     date: d.date,
//     clicks: d.clicks,
//   }));

//   const countryData = (top_countries || []).map((c) => ({
//     name: c.country || 'Unknown',
//     value: c.count,
//   }));

//   // Prepare device data: keep raw label + wrapped label for axis
//   const deviceData = (device_breakdown || []).map((d) => {
//     const rawLabel = d.device_type || 'Unknown';
//     return {
//       rawLabel,
//       device: rawLabel.replace(' ', '\n'),
//       count: Number(d.count || 0),
//     };
//   });

//   const referrerData = top_referrers || [];

//   const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4'];

//   return (
//     <div className="relative min-h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
//       {/* reuse animated blobs */}
//       <div className="bg-orbit" />

//       <div className="mx-auto max-w-7xl px-4 lg:px-10 py-8 space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between animate-fade-up">
//           <div className="space-y-1">
//             <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
//               Analytics dashboard
//             </p>
//             <h1 className="text-2xl sm:text-3xl font-semibold">
//               Analytics for{' '}
//               <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
//                 {code}
//               </span>
//             </h1>
//           </div>
//           <Link
//             to="/"
//             className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70 hover:bg-slate-800 text-xs sm:text-sm flex items-center gap-1 shadow-md shadow-black/40 transition"
//           >
//             ← Back
//           </Link>
//         </div>

//         {/* Overview cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
//           <StatCard label="Total Clicks" value={total_clicks} accent="indigo" />
//           <StatCard label="Unique IPs" value={unique_ips} accent="sky" />
//           <StatCard label="Click Rate" value={clickRate} accent="emerald" />
//         </div>

//         {/* Main charts row */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Line chart: clicks over time */}
//           <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
//             <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
//               Clicks over time (last 7 days)
//             </p>
//             <div className="w-full h-72">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={timelineData}>
//                   <XAxis dataKey="date" stroke="#9ca3af" />
//                   <YAxis allowDecimals={false} stroke="#9ca3af" />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="clicks"
//                     stroke="#6366f1"
//                     strokeWidth={2}
//                     dot={{ r: 3 }}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           {/* Device bar chart + list */}
//           <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
//             <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
//               Device Types
//             </p>
//             {deviceData.length === 0 ? (
//               <p className="text-sm text-slate-400">No device data yet</p>
//             ) : (
//               <>
//                 <div className="w-full h-60">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={deviceData}
//                       margin={{ left: 0, right: 16, bottom: 24 }}
//                     >
//                       <XAxis
//                         dataKey="device"
//                         stroke="#9ca3af"
//                         interval={0}
//                         tick={{ fontSize: 11, lineHeight: 1.1 }}
//                       />
//                       <YAxis allowDecimals={false} stroke="#9ca3af" />
//                       <Tooltip
//                         formatter={(value, _name, entry) => [
//                           value,
//                           entry.payload.rawLabel || 'Device',
//                         ]}
//                       />
//                       <Bar
//                         dataKey="count"
//                         fill="#22c55e"
//                         radius={[6, 6, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 <ul className="mt-3 space-y-1 text-xs text-slate-400">
//                   {deviceData.map((d) => (
//                     <li key={d.rawLabel} className="flex justify-between">
//                       <span>{d.rawLabel}</span>
//                       <span className="font-semibold text-slate-100">
//                         {d.count}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Second row: countries + referrers */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
//           {/* Top countries pie chart */}
//           <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
//             <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
//               Top 5 Countries
//             </p>
//             {countryData.length === 0 ? (
//               <p className="text-sm text-slate-400">No country data yet</p>
//             ) : (
//               <div className="w-full h-72">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={countryData}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={90}
//                       label
//                     >
//                       {countryData.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             )}
//           </div>

//           {/* Top referrers table */}
//           <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
//             <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
//               <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 animate-pulse" />
//               Top Referrers
//             </p>
//             {referrerData.length === 0 ? (
//               <p className="text-sm text-slate-400">No referrer data yet</p>
//             ) : (
//               <div className="overflow-x-auto max-h-72">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="text-left text-slate-400 border-b border-slate-800">
//                       <th className="py-2 pr-4">Referrer</th>
//                       <th className="py-2 text-right">Clicks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {referrerData.map((r) => (
//                       <tr
//                         key={r.referrer || 'direct'}
//                         className="border-b border-slate-900/80"
//                       >
//                         <td className="py-2 pr-4 break-all">
//                           {r.referrer || 'Direct / None'}
//                         </td>
//                         <td className="py-2 text-right font-medium">
//                           {r.count}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ label, value, accent }) {
//   const accentMap = {
//     indigo: 'from-indigo-500/40 to-sky-500/10',
//     sky: 'from-sky-500/40 to-emerald-500/10',
//     emerald: 'from-emerald-500/50 to-sky-500/10',
//   };

//   return (
//     <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-xl overflow-hidden">
//       <div
//         className={`pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${
//           accentMap[accent] || accentMap.indigo
//         } opacity-60 blur-2xl`}
//       />
//       <p className="text-xs text-slate-400">{label}</p>
//       <p className="mt-2 text-2xl sm:text-3xl font-semibold">{value}</p>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts';
import { ArrowLeft, Sparkles } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'https://url-shortener-production-9379.up.railway.app';

export default function AnalyticsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/stats/${code}`);
        setStats(res.data.data);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load stats';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [code]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900"
      >
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full mr-4"
        />
        <p className="text-xl text-slate-300">Loading analytics…</p>
      </motion.div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 text-slate-50">
        <motion.p 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-6 text-8xl font-black text-red-400/80"
        >
          404
        </motion.p>
        <p className="mb-8 text-xl text-red-400">{error || 'No data'}</p>
        <Link
          to="/"
          className="px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-lg font-bold shadow-2xl glass-glow transition-all duration-300 hover:shadow-purple-500/50"
        >
          ← Back to Shortener
        </Link>
      </div>
    );
  }

  const { total_clicks, unique_ips, clicks_by_date, device_breakdown, top_countries, top_referrers } = stats;
  const clickRate = unique_ips > 0 ? (total_clicks / unique_ips).toFixed(2) : 'N/A';
  const timelineData = (clicks_by_date || []).map((d) => ({ date: d.date, clicks: d.clicks }));
  const countryData = (top_countries || []).map((c) => ({ name: c.country || 'Unknown', value: c.count }));
  const deviceData = (device_breakdown || []).map((d) => ({
    rawLabel: d.device_type || 'Unknown',
    device: d.device_type?.replace(' ', '\n') || 'Unknown',
    count: Number(d.count || 0),
  }));
  const referrerData = top_referrers || [];
  const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4', '#a855f7', '#10b981'];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 overflow-hidden">
      <div className="bg-orbit absolute inset-0" />
      <ParticleSystem />

      <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-10 py-12 space-y-12">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="space-y-2">
            <motion.p 
              className="text-sm uppercase tracking-[0.3em] text-purple-300 flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              Analytics Dashboard
            </motion.p>
            <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent">
              {code?.toUpperCase()}
            </h1>
          </div>
          <Link
            to="/"
            className="group flex items-center gap-2 px-6 py-3 rounded-3xl glass-card hover:bg-slate-800/50 border border-purple-500/30 text-lg font-semibold transition-all hover:shadow-purple-500/50"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            { label: 'Total Clicks', value: total_clicks.toLocaleString(), color: 'from-indigo-500' },
            { label: 'Unique IPs', value: unique_ips.toLocaleString(), color: 'from-emerald-500' },
            { label: 'Click Rate', value: `${clickRate}x`, color: 'from-purple-500' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className={`glass-card rounded-3xl p-8 text-center shadow-2xl ${stat.color} bg-gradient-to-br`}
            >
              <motion.div 
                className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.value}
              </motion.div>
              <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 glass-card rounded-3xl p-8 shadow-2xl col-span-1"
          >
            <motion.p 
              className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg animate-pulse" />
              Clicks Over Time (Last 7 Days)
            </motion.p>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#ec4899" stopOpacity={0.9}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={13} />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="url(#lineGradient)" strokeWidth={5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 glass-card rounded-3xl p-8 shadow-2xl"
          >
            <p className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg animate-pulse" />
              Device Types
            </p>
            <div className="h-72 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData} margin={{ left: 0, right: 16, bottom: 24 }}>
                  <XAxis dataKey="device" stroke="#9ca3af" interval={0} tick={{ fontSize: 11, lineHeight: 1.1 }} />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip formatter={(value, _name, entry) => [value, entry.payload.rawLabel || 'Device']} />
                  <Bar dataKey="count" fill="#22c55e" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-3 text-sm">
              {deviceData.slice(0, 5).map((d, i) => (
                <motion.li 
                  key={d.rawLabel}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center text-slate-300 py-2 px-2 rounded-lg hover:bg-slate-900/50 transition-all"
                >
                  <span className="font-medium">{d.rawLabel}</span>
                  <span className="font-black text-2xl text-emerald-400">{d.count}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="glass-card rounded-3xl p-8 shadow-2xl">
            <p className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-sky-400 shadow-lg animate-pulse" />
              Top Countries
            </p>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData.slice(0, 7)}
                    dataKey="value"
                    nameKey="name"
                    cx="55%"
                    cy="50%"
                    outerRadius={110}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {countryData.slice(0, 7).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="glass-card rounded-3xl p-8 shadow-2xl overflow-hidden">
            <p className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-purple-400 shadow-lg animate-pulse" />
              Top Referrers
            </p>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/50 text-slate-400 sticky top-0 bg-slate-950/50 backdrop-blur-sm">
                    <th className="py-4 pr-6 text-left font-bold">Referrer</th>
                    <th className="py-4 text-right font-bold">Clicks</th>
                  </tr>
                </thead>
                <tbody>
                  {referrerData.slice(0, 10).map((r, i) => (
                    <motion.tr 
                      key={r.referrer || 'direct'}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-all duration-200"
                    >
                      <td className="py-4 pr-6 max-w-xs truncate font-medium text-slate-200">
                        {r.referrer || 'Direct / None'}
                      </td>
                      <td className="py-4 text-right font-black text-2xl text-purple-400">{r.count}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Reuse ParticleSystem from App.jsx
function ParticleSystem() {
  return (
    <>
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30"
          style={{
            left: `${(i * 14.2) % 100}%`,
            top: `${(i * 8.1) % 100}%`,
          }}
          animate={{
            x: [0, 80, 0, -80],
            y: [0, -40, 40, 0],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.2, 0.9, 0.2],
          }}
          transition={{
            duration: 18 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
