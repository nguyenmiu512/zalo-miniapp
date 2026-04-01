import type { NextConfig } from "next";

// GitHub Actions sets GITHUB_ACTIONS=true automatically
const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(isGithubPages && {
    output: "export",
    trailingSlash: true,
    images: { unoptimized: true },
    basePath: "/zalo-miniapp",
    assetPrefix: "/zalo-miniapp/",
  }),
};

export default nextConfig;
