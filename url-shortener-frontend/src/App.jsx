
// // src/App.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const API_BASE =
//   import.meta.env.VITE_API_URL ||
//   'https://url-shortener-production-9379.up.railway.app';

// export default function App() {
//   const [url, setUrl] = useState('');
//   const [shortData, setShortData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [copyLabel, setCopyLabel] = useState('Copy');
//   const [dark, setDark] = useState(true);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', dark);
//   }, [dark]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setShortData(null);
//     setCopyLabel('Copy');

//     if (!url.trim()) {
//       const msg = 'Please enter a URL';
//       setError(msg);
//       toast.error(msg);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/api/shorten`, { url });
//       setShortData(res.data.data);
//       toast.success('Short URL created!');
//     } catch (err) {
//       const msg = err.response?.data?.error || 'Failed to shorten URL';
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async () => {
//     if (!shortData?.short_url) return;
//     try {
//       await navigator.clipboard.writeText(shortData.short_url);
//       setCopyLabel('Copied!');
//       toast.success('Link copied to clipboard');
//       setTimeout(() => setCopyLabel('Copy'), 1500);
//     } catch {
//       const msg = 'Failed to copy link';
//       setError(msg);
//       toast.error(msg);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-slate-950 text-slate-50">
//       <div className="mx-auto max-w-6xl xl:max-w-7xl px-4 sm:px-6 lg:px-10 py-8 sm:py-10 lg:py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-stretch">
//           {/* Left: hero + form */}
//           <div className="lg:col-span-6 space-y-6 sm:space-y-8">
//             <header className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
//                   URL Shortener
//                 </h1>
//                 <button
//                   onClick={() => setDark((d) => !d)}
//                   className="ml-auto text-xs px-2 py-1 rounded border border-slate-700 bg-slate-900 hover:bg-slate-800"
//                 >
//                   {dark ? 'Light mode' : 'Dark mode'}
//                 </button>
//               </div>
//               <p className="text-sm text-slate-400 max-w-md">
//                 Create clean, trackable short links with real-time analytics,
//                 device breakdowns, and QR codes in seconds.
//               </p>
//               <ul className="mt-1 text-xs text-slate-400 space-y-1 list-disc list-inside">
//                 <li>Custom aliases and link expiry.</li>
//                 <li>Full analytics dashboard for every link.</li>
//                 <li>Instant QR code generation.</li>
//               </ul>
//             </header>

//             <form
//               onSubmit={handleSubmit}
//               className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3 shadow-sm"
//             >
//               <label className="block text-xs font-medium text-slate-400 mb-1">
//                 Destination URL
//               </label>
//               <input
//                 type="url"
//                 placeholder="https://example.com"
//                 className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-900 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//               />

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-2.5 rounded bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-sm font-semibold text-white transition"
//               >
//                 {loading ? 'Shortening...' : 'Shorten URL'}
//               </button>

//               {error && (
//                 <p className="text-sm text-red-400 pt-1">{error}</p>
//               )}
//             </form>

//             {shortData && (
//               <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
//                 <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
//                   <span className="text-sm text-slate-300">Short URL:</span>
//                   <a
//                     href={shortData.short_url}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="text-sm text-indigo-400 underline break-all"
//                   >
//                     {shortData.short_url}
//                   </a>
//                   <button
//                     onClick={handleCopy}
//                     className="sm:ml-auto inline-flex justify-center px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-700"
//                   >
//                     {copyLabel}
//                   </button>
//                 </div>

//                 <Link
//                   to={`/analytics/${shortData.short_code}`}
//                   className="inline-block mt-1 text-xs text-indigo-400 hover:text-indigo-300 underline transition"
//                 >
//                   📊 View analytics
//                 </Link>

//                 {shortData.short_code && (
//                   <QrPreview shortCode={shortData.short_code} />
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Right: gradient panel */}
//           <div className="lg:col-span-6">
//             <div className="relative h-56 sm:h-64 md:h-72 lg:h-full rounded-2xl bg-gradient-to-br from-indigo-500/25 via-sky-500/20 to-emerald-500/25 border border-slate-800 flex items-center justify-center">
//               <div className="max-w-sm text-center space-y-4 px-6 py-6 sm:py-8">
//                 <p className="text-xs uppercase tracking-widest text-slate-300">
//                   Realtime insights
//                 </p>
//                 <p className="text-base sm:text-lg font-semibold">
//                   Track every click by country, device, and referrer with a
//                   clean, interactive dashboard.
//                 </p>
//                 <p className="text-xs text-slate-300">
//                   Generate a short link now and open the analytics view to see
//                   your traffic in action across devices.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function QrPreview({ shortCode }) {
//   const [qrUrl, setQrUrl] = React.useState('');
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState('');

