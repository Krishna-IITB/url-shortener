// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
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
// } from 'recharts';
// import { ArrowLeft, Sparkles } from 'lucide-react';

// const API_BASE =
//   import.meta.env.VITE_API_URL ||
//   'https://url-shortener-production-9379.up.railway.app';

// export default function AnalyticsPage() {
//   const { code } = useParams();
//   const [stats, setStats] = useState(null);
//   const [browserStats, setBrowserStats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingBrowsers, setLoadingBrowsers] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     async function fetchStats() {
//       try {
//         setLoading(true);
//         setLoadingBrowsers(true);
//         setError('');

//         const [statsRes, browsersRes] = await Promise.all([
//           axios.get(`${API_BASE}/api/stats/${code}`),
//           axios.get(`${API_BASE}/api/stats/${code}/browsers`),
//         ]);

//         setStats(statsRes.data.data);

//         const normalizedBrowsers = (browsersRes.data.data || []).map((row) => ({
//           browser:
//             row.browser === 'WebKit'
//               ? 'Safari / WebKit'
//               : row.browser || 'Unknown',
//           count: Number(row.count || 0),
//         }));
//         setBrowserStats(normalizedBrowsers);
//       } catch (err) {
//         const msg = err.response?.data?.error || 'Failed to load stats';
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setLoading(false);
//         setLoadingBrowsers(false);
//       }
//     }
//     fetchStats();
//   }, [code]);

//   if (loading) {
//     return (
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900"
//       >
//         <motion.div
//           animate={{ rotate: 360 }}
//           transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
//           className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full mr-4"
//         />
//         <p className="text-xl text-slate-300">Loading analytics…</p>
//       </motion.div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 text-slate-50">
//         <motion.p
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//           className="mb-6 text-8xl font-black text-red-400/80"
//         >
//           404
//         </motion.p>
//         <p className="mb-8 text-xl text-red-400">{error || 'No data'}</p>
//         <Link
//           to="/"
//           className="px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-lg font-bold shadow-2xl glass-glow transition-all duration-300 hover:shadow-purple-500/50"
//         >
//           ← Back to Shortener
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

//   // SHORT LABELS for chart, FULL LABELS in list
//   const deviceData = (device_breakdown || []).map((d) => {
//     const rawLabel = d.device_type || 'Unknown';
//     const shortLabel = rawLabel
//       .replace(/^desktop /i, 'desk ')
//       .replace(/^mobile /i, 'mob ');
//     return {
//       rawLabel,
//       device: shortLabel,
//       count: Number(d.count || 0),
//     };
//   });

//   const referrerData = top_referrers || [];

//   const COLORS = [
//     '#6366f1',
//     '#22c55e',
//     '#f97316',
//     '#e11d48',
//     '#06b6d4',
//     '#a855f7',
//     '#10b981',
//   ];

//   const totalBrowserCount = browserStats.reduce(
//     (sum, b) => sum + b.count,
//     0
//   );
//   const maxBrowserCount =
//     browserStats.length > 0
//       ? Math.max(...browserStats.map((b) => b.count))
//       : 1;

//   return (
//     <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 overflow-hidden">
//       <div className="bg-orbit absolute inset-0" />
//       <ParticleSystem />

//       <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-10 py-12 space-y-12">
//         {/* HEADER */}
//         <motion.div
//           initial={{ opacity: 0, y: 50 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between"
//         >
//           <div className="space-y-2">
//             <motion.p
//               className="text-sm uppercase tracking-[0.3em] text-purple-300 flex items-center gap-2"
//               animate={{ scale: [1, 1.05, 1] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <Sparkles className="w-4 h-4 animate-pulse" />
//               Analytics Dashboard
//             </motion.p>
//             <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent">
//               {code?.toUpperCase()}
//             </h1>
//           </div>
//           <Link
//             to="/"
//             className="group flex items-center gap-2 px-6 py-3 rounded-3xl glass-card hover:bg-slate-800/50 border border-purple-500/30 text-lg font-semibold transition-all hover:shadow-purple-500/50"
//           >
//             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
//             Back
//           </Link>
//         </motion.div>

