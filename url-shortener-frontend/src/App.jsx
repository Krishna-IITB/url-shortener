// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Sparkles, Copy, ExternalLink } from 'lucide-react';
// import clsx from 'clsx';

// const API_BASE = import.meta.env.VITE_API_URL || 'https://url-shortener-production-9379.up.railway.app';

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
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900">
//       <ParticleSystem />
//       <div className="bg-orbit absolute inset-0" />

//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-10 lg:py-16"
//       >
//         <motion.header 
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           className="mb-10 flex items-center justify-between"
//         >
//           <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
//             <motion.div 
//               className="h-9 w-9 rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg glass-glow animate-pulse-soft"
//               animate={{ rotate: [0, 360] }}
//               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//             />
//             <div className="flex flex-col">
//               <span className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
//                 Quantum Links
//               </span>
//               <span className="text-[11px] text-slate-500">
//                 Smart URLs. Live analytics.
//               </span>
//             </div>
//           </motion.div>
          
//           <div className="flex items-center gap-3">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setDark(d => !d)}
//               className="text-xs px-3 py-1.5 rounded-full border border-slate-700/70 glass-card hover:bg-slate-800/90 transition-all"
//             >
//               {dark ? 'Light mode' : 'Dark mode'}
//             </motion.button>
//             {shortData?.short_code && (
//               <Link
//                 to={`/analytics/${shortData.short_code}`}
//                 className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-indigo-400 transition-all hover:scale-105"
//               >
//                 <span>View Analytics</span>
//                 <ExternalLink className="w-3 h-3" />
//               </Link>
//             )}
//           </div>
//         </motion.header>

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
//           <motion.div className="lg:col-span-6 space-y-9">
//             <motion.div 
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               className="space-y-4"
//             >
//               <motion.div 
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 glass-card px-3 py-1 text-[11px] font-medium text-emerald-300"
//               >
//                 <motion.span 
//                   className="h-1.5 w-1.5 rounded-full bg-emerald-400"
//                   animate={{ scale: [1, 1.5, 1] }}
//                   transition={{ duration: 1.5, repeat: Infinity }}
//                 />
//                 Realtime link intelligence
//               </motion.div>
              
//               <motion.h1 
//                 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-white via-indigo-400 to-emerald-300 bg-clip-text text-transparent leading-tight"
//                 animate={{ y: [0, -10, 0] }}
//                 transition={{ duration: 4, repeat: Infinity }}
//               >
//                 Turn long URLs into{' '}
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
//                   smart links
//                 </span>
//               </motion.h1>
//             </motion.div>

//             <motion.form
//               onSubmit={handleSubmit}
//               initial={{ opacity: 0, y: 50 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="relative glass-card rounded-3xl p-6 sm:p-8 shadow-2xl animate-float-slow"
//             >
//               <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-400/10" />
//               <div className="relative space-y-4">
//                 <label className="block text-sm font-semibold text-slate-300">Destination URL</label>
//                 <div className="flex flex-col sm:flex-row gap-3">
//                   <motion.input
//                     type="url"
//                     placeholder="https://example.com/your-long-link"
//                     className="flex-1 px-5 py-4 rounded-2xl border border-white/20 bg-white/5 text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 transition-all duration-300 glass-card"
//                     value={url}
//                     onChange={(e) => setUrl(e.target.value)}
//                     whileFocus={{ scale: 1.02 }}
//                   />
//                   <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.98 }}
//                     type="submit"
//                     disabled={loading}
//                     className="whitespace-nowrap px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white font-bold shadow-2xl hover:shadow-purple-500/50 glass-glow transition-all duration-300"
//                   >
//                     {loading ? (
//                       <span className="flex items-center gap-2">
//                         <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                         Shortening…
//                       </span>
//                     ) : (
//                       '🚀 Shorten URL'
//                     )}
//                   </motion.button>
//                 </div>
//                 {error && (
//                   <motion.p 
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="text-sm text-red-400 pt-2"
//                   >
//                     {error}
//                   </motion.p>
//                 )}
//               </div>

//               <div className="flex flex-wrap gap-2 pt-4 text-xs text-slate-400">
//                 {[
//                   { icon: '⚡', label: 'UTM‑safe redirects' },
//                   { icon: '🛰', label: 'Live analytics' },
//                   { icon: '🧩', label: 'QR codes' }
//                 ].map((feat, i) => (
//                   <motion.span
//                     key={i}
//                     initial={{ opacity: 0, x: -20 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     transition={{ delay: 0.5 + i * 0.1 }}
//                     className="inline-flex items-center gap-1 rounded-full border border-slate-700/50 px-3 py-1 glass-card"
//                   >
//                     {feat.icon} {feat.label}
//                   </motion.span>
//                 ))}
//               </div>
//             </motion.form>

