import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://comunidadercssaude.vercel.app"),
  title: { default: "RCS Prime Cursos — Concursos da Saúde", template: "%s — RCS Prime Cursos" },
  description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "RCS Prime Cursos",
  },
  openGraph: {
    title: "RCS Prime Cursos — Concursos da Saúde",
    description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
    url: "https://comunidadercssaude.vercel.app",
    siteName: "RCS Prime Cursos",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://comunidadercssaude.vercel.app/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "RCS Prime Cursos — Concursos da Saúde",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RCS Prime Cursos — Concursos da Saúde",
    description: "Preparação organizada para concursos da saúde: Enfermagem, Técnico de Enfermagem e Radiologia Médica. Matérias por edital, plano individual, comunidade e podcasts.",
    images: ["https://comunidadercssaude.vercel.app/og-image.png?v=2"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#07110c" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen antialiased bg-background text-foreground">{children}</body>
    </html>
  );
}
