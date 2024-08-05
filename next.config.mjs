/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html',
        permanent: true,
      },
      {
        source: '/docs/',
        destination: '/docs/index.html',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