//             <AnimatePresence>
//               {shortData && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 50, scale: 0.95 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: 50, scale: 0.95 }}
//                   className="glass-card rounded-3xl p-6 sm:p-8 shadow-2xl animate-float-fast"
//                 >
//                   <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
//                     <span className="text-xs uppercase tracking-wider text-slate-400">Short URL</span>
//                     <a
//                       href={shortData.short_url}
//                       target="_blank"
//                       rel="noreferrer"
//                       className="flex-1 text-lg font-semibold text-indigo-300 hover:text-indigo-200 underline decoration-2 break-all transition-all"
//                     >
//                       {shortData.short_url}
//                     </a>
//                     <motion.button
//                       onClick={handleCopy}
//                       whileHover={{ scale: 1.1 }}
//                       whileTap={{ scale: 0.95 }}
//                       className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 hover:from-slate-600 hover:to-slate-700 text-sm font-medium transition-all shadow-lg"
//                     >
//                       <Copy className="w-4 h-4" />
//                       {copyLabel}
//                     </motion.button>
//                   </div>
                  
//                   <div className="flex flex-wrap items-center gap-4">
//                     <Link
//                       to={`/analytics/${shortData.short_code}`}
//                       className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200 transition-all text-sm font-medium"
//                     >
//                       📊 View Analytics
//                     </Link>
//                     <QrPreview shortCode={shortData.short_code} />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           <motion.div className="lg:col-span-6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
//             <motion.div 
//               className="relative h-[400px] lg:h-[500px] rounded-3xl glass-card shadow-2xl animate-float-slow overflow-hidden"
//               whileHover={{ y: -10 }}
//             >
//               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-emerald-500/20" />
//               <OrbitParticles />
              
//               <div className="relative h-full flex items-center justify-center px-8 py-12 text-center">
//                 <motion.div 
//                   animate={{ y: [0, -10, 0] }}
//                   transition={{ duration: 3, repeat: Infinity }}
//                   className="max-w-md space-y-6"
//                 >
//                   <motion.p 
//                     className="text-xs uppercase tracking-[0.3em] text-emerald-300"
//                     animate={{ scale: [1, 1.05, 1] }}
//                     transition={{ duration: 2, repeat: Infinity }}
//                   >
//                     Live Click Telemetry
//                   </motion.p>
//                   <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent">
//                     Watch links light up from{' '}
//                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
//                       devices
//                     </span>
//                     , countries & referrers
//                   </h2>
//                   <p className="text-sm text-slate-300 leading-relaxed">
//                     Open analytics in new tab. Click your short link. Watch charts react instantly ✨
//                   </p>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// function ParticleSystem() {
//   return (
//     <>
//       {[...Array(30)].map((_, i) => (
//         <motion.div
//           key={i}
//           className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-40"
//           style={{
//             left: `${(i * 13.7) % 100}%`,
//             top: `${(i * 7.3) % 100}%`,
//           }}
//           animate={{
//             x: [0, 100, 0, -100],
//             y: [0, -50, 50, 0],
//             scale: [0.5, 1.5, 0.5],
//             opacity: [0.3, 1, 0.3],
//           }}
//           transition={{
//             duration: 15 + i * 0.5,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </>
//   );
// }

// function OrbitParticles() {
//   return (
//     <>
//       {[...Array(8)].map((_, i) => (
//         <motion.div
//           key={i}
//           className={clsx(
//             "absolute rounded-full shadow-lg",
//             i % 2 === 0 ? "bg-indigo-400/60" : "bg-emerald-400/60"
//           )}
//           style={{
//             width: 8 + i * 2,
//             height: 8 + i * 2,
//             top: `${20 + i * 8}%`,
//             left: `${30 + i * 5}%`,
//           }}
//           animate={{
//             rotate: 360,
//             scale: [1, 1.3, 1],
//           }}
//           transition={{
//             duration: 20 + i * 2,
//             repeat: Infinity,
//             ease: "linear",
//           }}
//         />
//       ))}
//     </>
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
//     return <p className="text-xs text-slate-500">Loading QR…</p>;
//   }
//   if (error) {
//     return <p className="text-xs text-red-400">{error}</p>;
//   }
//   if (!qrUrl) return null;

//   return (
//     <div className="flex items-center gap-2">
//       <span className="text-xs text-slate-300">QR:</span>
//       <img
//         src={qrUrl}
//         alt="QR code"
//         className="w-20 h-20 sm:w-24 sm:h-24 border border-slate-700 rounded-xl bg-white/90 shadow-lg hover:shadow-2xl transition-all glass-glow"
//       />
//     </div>
//   );
// }







































