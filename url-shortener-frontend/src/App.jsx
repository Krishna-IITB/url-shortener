
// // App.jsx
// import React, { useState } from 'react';
// import axios from 'axios';

// const API_BASE = 'http://localhost:3000'; // your backend

// export default function App() {
//   const [url, setUrl] = useState('');
//   const [shortData, setShortData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [copyLabel, setCopyLabel] = useState('Copy');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setShortData(null);
//     setCopyLabel('Copy');

//     if (!url.trim()) {
//       setError('Please enter a URL');
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(`${API_BASE}/api/shorten`, { url });
//       setShortData(res.data.data);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to shorten URL');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCopy = async () => {
//     if (!shortData?.short_url) return;
//     try {
//       await navigator.clipboard.writeText(shortData.short_url);
//       setCopyLabel('Copied!');
//       setTimeout(() => setCopyLabel('Copy'), 1500);
//     } catch {
//       setError('Failed to copy link');
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex bg-slate-900 text-slate-50">
//       {/* Left panel: URL Shortener card */}
//       <div className="w-full max-w-md p-6 bg-slate-950 flex flex-col">
//         <h1 className="text-2xl font-bold mb-4 text-center text-slate-50">
//           URL Shortener
//         </h1>

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input
//             type="url"
//             placeholder="https://example.com"
//             className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-50"
//             value={url}
//             onChange={(e) => setUrl(e.target.value)}
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-sm font-semibold transition"
//           >
//             {loading ? 'Shortening...' : 'Shorten URL'}
//           </button>
//         </form>

//         {error && (
//           <p className="mt-3 text-sm text-red-400">{error}</p>
//         )}

//         {shortData && (
//           <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
//             <div className="flex items-center gap-2">
//               <span className="text-sm text-slate-300">Short URL:</span>
//               <a
//                 href={shortData.short_url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-sm text-indigo-400 underline break-all"
//               >
//                 {shortData.short_url}
//               </a>
//               <button
//                 onClick={handleCopy}
//                 className="ml-auto px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-600"
//               >
//                 {copyLabel}
//               </button>
//             </div>

//             {shortData.short_code && (
//               <QrPreview shortCode={shortData.short_code} />
//             )}
//           </div>
//         )}
//       </div>

//       {/* Right panel: empty, auto-expands */}
//       <div className="flex-1 bg-slate-800"></div>
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

//   if (loading) return <p className="text-sm text-slate-400">Loading QR code...</p>;
//   if (error) return <p className="text-sm text-red-400">{error}</p>;
//   if (!qrUrl) return null;

//   return (
//     <div className="flex flex-col items-start gap-2">
//       <span className="text-sm text-slate-300">QR Code:</span>
//       <img
//         src={qrUrl}
//         alt="QR code"
//         className="w-32 h-32 border border-slate-700 rounded bg-white"
//       />
//     </div>
//   );
// }







// App.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // ← ADD THIS IMPORT
import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // your backend

export default function App() {
  const [url, setUrl] = useState('');
  const [shortData, setShortData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortData(null);
    setCopyLabel('Copy');

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/shorten`, { url });
      setShortData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortData?.short_url) return;
    try {
      await navigator.clipboard.writeText(shortData.short_url);
      setCopyLabel('Copied!');
      setTimeout(() => setCopyLabel('Copy'), 1500);
    } catch {
      setError('Failed to copy link');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-900 text-slate-50">
      {/* Left panel: URL Shortener card */}
      <div className="w-full max-w-md p-6 bg-slate-950 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-center text-slate-50">
          URL Shortener
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="url"
            placeholder="https://example.com"
            className="w-full px-3 py-2 rounded border border-slate-700 bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-50"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-sm font-semibold transition"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-400">{error}</p>
        )}

        {shortData && (
          <div className="mt-4 space-y-3 border-t border-slate-700 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-300">Short URL:</span>
              <a
                href={shortData.short_url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-indigo-400 underline break-all"
              >
                {shortData.short_url}
              </a>
              <button
                onClick={handleCopy}
                className="ml-auto px-2 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 border border-slate-600"
              >
                {copyLabel}
              </button>
            </div>

            {/* ← ADD ANALYTICS LINK HERE */}
            <Link
              to={`/analytics/${shortData.short_code}`}
              className="inline-block mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline transition"
            >
              📊 View analytics
            </Link>

            {shortData.short_code && (
              <QrPreview shortCode={shortData.short_code} />
            )}
          </div>
        )}
      </div>

      {/* Right panel: empty, auto-expands */}
      <div className="flex-1 bg-slate-800"></div>
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

  if (loading) return <p className="text-sm text-slate-400">Loading QR code...</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!qrUrl) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      <span className="text-sm text-slate-300">QR Code:</span>
      <img
        src={qrUrl}
        alt="QR code"
        className="w-32 h-32 border border-slate-700 rounded bg-white"
      />
    </div>
  );
}
