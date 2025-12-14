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
//         <p>Loading analytics...</p>
//       </div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
//         <p className="mb-4 text-red-400">{error || 'No data'}</p>
//         <Link
//           to="/"
//           className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold"
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
//       device: rawLabel.replace(' ', '\n'), // allow 2-line labels
//       count: Number(d.count || 0),
//     };
//   });

//   const referrerData = top_referrers || [];

//   const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4'];

//   return (
//     <div className="min-h-screen w-full bg-slate-950 text-slate-50">
//       <div className="mx-auto max-w-7xl px-4 lg:px-10 py-8 space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-xs uppercase tracking-widest text-slate-400">
//               Analytics dashboard
//             </p>
//             <h1 className="mt-1 text-3xl font-bold">
//               Analytics for <span className="text-indigo-400">{code}</span>
//             </h1>
//           </div>
//           <Link
//             to="/"
//             className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm"
//           >
//             Back
//           </Link>
//         </div>

//         {/* Overview cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="text-xs text-slate-400">Total Clicks</p>
//             <p className="mt-2 text-3xl font-semibold">{total_clicks}</p>
//           </div>
//           <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="text-xs text-slate-400">Unique IPs</p>
//             <p className="mt-2 text-3xl font-semibold">{unique_ips}</p>
//           </div>
//           <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="text-xs text-slate-400">Click Rate</p>
//             <p className="mt-2 text-3xl font-semibold">{clickRate}</p>
//           </div>
//         </div>

//         {/* Main charts row */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* Line chart: clicks over time */}
//           <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="mb-3 text-sm text-slate-300">
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
//           <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="mb-3 text-sm text-slate-300">Device Types</p>
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
//                         radius={[4, 4, 0, 0]}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>

//                 {/* Explicit list of all devices + counts */}
//                 <ul className="mt-3 space-y-1 text-xs text-slate-400">
//                   {deviceData.map((d) => (
//                     <li key={d.rawLabel}>
//                       {d.rawLabel}:{' '}
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
//           <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="mb-3 text-sm text-slate-300">Top 5 Countries</p>
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
//           <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
//             <p className="mb-3 text-sm text-slate-300">Top Referrers</p>
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
//                         className="border-b border-slate-900"
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





// src/AnalyticsPage.jsx
import React, { useEffect, useState } from 'react';
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
  Legend,
} from 'recharts';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://url-shortener-production-9379.up.railway.app';

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">Loading analytics…</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
        <p className="mb-4 text-red-400">{error || 'No data'}</p>
        <Link
          to="/"
          className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold shadow-md shadow-indigo-500/40"
        >
          Back to Shortener
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

  // Prepare device data: keep raw label + wrapped label for axis
  const deviceData = (device_breakdown || []).map((d) => {
    const rawLabel = d.device_type || 'Unknown';
    return {
      rawLabel,
      device: rawLabel.replace(' ', '\n'),
      count: Number(d.count || 0),
    };
  });

  const referrerData = top_referrers || [];

  const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4'];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
      {/* reuse animated blobs */}
      <div className="bg-orbit" />

      <div className="mx-auto max-w-7xl px-4 lg:px-10 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-up">
          <div className="space-y-1">
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">
              Analytics dashboard
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Analytics for{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                {code}
              </span>
            </h1>
          </div>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/70 hover:bg-slate-800 text-xs sm:text-sm flex items-center gap-1 shadow-md shadow-black/40 transition"
          >
            ← Back
          </Link>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up">
          <StatCard label="Total Clicks" value={total_clicks} accent="indigo" />
          <StatCard label="Unique IPs" value={unique_ips} accent="sky" />
          <StatCard label="Click Rate" value={clickRate} accent="emerald" />
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Line chart: clicks over time */}
          <div className="lg:col-span-8 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
            <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Clicks over time (last 7 days)
            </p>
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Device bar chart + list */}
          <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
            <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Device Types
            </p>
            {deviceData.length === 0 ? (
              <p className="text-sm text-slate-400">No device data yet</p>
            ) : (
              <>
                <div className="w-full h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deviceData}
                      margin={{ left: 0, right: 16, bottom: 24 }}
                    >
                      <XAxis
                        dataKey="device"
                        stroke="#9ca3af"
                        interval={0}
                        tick={{ fontSize: 11, lineHeight: 1.1 }}
                      />
                      <YAxis allowDecimals={false} stroke="#9ca3af" />
                      <Tooltip
                        formatter={(value, _name, entry) => [
                          value,
                          entry.payload.rawLabel || 'Device',
                        ]}
                      />
                      <Bar
                        dataKey="count"
                        fill="#22c55e"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <ul className="mt-3 space-y-1 text-xs text-slate-400">
                  {deviceData.map((d) => (
                    <li key={d.rawLabel} className="flex justify-between">
                      <span>{d.rawLabel}</span>
                      <span className="font-semibold text-slate-100">
                        {d.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Second row: countries + referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* Top countries pie chart */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
            <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Top 5 Countries
            </p>
            {countryData.length === 0 ? (
              <p className="text-sm text-slate-400">No country data yet</p>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {countryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top referrers table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up">
            <p className="mb-3 text-sm text-slate-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 animate-pulse" />
              Top Referrers
            </p>
            {referrerData.length === 0 ? (
              <p className="text-sm text-slate-400">No referrer data yet</p>
            ) : (
              <div className="overflow-x-auto max-h-72">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-800">
                      <th className="py-2 pr-4">Referrer</th>
                      <th className="py-2 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrerData.map((r) => (
                      <tr
                        key={r.referrer || 'direct'}
                        className="border-b border-slate-900/80"
                      >
                        <td className="py-2 pr-4 break-all">
                          {r.referrer || 'Direct / None'}
                        </td>
                        <td className="py-2 text-right font-medium">
                          {r.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentMap = {
    indigo: 'from-indigo-500/40 to-sky-500/10',
    sky: 'from-sky-500/40 to-emerald-500/10',
    emerald: 'from-emerald-500/50 to-sky-500/10',
  };

  return (
    <div className="relative bg-slate-900/70 border border-slate-800 rounded-2xl p-4 shadow-lg shadow-black/40 backdrop-blur-xl overflow-hidden">
      <div
        className={`pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${
          accentMap[accent] || accentMap.indigo
        } opacity-60 blur-2xl`}
      />
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl sm:text-3xl font-semibold">{value}</p>
    </div>
  );
}
