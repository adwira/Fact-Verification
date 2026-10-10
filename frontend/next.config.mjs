/** @type {import('next').NextConfig} */
const nextConfig = {
  // Nonaktifkan source map publik di produksi untuk keamanan kode
  productionBrowserSourceMaps: false,
  // Sembunyikan header 'x-powered-by: Next.js'
  poweredByHeader: false,
};

export default nextConfig;
