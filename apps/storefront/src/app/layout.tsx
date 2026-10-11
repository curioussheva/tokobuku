import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "QF Pustaka — Toko Buku Qanita",
    template: "%s — QF Pustaka",
  },
  description:
    "Toko buku online QF Pustaka. Buku-buku bermutu untuk perempuan, kesehatan, psikologi, dan pengembangan diri.",
  applicationName: "QF Pustaka",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QF Pustaka",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#7a1e1e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="id" data-mode="light">
      <body className="bg-cream text-ink antialiased">
        <main className="relative">{props.children}</main>
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}

// Registers /sw.js after hydration so the app becomes installable and
// offline-capable. Skipped in development unless explicitly enabled via
// NEXT_PUBLIC_SW_ENABLED, since a stale dev cache is a common source of
// confusion.
function ServiceWorkerRegister() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            var enabled = ${process.env.NEXT_PUBLIC_SW_ENABLED !== "false"};
            if (!enabled) return;
            if (typeof window === "undefined") return;
            if (!("serviceWorker" in navigator)) return;

            window.addEventListener("load", function () {
              navigator.serviceWorker
                .register("/sw.js", { scope: "/" })
                .then(function (registration) {
                  registration.addEventListener("updatefound", function () {
                    var installing = registration.installing;
                    if (!installing) return;
                    installing.addEventListener("statechange", function () {
                      if (
                        installing.state === "installed" &&
                        navigator.serviceWorker.controller
                      ) {
                        installing.postMessage("SKIP_WAITING");
                      }
                    });
                  });
                })
                .catch(function (err) {
                  console.warn("SW registration failed:", err);
                });
            });
          })();
        `,
      }}
    />
  )
}
