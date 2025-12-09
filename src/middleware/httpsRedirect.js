// export default function httpsRedirect(req, res, next) {
//   // Only redirect in production
//   if (process.env.NODE_ENV !== 'production') {
//     return next();
//   }
  
//   // Check if request is already HTTPS
//   const isHttps = req.secure || 
//                   req.headers['x-forwarded-proto'] === 'https' ||
//                   req.headers['x-forwarded-ssl'] === 'on';
  
//   if (!isHttps) {
//     const httpsUrl = `https://${req.headers.host}${req.url}`;
//     return res.redirect(301, httpsUrl);
//   }
  
//   next();
// }




export default function httpsRedirect(req, res, next) {
  // Skip HTTPS redirect if explicitly disabled (e.g., Docker/local)
  if (
    process.env.SKIP_HTTPS_REDIRECT === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return next();
  }

  const isHttps =
    req.secure ||
    req.headers['x-forwarded-proto'] === 'https' ||
    req.headers['x-forwarded-ssl'] === 'on';

  if (!isHttps) {
    const httpsUrl = `https://${req.headers.host}${req.url}`;
    return res.redirect(301, httpsUrl);
  }

  next();
}
