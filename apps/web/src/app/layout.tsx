import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "@/styles/globals.css";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "medicom — Telehealth, triage & prescriptions",
    template: "%s · medicom",
  },
  description:
    "Secure video consultations, AI-assisted triage, and verified e-prescriptions. HIPAA-aligned telehealth for patients, clinicians and pharmacies.",
  keywords: [
    "telehealth",
    "online doctor",
    "e-prescription",
    "medical triage",
    "HIPAA",
    "virtual care",
  ],
  openGraph: {
    title: "medicom — Telehealth, triage & prescriptions",
    description:
      "Secure video consultations, AI-assisted triage, and verified e-prescriptions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lexend.variable}`}>
      <body className="min-h-screen font-sans antialiased bg-canvas text-ink">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
