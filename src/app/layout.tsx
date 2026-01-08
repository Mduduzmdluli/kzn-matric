'use client';
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { ThemeProvider } from "next-themes";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {

   const pathname = usePathname();

  // Define routes where you don't want header/footer
  const noLayoutRoutes = ['/admin/signin', '/admin/signup'];
  const isAdminRoute = pathname?.startsWith('/admin');
  const showLayout = !noLayoutRoutes.includes(pathname) && !isAdminRoute;

  return (
      <html lang="en" suppressHydrationWarning>
      <body className={`${font.className}`}>
      <ThemeProvider
          attribute="class"
          enableSystem={true}
          defaultTheme="light"
      >
        <AuthProvider>
         {showLayout && <Header />}
          {children}
         {showLayout && <Footer />}
          <ScrollToTop />
        </AuthProvider>
      </ThemeProvider>
      </body>
      </html>
  );
}