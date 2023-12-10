const path = require("path");
const { NormalModuleReplacementPlugin } = require("webpack");

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  experimental: {
    useDeploymentId: true,
    useDeploymentIdServerActions: true,
  },
  webpack: (config, { webpack, isServer }) => {
    if (isServer) {
      config.plugins.push(
        // mute errors for unused typeorm deps
        new webpack.IgnorePlugin({
          resourceRegExp:
            /(^@google-cloud\/spanner|^@mongodb-js\/zstd|^aws-crt|^aws4$|^pg-native$|^mongodb-client-encryption$|^@sap\/hana-client$|^snappy$|^react-native-sqlite-storage$|^bson-ext$|^cardinal$|^kerberos$|^hdb-pool$|^sql.js$|^sqlite3$|^better-sqlite3$|^ioredis$|^typeorm-aurora-data-api-driver$|^pg-query-stream$|^oracledb$|^mysql$|^snappy\/package\.json$|^cloudflare:sockets$)/,
        }),
        // temp fix for react-email bug: https://github.com/resendlabs/react-email/issues/868#issuecomment-1782771917
        new NormalModuleReplacementPlugin(
          /email\/render/,
          path.resolve(__dirname, "./renderEmailFix.js"),
        ),
      );
    }

    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
  images: {
    domains: [
      "www.google.com",
      "avatar.vercel.sh",
      "faisalman.github.io",
      "api.dicebear.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
      "d2vwwcvoksz7ty.cloudfront.net",
      "lh3.googleusercontent.com",
      "media.cleanshot.cloud", // only for staging purposes
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/metatags",
        has: [
          {
            type: "host",
            value: "u0.wtf",
          },
        ],
        destination: "/tools/metatags",
        permanent: true,
        statusCode: 301,
      },
      {
        source: "/privacy",
        destination:
          "https://iamdaun.notion.site/U0-Privacy-Policy-13094fe86aa14163aa130fb8a4e77f77?pvs=4",
        permanent: true,
      },
      {
        source: "/terms",
        destination:
          "https://iamdaun.notion.site/U0-Terms-of-Service-ef7bbabd0c434f6e8b187f364a826280?pvs=4",
        permanent: true,
      },
      {
        source: "/license",
        destination: "https://github.com/daun-io/u0.wtf/blob/main/LICENSE.md",
        permanent: true,
      },
    ];
  },
};