//         {/* STAT CARDS */}
//         <motion.div
//           className="grid grid-cols-1 sm:grid-cols-3 gap-6"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ staggerChildren: 0.1 }}
//         >
//           {[
//             {
//               label: 'Total Clicks',
//               value: total_clicks.toLocaleString(),
//               color: 'from-indigo-500',
//             },
//             {
//               label: 'Unique IPs',
//               value: unique_ips.toLocaleString(),
//               color: 'from-emerald-500',
//             },
//             {
//               label: 'Click Rate',
//               value: `${clickRate}x`,
//               color: 'from-purple-500',
//             },
//           ].map((stat, i) => (
//             <motion.div
//               key={i}
//               initial={{ y: 50, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               whileHover={{ y: -10, scale: 1.05 }}
//               className={`glass-card rounded-3xl p-8 text-center shadow-2xl ${stat.color} bg-gradient-to-br`}
//             >
//               <motion.div
//                 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-3"
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 {stat.value}
//               </motion.div>
//               <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">
//                 {stat.label}
//               </p>
//             </motion.div>
//           ))}
//         </motion.div>

//         {/* LINE + DEVICE CHARTS */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <motion.div
//             initial={{ opacity: 0, x: -50 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="lg:col-span-8 glass-card rounded-3xl p-8 shadow-2xl col-span-1"
//           >
//             <motion.p
//               className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3"
//               animate={{ scale: [1, 1.02, 1] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg animate-pulse" />
//               Clicks Over Time (Last 7 Days)
//             </motion.p>
//             <div className="h-96">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={timelineData}>
//                   <defs>
//                     <linearGradient
//                       id="lineGradient"
//                       x1="0"
//                       y1="0"
//                       x2="1"
//                       y2="1"
//                     >
//                       <stop
//                         offset="0%"
//                         stopColor="#8b5cf6"
//                         stopOpacity={0.9}
//                       />
//                       <stop
//                         offset="100%"
//                         stopColor="#ec4899"
//                         stopOpacity={0.9}
//                       />
//                     </linearGradient>
//                   </defs>
//                   <XAxis dataKey="date" stroke="#9ca3af" fontSize={13} />
//                   <YAxis allowDecimals={false} stroke="#9ca3af" />
//                   <Tooltip />
//                   <Line
//                     type="monotone"
//                     dataKey="clicks"
//                     stroke="url(#lineGradient)"
//                     strokeWidth={5}
//                     dot={false}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//         {/* DEVICE TYPES – FIXED LAYOUT */}
//           <motion.div
//             initial={{ opacity: 0, x: 50 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="lg:col-span-4 glass-card rounded-3xl p-8 shadow-2xl"
//           >
//             <p className="mb-6 text-xl font-bold text-slate-200 flex items-center gap-3">
//               <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg animate-pulse" />
//               Device Types
//             </p>

//             <div className="h-64 mb-6">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={deviceData}
//                   margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
//                   barCategoryGap="30%"
//                 >
//                   <XAxis
//                     dataKey="device"
//                     stroke="#9ca3af"
//                     height={40}
//                     interval="preserveStartEnd"
//                     minTickGap={10}
//                     tick={{ fontSize: 11, fill: '#9ca3af' }}
//                   />
//                   <YAxis allowDecimals={false} stroke="#9ca3af" />
//                   <Tooltip
//                     formatter={(value, _name, entry) => [
//                       value,
//                       entry.payload.rawLabel || 'Device',
//                     ]}
//                   />
//                   <Bar
//                     dataKey="count"
//                     fill="#22c55e"
//                     radius={[10, 10, 0, 0]}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>

//             <ul className="space-y-2 text-sm">
//               {deviceData.map((d) => (
//                 <li
//                   key={d.rawLabel}
//                   className="flex justify-between items-center text-slate-300 py-1.5 px-2 rounded-lg hover:bg-slate-900/60 transition-all"
//                 >
//                   <span className="font-medium">{d.rawLabel}</span>
//                   <span className="font-black text-xl text-emerald-400">
//                     {d.count}
//                   </span>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         </div>

//         {/* COUNTRIES + REFERRERS */}
//         <motion.div
//           className="grid grid-cols-1 lg:grid-cols-2 gap-8"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//         >
//           <motion.div className="glass-card rounded-3xl p-8 shadow-2xl">
//             <p className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3">
//               <div className="w-4 h-4 rounded-full bg-sky-400 shadow-lg animate-pulse" />
//               Top Countries
//             </p>
//             <div className="h-96">
//               <ResponsiveContainer width="100%" height="100%">
//                 <PieChart>
//                   <Pie
//                     data={countryData.slice(0, 7)}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="55%"
//                     cy="50%"
//                     outerRadius={110}
//                     label={({ name, percent }) =>
//                       `${name} ${(percent * 100).toFixed(0)}%`
//                     }
//                   >
//                     {countryData.slice(0, 7).map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>
//           </motion.div>