import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Sparkles, Copy, ExternalLink } from 'lucide-react';
import clsx from 'clsx';

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900">
      <ParticleSystem />
      <div className="bg-orbit absolute inset-0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 py-6 sm:py-10 lg:py-16"
      >
        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-10 flex flex-col sm:flex-row gap-4 sm:gap-0 items-start sm:items-center justify-between"
        >
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="h-9 w-9 rounded-3xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg glass-glow animate-pulse-soft"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase">
                Quantum Links
              </span>
              <span className="text-[11px] text-slate-500">
                Smart URLs. Live analytics.
              </span>
            </div>
          </motion.div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDark((d) => !d)}
              className="ml-auto text-xs px-3 py-1.5 rounded-full border border-slate-700/70 glass-card hover:bg-slate-800/90 transition-all"
            >
              {dark ? 'Light mode' : 'Dark mode'}
            </motion.button>
            {shortData?.short_code && (
              <Link
                to={`/analytics/${shortData.short_code}`}
                className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 hover:text-indigo-400 transition-all hover:scale-105"
              >
                <span>View Analytics</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </motion.header>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-start">
          {/* Left column: hero + form + result */}
          <motion.div className="lg:col-span-6 space-y-7 sm:space-y-9">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 glass-card px-3 py-1 text-[10px] sm:text-[11px] font-medium text-emerald-300"
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Realtime link intelligence
              </motion.div>

              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-white via-indigo-400 to-emerald-300 bg-clip-text text-transparent leading-tight"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Turn long URLs into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  smart links
                </span>
              </motion.h1>
            </motion.div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative glass-card rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl animate-float-slow"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-400/10" />
              <div className="relative space-y-4">
                <label className="block text-xs sm:text-sm font-semibold text-slate-300">
                  Destination URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.input
                    type="url"
                    placeholder="https://example.com/your-long-link"
                    className="flex-1 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-white/20 bg-white/5 text-sm sm:text-base text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-purple-500/40 transition-all duration-300 glass-card"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto whitespace-nowrap px-5 sm:px-6 py-3 sm:py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-xs sm:text-sm md:text-base font-bold text-white shadow-2xl hover:shadow-purple-500/50 glass-glow transition-all duration-300"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Shortening…
                      </span>
                    ) : (
                      '🚀 Shorten URL'
                    )}
                  </motion.button>
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs sm:text-sm text-red-400 pt-1"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-3 sm:pt-4 text-[10px] sm:text-xs text-slate-400">
                {[
                  { icon: '⚡', label: 'UTM‑safe redirects' },
                  { icon: '🛰', label: 'Live analytics' },
                  { icon: '🧩', label: 'QR codes' },
                ].map((feat, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-700/50 px-2.5 sm:px-3 py-1 glass-card"
                  >
                    {feat.icon} {feat.label}
                  </motion.span>
                ))}
              </div>
            </motion.form>

            {/* Result card */}
            <AnimatePresence>
              {shortData && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  className="glass-card rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl animate-float-fast"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400">
                      Short URL
                    </span>
                    <a
                      href={shortData.short_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-sm sm:text-base md:text-lg font-semibold text-indigo-300 hover:text-indigo-200 underline decoration-2 break-all transition-all"
                    >
                      {shortData.short_url}
                    </a>
                    <motion.button
                      onClick={handleCopy}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 hover:from-slate-600 hover:to-slate-700 text-xs sm:text-sm font-medium transition-all shadow-lg"
                    >
                      <Copy className="w-4 h-4" />
                      {copyLabel}
                    </motion.button>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                      to={`/analytics/${shortData.short_code}`}
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs sm:text-sm text-emerald-300 hover:bg-emerald-500/30 hover:text-emerald-200 transition-all font-medium"
                    >
                      📊 View Analytics
                    </Link>
                    <QrPreview shortCode={shortData.short_code} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right column: hero panel */}
          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              className="relative h-[260px] sm:h-[320px] md:h-[380px] lg:h-[460px] xl:h-[520px] rounded-3xl glass-card shadow-2xl animate-float-slow overflow-hidden"
              whileHover={{ y: -10 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-emerald-500/20" />
              <OrbitParticles />

              <div className="relative h-full flex items-center justify-center px-6 sm:px-8 py-8 sm:py-12 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="max-w-md space-y-4 sm:space-y-6"
                >
                  <motion.p
                    className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-emerald-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Live Click Telemetry
                  </motion.p>
                  <h2 className="text-lg sm:text-xl lg:text-3xl font-black bg-gradient-to-r from-indigo-300 via-white to-emerald-300 bg-clip-text text-transparent">
                    Watch links light up from{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      devices
                    </span>
                    , countries &amp; referrers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Open analytics in another tab, click your short link, and
                    watch the charts react in real time.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ParticleSystem() {
  return (
    <>
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-40"
          style={{
            left: `${(i * 13.7) % 100}%`,
            top: `${(i * 7.3) % 100}%`,
          }}
          animate={{
            x: [0, 100, 0, -100],
            y: [0, -50, 50, 0],
            scale: [0.5, 1.5, 0.5],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 15 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </>
  );
}

function OrbitParticles() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className={clsx(
            'absolute rounded-full shadow-lg',
            i % 2 === 0 ? 'bg-indigo-400/60' : 'bg-emerald-400/60'
          )}
          style={{
            width: 8 + i * 2,
            height: 8 + i * 2,
            top: `${20 + i * 8}%`,
            left: `${30 + i * 5}%`,
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </>
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
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border border-slate-700 rounded-xl bg-white/90 shadow-lg hover:shadow-2xl transition-all glass-glow"
      />
    </div>
  );
}
