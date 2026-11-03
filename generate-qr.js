const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const url = 'https://eauthenticate.saudibusiness.gov.sa/inquiry';
const outputPath = path.join(__dirname, 'public', 'trusted-store-qr.webp');

// Generate QR code as PNG buffer first
QRCode.toBuffer(url, {
  errorCorrectionLevel: 'H',
  type: 'png',
  quality: 1,
  margin: 1,
  width: 400,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  }
}, (err, buffer) => {
  if (err) {
    console.error('Error generating QR code:', err);
    process.exit(1);
  }
  
  // Save as PNG (will be converted to WebP later if needed)
  const pngPath = outputPath.replace('.webp', '.png');
  fs.writeFileSync(pngPath, buffer);
  console.log('✅ QR Code generated successfully!');
  console.log('📁 Saved to:', pngPath);
  console.log('🔗 URL:', url);
  console.log('\nNote: Rename to .webp or use this PNG file directly.');
});
