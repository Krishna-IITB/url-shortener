
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

// const API_BASE = 'http://localhost:3000';

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
//         setError(err.response?.data?.error || 'Failed to load stats');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStats();
//   }, [code]);







//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
//         <p>Loading analytics...</p>
//       </div>
//     );
//   }

//   if (error || !stats) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-50">
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

//   const deviceData = (device_breakdown || []).map((d) => ({
//     device: d.device_type || 'Unknown',
//     count: d.count,
//   }));

//   const referrerData = top_referrers || [];

//   const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4'];

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-50">
//       <div className="max-w-6xl mx-auto px-4 py-6">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h1 className="text-2xl font-bold">Analytics for {code}</h1>
//           <Link
//             to="/"
//             className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm"
//           >
//             Back
//           </Link>
//         </div>

//         {/* Overview cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="text-xs text-slate-400">Total Clicks</p>
//             <p className="text-2xl font-semibold mt-2">{total_clicks}</p>
//           </div>
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="text-xs text-slate-400">Unique IPs</p>
//             <p className="text-2xl font-semibold mt-2">{unique_ips}</p>
//           </div>
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="text-xs text-slate-400">Click Rate</p>
//             <p className="text-2xl font-semibold mt-2">{clickRate}</p>
//           </div>
//         </div>

//         {/* Charts grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
//           {/* Line chart: clicks over time */}
//           <div className="lg:col-span-2 bg-slate-800 rounded-lg p-4">
//             <p className="mb-3 text-sm text-slate-300">
//               Clicks over time (last 7 days)
//             </p>
//             <div className="w-full h-64">
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

//           {/* Device bar chart */}
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="mb-3 text-sm text-slate-300">Device Types</p>
//             <div className="w-full h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={deviceData}>
//                   <XAxis dataKey="device" stroke="#9ca3af" />
//                   <YAxis allowDecimals={false} stroke="#9ca3af" />
//                   <Tooltip />
//                   <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>

//         {/* Second row: countries + referrers */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Top countries pie chart */}
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="mb-3 text-sm text-slate-300">Top 5 Countries</p>
//             {countryData.length === 0 ? (
//               <p className="text-sm text-slate-400">No country data yet</p>
//             ) : (
//               <div className="w-full h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <PieChart>
//                     <Pie
//                       data={countryData}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={80}
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
//           <div className="bg-slate-800 rounded-lg p-4">
//             <p className="mb-3 text-sm text-slate-300">Top Referrers</p>
//             {referrerData.length === 0 ? (
//               <p className="text-sm text-slate-400">No referrer data yet</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full text-sm">
//                   <thead>
//                     <tr className="text-left text-slate-400 border-b border-slate-700">
//                       <th className="py-2 pr-4">Referrer</th>
//                       <th className="py-2 text-right">Clicks</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {referrerData.map((r) => (
//                       <tr key={r.referrer || 'direct'} className="border-b border-slate-800">
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

// const API_BASE = 'http://localhost:3000';
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
        toast.error(msg);      // ← show toast on error
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [code]);

if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-50">
        <p className="mb-4 text-red-400">{error || 'No data'}</p>
        <Link
          to="/"
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm font-semibold"
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

  const deviceData = (device_breakdown || []).map((d) => ({
    device: d.device_type || 'Unknown',
    count: d.count,
  }));

  const referrerData = top_referrers || [];

  const COLORS = ['#6366f1', '#22c55e', '#f97316', '#e11d48', '#06b6d4'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Analytics for {code}</h1>
          <Link
            to="/"
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-sm"
          >
            Back
          </Link>
        </div>

        {/* Overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400">Total Clicks</p>
            <p className="text-2xl font-semibold mt-2">{total_clicks}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400">Unique IPs</p>
            <p className="text-2xl font-semibold mt-2">{unique_ips}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400">Click Rate</p>
            <p className="text-2xl font-semibold mt-2">{clickRate}</p>
          </div>
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Line chart: clicks over time */}
          <div className="lg:col-span-2 bg-slate-800 rounded-lg p-4">
            <p className="mb-3 text-sm text-slate-300">
              Clicks over time (last 7 days)
            </p>
            <div className="w-full h-64">
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

          {/* Device bar chart */}
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="mb-3 text-sm text-slate-300">Device Types</p>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deviceData}>
                  <XAxis dataKey="device" stroke="#9ca3af" />
                  <YAxis allowDecimals={false} stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Second row: countries + referrers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top countries pie chart */}
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="mb-3 text-sm text-slate-300">Top 5 Countries</p>
            {countryData.length === 0 ? (
              <p className="text-sm text-slate-400">No country data yet</p>
            ) : (
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={countryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
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
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="mb-3 text-sm text-slate-300">Top Referrers</p>
            {referrerData.length === 0 ? (
              <p className="text-sm text-slate-400">No referrer data yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-400 border-b border-slate-700">
                      <th className="py-2 pr-4">Referrer</th>
                      <th className="py-2 text-right">Clicks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrerData.map((r) => (
                      <tr key={r.referrer || 'direct'} className="border-b border-slate-800">
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
