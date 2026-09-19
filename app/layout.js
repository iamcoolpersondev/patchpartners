import "./globals.css";

export const metadata = {
  title: {
    default: "Patch Partners — Software fixes & builds",
    template: "%s — Patch Partners",
  },
  description:
    "Friendly software help for websites, apps and bugs. Patch Partners fixes what is broken and builds what is next.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f2",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
