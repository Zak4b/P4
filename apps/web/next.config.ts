import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Monorepo: dependencies live in the workspace-root node_modules, outside of
  // apps/web. Without this, file tracing stops at apps/web and the standalone
  // bundle ships without them.
  outputFileTracingRoot: path.join(__dirname, '../..'),
};

export default nextConfig;