//           <motion.div className="glass-card rounded-3xl p-8 shadow-2xl overflow-hidden">
//             <p className="mb-8 text-xl font-bold text-slate-200 flex items-center gap-3">
//               <div className="w-4 h-4 rounded-full bg-purple-400 shadow-lg animate-pulse" />
//               Top Referrers
//             </p>
//             <div className="max-h-96 overflow-y-auto">
//               <table className="w-full text-sm">
//                 <thead>
//                   <tr className="border-b border-slate-800/50 text-slate-400 sticky top-0 bg-slate-950/50 backdrop-blur-sm">
//                     <th className="py-4 pr-6 text-left font-bold">Referrer</th>
//                     <th className="py-4 text-right font-bold">Clicks</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {referrerData.slice(0, 10).map((r, i) => (
//                     <motion.tr
//                       key={r.referrer || 'direct'}
//                       initial={{ opacity: 0, x: 20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{ delay: i * 0.05 }}
//                       className="border-b border-slate-900/50 hover:bg-slate-900/30 transition-all duration-200"
//                     >
//                       <td className="py-4 pr-6 max-w-xs truncate font-medium text-slate-200">
//                         {r.referrer || 'Direct / None'}
//                       </td>
//                       <td className="py-4 text-right font-black text-2xl text-purple-400">
//                         {r.count}
//                       </td>
//                     </motion.tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>
//         </motion.div>

//         {/* BROWSERS – NEW ANIMATED PANEL */}
//         <motion.div
//           className="glass-card rounded-3xl p-8 shadow-2xl mt-4"
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//             <motion.div
//               className="flex items-center gap-3"
//               animate={{ scale: [1, 1.03, 1] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             >
//               <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 shadow-lg animate-pulse" />
//               <h2 className="text-xl font-bold text-slate-100">
//                 Browser Insights
//               </h2>
//             </motion.div>
//             {totalBrowserCount > 0 && (
//               <p className="text-xs text-slate-400">
//                 Total browser hits:{' '}
//                 <span className="font-semibold text-slate-100">
//                   {totalBrowserCount}
//                 </span>
//               </p>
//             )}
//           </div>

//           {loadingBrowsers ? (
//             <div className="flex items-center gap-3 text-sm text-slate-400">
//               <div className="w-4 h-4 border-2 border-slate-500/40 border-t-slate-100 rounded-full animate-spin" />
//               Loading browser stats…
//             </div>
//           ) : browserStats.length === 0 ? (
//             <p className="text-sm text-slate-400">No browser data yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {browserStats.map((row, idx) => {
//                 const percentage =
//                   totalBrowserCount > 0
//                     ? (row.count / totalBrowserCount) * 100
//                     : 0;

//                 return (
//                   <motion.div
//                     key={row.browser}
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="group flex items-center gap-3 text-sm text-slate-200"
//                   >
//                     <div className="w-40 truncate font-medium">
//                       {row.browser}
//                     </div>

