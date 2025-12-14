// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

// export default function NotFoundPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 text-slate-50 p-4">
//       <motion.div 
//         initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
//         animate={{ opacity: 1, scale: 1, rotateX: 0 }}
//         transition={{ duration: 0.8, type: "spring" }}
//         className="max-w-md w-full px-8 py-12 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl text-center space-y-8 glass-card"
//       >
//         <motion.div 
//           animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
//           transition={{ duration: 2, repeat: Infinity }}
//           className="text-8xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-4"
//         >
//           404
//         </motion.div>
        
//         <div className="space-y-4">
//           <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
//             Link Not Found
//           </h1>
//           <p className="text-lg text-slate-400 leading-relaxed max-w-sm mx-auto">
//             The page you're looking for doesn't exist or has expired.
//           </p>
//         </div>
        
//         <motion.div 
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.98 }}
//         >
//           <Link
//             to="/"
//             className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-lg font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 glass-glow"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             Go Back Home
//           </Link>
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }






import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-900 text-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="max-w-md w-full px-6 sm:px-8 py-8 sm:py-12 bg-white/5 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl text-center space-y-6 sm:space-y-8 glass-card"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl sm:text-8xl font-black bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent mb-2 sm:mb-4"
        >
          404
        </motion.div>

        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
            Link Not Found
          </h1>
          <p className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist or has expired.
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-sm sm:text-lg font-bold shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 glass-glow"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Go Back Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
