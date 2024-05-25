import { jakarta } from "../libs/fonts";
import "./globals.css";


export const metadata = {
  title: "Sikap",
  description: "Sistem Informasi Kehadiran dan Absensi SMK Pekerjaan Umum Negeri Bandung",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={jakarta.className}>{children}</body>
    </html>
  );
}
