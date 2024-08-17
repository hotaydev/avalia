import { Inter } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import type { AppProps } from "next/app";

// Used these two dependencies to have compatibility with older browsers (like IOS 12 and IOS 10)
import "core-js/stable";
import "regenerator-runtime/runtime";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} className={inter.className} />
    </ErrorBoundary>
  );
}
