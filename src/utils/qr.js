import QRCode from 'qrcode';

export async function generateQrDataUrl(text) {
  // Returns data:image/png;base64,...
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    margin: 2,
    scale: 6
  });
}