//                     <div className="flex-1 h-2.5 rounded-full bg-slate-900/80 overflow-hidden relative">
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{
//                           width: `${Math.min(
//                             100,
//                             (row.count / maxBrowserCount) * 100
//                           ).toFixed(1)}%`,
//                         }}
//                         transition={{ duration: 0.6, delay: idx * 0.05 }}
//                         className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 shadow-[0_0_18px_rgba(56,189,248,0.5)]"
//                       />
//                     </div>

//                     <div className="w-16 text-right">
//                       <p className="text-xs text-slate-400">
//                         {percentage.toFixed(1)}%
//                       </p>
//                       <p className="text-sm font-semibold text-slate-100">
//                         {row.count}
//                       </p>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function ParticleSystem() {
//   return (
//     <>
//       {[...Array(25)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-30"
//           style={{
//             left: `${(i * 14.2) % 100}%`,
//             top: `${(i * 8.1) % 100}%`,
//           }}
//           animate={{
//             x: [0, 80, 0, -80],
//             y: [0, -40, 40, 0],
//             scale: [0.5, 1.5, 0.5],
//             opacity: [0.2, 0.9, 0.2],
//           }}
//           transition={{
//             duration: 18 + i * 0.4,
//             repeat: Infinity,
//             ease: 'easeInOut',
//           }}
//         />
//       ))}
//     </>
//   );
// }















import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { ArrowLeft, Sparkles } from 'lucide-react';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://url-shortener-production-9379.up.railway.app';

export default function AnalyticsPage() {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [browserStats, setBrowserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBrowsers, setLoadingBrowsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setLoadingBrowsers(true);
        setError('');

        const [statsRes, browsersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/stats/${code}`),
          axios.get(`${API_BASE}/api/stats/${code}/browsers`),
        ]);

        setStats(statsRes.data.data);

        const normalizedBrowsers = (browsersRes.data.data || []).map(
          (row) => ({
            browser:
              row.browser === 'WebKit'
                ? 'Safari / WebKit'
                : row.browser || 'Unknown',
            count: Number(row.count || 0),
          }),
        );
        setBrowserStats(normalizedBrowsers);
      } catch (err) {
        const msg = err.response?.data?.error || 'Failed to load stats';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
        setLoadingBrowsers(false);
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
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
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

  const {
    total_clicks,
    unique_ips,
    clicks_by_date,
    device_breakdown,
    top_countries,
    top_referrers,
  } = stats;

  const clickRate =
    unique_ips > 0 ? (total_clicks / unique_ips).toFixed(2) : 'N/A';

  const timelineData = (clicks_by_date || []).map((d) => ({
    date: d.date,
    clicks: d.clicks,
  }));

  const countryData = (top_countries || []).map((c) => ({
    name: c.country || 'Unknown',
    value: c.count,
  }));

  // short labels on axis, full labels in list
  const deviceData = (device_breakdown || []).map((d) => {
    const rawLabel = d.device_type || 'Unknown';
    const shortLabel = rawLabel
      .replace(/^desktop /i, 'desk ')
      .replace(/^mobile /i, 'mob ');
    return {
      rawLabel,
      device: shortLabel,
      count: Number(d.count || 0),
    };
  });

  const referrerData = top_referrers || [];

  const COLORS = [
    '#6366f1',
    '#22c55e',
    '#f97316',
    '#e11d48',
    '#06b6d4',
    '#a855f7',
    '#10b981',
  ];

  const totalBrowserCount = browserStats.reduce(
    (sum, b) => sum + b.count,
    0,
  );
  const maxBrowserCount =
    browserStats.length > 0
      ? Math.max(...browserStats.map((b) => b.count))
      : 1;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 overflow-hidden">
      <div className="bg-orbit absolute inset-0" />
      <ParticleSystem />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10 lg:py-12 space-y-8 sm:space-y-10 lg:space-y-12">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between"
        >
          <div className="space-y-2">
            <motion.p
              className="text-xs sm:text-sm uppercase tracking-[0.3em] text-purple-300 flex items-center gap-2"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
              Analytics Dashboard
            </motion.p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-400 via-white to-emerald-400 bg-clip-text text-transparent">
              {code?.toUpperCase()}
            </h1>
          </div>
          <Link
            to="/"
            className="group flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-3xl glass-card hover:bg-slate-800/50 border border-purple-500/30 text-sm sm:text-lg font-semibold transition-all hover:shadow-purple-500/50 self-stretch sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
            Back
          </Link>
        </motion.div>

        {/* STAT CARDS */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {[
            {
              label: 'Total Clicks',
              value: total_clicks.toLocaleString(),
              color: 'from-indigo-500',
            },
            {
              label: 'Unique IPs',
              value: unique_ips.toLocaleString(),
              color: 'from-emerald-500',
            },
            {
              label: 'Click Rate',
              value: `${clickRate}x`,
              color: 'from-purple-500',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -8, scale: 1.04 }}
              className={`glass-card rounded-3xl p-5 sm:p-6 lg:p-8 text-center shadow-2xl ${stat.color} bg-gradient-to-br`}
            >
              <motion.div
                className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2 sm:mb-3"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {stat.value}
              </motion.div>
              <p className="text-slate-400 text-xs sm:text-sm uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* LINE + DEVICE CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 glass-card rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl col-span-1"
          >
            <motion.p
              className="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-lg font-bold text-slate-200 flex items-center gap-3"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg animate-pulse" />
              Clicks Over Time (Last 7 Days)
            </motion.p>
            <div className="h-[220px] sm:h-[260px] md:h-[320px] lg:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <defs>
                    <linearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor="#ec4899"
                        stopOpacity={0.9}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={11}
                    tickMargin={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#9ca3af"
                    width={32}
                    tickMargin={4}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="url(#lineGradient)"
                    strokeWidth={4}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* DEVICE TYPES */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 glass-card rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl"
          >
            <p className="mb-4 sm:mb-6 text-sm sm:text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-emerald-400 shadow-lg animate-pulse" />
              Device Types
            </p>
            <div className="h-[200px] sm:h-[230px] md:h-[260px] lg:h-[280px] mb-4 sm:mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={deviceData}
                  margin={{ top: 10, right: 16, left: 0, bottom: 40 }}
                  barCategoryGap="30%"
                >
                  <XAxis
                    dataKey="device"
                    stroke="#9ca3af"
                    height={40}
                    interval="preserveStartEnd"
                    minTickGap={10}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    stroke="#9ca3af"
                    width={30}
                  />
                  <Tooltip
                    formatter={(value, _name, entry) => [
                      value,
                      entry.payload.rawLabel || 'Device',
                    ]}
                  />
                  <Bar
                    dataKey="count"
                    fill="#22c55e"
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              {deviceData.map((d) => (
                <li
                  key={d.rawLabel}
                  className="flex justify-between items-center text-slate-300 py-1.5 px-2 rounded-lg hover:bg-slate-900/60 transition-all"
                >
                  <span className="font-medium">{d.rawLabel}</span>
                  <span className="font-black text-base sm:text-xl text-emerald-400">
                    {d.count}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* COUNTRIES + REFERRERS */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="glass-card rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl">
            <p className="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-sky-400 shadow-lg animate-pulse" />
              Top Countries
            </p>
            <div className="h-[240px] sm:h-[280px] md:h-[320px] lg:h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={countryData.slice(0, 7)}
                    dataKey="value"
                    nameKey="name"
                    cx="55%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {countryData.slice(0, 7).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div className="glass-card rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl overflow-hidden">
            <p className="mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-xl font-bold text-slate-200 flex items-center gap-3">
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-purple-400 shadow-lg animate-pulse" />
              Top Referrers
            </p>
            <div className="max-h-72 sm:max-h-80 overflow-y-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-800/50 text-slate-400 sticky top-0 bg-slate-950/50 backdrop-blur-sm">
                    <th className="py-3 sm:py-4 pr-4 sm:pr-6 text-left font-bold">
                      Referrer
                    </th>
                    <th className="py-3 sm:py-4 text-right font-bold">
                      Clicks
                    </th>
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
                      <td className="py-3 sm:py-4 pr-4 sm:pr-6 max-w-[10rem] sm:max-w-xs truncate font-medium text-slate-200">
                        {r.referrer || 'Direct / None'}
                      </td>
                      <td className="py-3 sm:py-4 text-right font-black text-lg sm:text-2xl text-purple-400">
                        {r.count}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>

        {/* BROWSERS */}
        <motion.div
          className="glass-card rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl mt-2 sm:mt-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <motion.div
              className="flex items-center gap-3"
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-400 to-sky-400 shadow-lg animate-pulse" />
              <h2 className="text-sm sm:text-xl font-bold text-slate-100">
                Browser Insights
              </h2>
            </motion.div>
            {totalBrowserCount > 0 && (
              <p className="text-[11px] sm:text-xs text-slate-400">
                Total browser hits:{' '}
                <span className="font-semibold text-slate-100">
                  {totalBrowserCount}
                </span>
              </p>
            )}
          </div>

          {loadingBrowsers ? (
            <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
              <div className="w-4 h-4 border-2 border-slate-500/40 border-t-slate-100 rounded-full animate-spin" />
              Loading browser stats…
            </div>
          ) : browserStats.length === 0 ? (
            <p className="text-xs sm:text-sm text-slate-400">
              No browser data yet.
            </p>
          ) : (
            <div className="space-y-3">
              {browserStats.map((row, idx) => {
                const percentage =
                  totalBrowserCount > 0
                    ? (row.count / totalBrowserCount) * 100
                    : 0;

                return (
                  <motion.div
                    key={row.browser}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group flex items-center gap-3 text-xs sm:text-sm text-slate-200"
                  >
                    <div className="w-32 sm:w-40 truncate font-medium">
                      {row.browser}
                    </div>

                    <div className="flex-1 h-2 sm:h-2.5 rounded-full bg-slate-900/80 overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            100,
                            (row.count / maxBrowserCount) * 100,
                          ).toFixed(1)}%`,
                        }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 shadow-[0_0_18px_rgba(56,189,248,0.5)]"
                      />
                    </div>

                    <div className="w-14 sm:w-16 text-right">
                      <p className="text-[10px] sm:text-xs text-slate-400">
                        {percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-slate-100">
                        {row.count}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

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
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}
