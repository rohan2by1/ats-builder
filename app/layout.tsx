import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/sketch.css";

export const metadata: Metadata = {
  title: "CV Optimizer — AI-Powered Resume Enhancement",
  description: "Optimize your LaTeX CV for any job description using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        style={{ margin: 0, padding: 0, overflow: "hidden", background: "#FFFFFF" }}
      >
        {children}
      </body>
    </html>
  );
}