//   React.useEffect(() => {
//     let cancelled = false;

//     const fetchQr = async () => {
//       try {
//         setLoading(true);
//         setError('');
//         const res = await axios.get(`${API_BASE}/api/qr/${shortCode}`);
//         if (!cancelled) setQrUrl(res.data.qr_data_url);
//       } catch (err) {
//         if (!cancelled) setError('Failed to load QR code');
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     };

//     fetchQr();
//     return () => {
//       cancelled = true;
//     };
//   }, [shortCode]);

//   if (loading) {
//     return <p className="text-sm text-slate-500">Loading QR code...</p>;
//   }
//   if (error) {
//     return <p className="text-sm text-red-400">{error}</p>;
//   }
//   if (!qrUrl) return null;

//   return (
//     <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//       <span className="text-sm text-slate-300">QR Code:</span>
//       <img
//         src={qrUrl}
//         alt="QR code"
//         className="w-28 h-28 sm:w-32 sm:h-32 border border-slate-700 rounded bg-white"
//       />
//     </div>
//   );
// }


// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE =
  import.meta.env.VITE_API_URL ||
  'https://url-shortener-production-9379.up.railway.app';

export default function App() {
  const [url, setUrl] = useState('');
  const [shortData, setShortData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortData(null);
    setCopyLabel('Copy');

    if (!url.trim()) {
      const msg = 'Please enter a URL';
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/shorten`, { url });
      setShortData(res.data.data);
      toast.success('Short URL created!');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to shorten URL';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortData?.short_url) return;
    try {
      await navigator.clipboard.writeText(shortData.short_url);
      setCopyLabel('Copied!');
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopyLabel('Copy'), 1500);
    } catch {
      const msg = 'Failed to copy link';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-50">
      {/* animated gradient blobs */}
      <div className="bg-orbit" />

      {/* wider container, more padding */}
      <div className="mx-auto max-w-[120rem] px-6 lg:px-12 py-10 lg:py-16">
        {/* top bar */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/40 animate-pulse-soft" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Quantum Links
              </span>
              <span className="text-[11px] text-slate-500">
                Smart URLs. Live analytics.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDark((d) => !d)}
              className="text-xs px-3 py-1.5 rounded-full border border-slate-700/70 bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-sm transition"
            >
              {dark ? 'Light mode' : 'Dark mode'}
            </button>
            {shortData?.short_code && (
              <Link
                to={`/analytics/${shortData.short_code}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-indigo-400 transition"
              >
                <span>View last analytics</span>
                <span>↗</span>
              </Link>
            )}
          </div>
        </header>

        {/* two big columns filling the width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16 items-stretch">
          {/* Left: hero + form */}
          <div className="flex flex-col justify-center space-y-9 animate-fade-up">
            <div className="space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300 shadow-sm shadow-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Realtime link intelligence
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight">
                Turn long URLs into
                <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
                  {' '}
                  smart links
                </span>
                .
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl">
                Create beautiful short links with built‑in analytics, device
                breakdowns, and QR codes. Designed for campaigns, portfolios,
                and experiments.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="relative bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl shadow-black/40 backdrop-blur-xl animate-fade-up"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-sky-500/5 to-emerald-400/10 opacity-60 pointer-events-none" />
              <div className="relative space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Destination URL
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/your-long-link"
                    className="w-full px-3 py-2 rounded-lg border border-slate-700/80 bg-slate-950/60 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-indigo-400/60 transition"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center whitespace-nowrap px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 disabled:from-slate-700 disabled:to-slate-800 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {loading ? 'Shortening…' : 'Shorten URL'}
                  </button>
                </div>
                {error && (
                  <p className="text-xs sm:text-sm text-red-400 pt-1">{error}</p>
                )}
              </div>

              <div className="relative mt-3 flex flex-wrap gap-2 text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 px-2 py-0.5">
                  ⚡ UTM‑safe redirects
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 px-2 py-0.5">
                  🛰 Live analytics
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-700/70 px-2 py-0.5">
                  🧩 QR codes
                </span>
              </div>
            </form>

            {shortData && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-lg shadow-black/40 backdrop-blur-xl animate-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-xs uppercase tracking-wide text-slate-400">
                    Short URL
                  </span>
                  <a
                    href={shortData.short_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-300 underline break-all hover:text-indigo-200 transition"
                  >
                    {shortData.short_url}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="sm:ml-auto inline-flex justify-center items-center gap-1 px-2.5 py-1 text-[11px] rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
                  >
                    {copyLabel}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <Link
                    to={`/analytics/${shortData.short_code}`}
                    className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 underline-offset-2 hover:underline transition"
                  >
                    <span>📊 View analytics</span>
                  </Link>
                  {shortData.short_code && (
                    <QrPreview shortCode={shortData.short_code} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: animated hero panel fills column */}
          <div className="flex items-center">
            <div className="relative w-full h-[380px] sm:h-[420px] md:h-[460px] lg:h-[520px] rounded-[32px] border border-slate-800/80 bg-slate-900/40 backdrop-blur-3xl overflow-hidden shadow-[0_0_140px_rgba(15,23,42,1)] animate-float-slow">
              {/* gradient glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-sky-500/15 to-emerald-500/25 opacity-80" />
              {/* orbiting dots & circles */}
              <div className="absolute inset-0">
                <div className="absolute top-10 left-8 h-2 w-2 rounded-full bg-sky-400 shadow-sky-400/60 shadow-lg animate-pulse" />
                <div className="absolute bottom-10 right-10 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-emerald-400/60 shadow-lg animate-pulse-soft" />
                <div className="absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-400/40" />
                <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-400/20" />
              </div>

              <div className="relative h-full flex items-center justify-center px-8 py-10 text-center">
                <div className="max-w-md space-y-4">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">
                    Live click telemetry
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    Watch your links light up from
                    <span className="text-indigo-200"> devices</span>,{' '}
                    <span className="text-sky-200">countries</span>, and{' '}
                    <span className="text-emerald-200">referrers</span> in
                    real‑time.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Open the analytics dashboard in another tab and start
                    clicking your short link to see the charts react instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>      
    </div>
  );
}

function QrPreview({ shortCode }) {
  const [qrUrl, setQrUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let cancelled = false;

    const fetchQr = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE}/api/qr/${shortCode}`);
        if (!cancelled) setQrUrl(res.data.qr_data_url);
      } catch (err) {
        if (!cancelled) setError('Failed to load QR code');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchQr();
    return () => {
      cancelled = true;
    };
  }, [shortCode]);

  if (loading) {
    return <p className="text-xs text-slate-500">Loading QR…</p>;
  }
  if (error) {
    return <p className="text-xs text-red-400">{error}</p>;
  }
  if (!qrUrl) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-300">QR:</span>
      <img
        src={qrUrl}
        alt="QR code"
        className="w-20 h-20 sm:w-24 sm:h-24 border border-slate-700 rounded-lg bg-white/90 shadow-md"
      />
    </div>
  );
}
