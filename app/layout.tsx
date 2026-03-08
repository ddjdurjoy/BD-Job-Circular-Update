import type {Metadata} from 'next';
import { Inter, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css'; // Global styles
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  variable: '--font-bengali',
});

export const metadata: Metadata = {
  title: 'BD Job Circular Update | সরকারি ও বেসরকারি চাকরির খবর ২৪/৭',
  description: 'সরকারি ও বেসরকারি চাকরির খবর ২৪/৭. Get the latest BD Govt, Bank, and Private job circulars instantly.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn">
      <body className={`${inter.variable} ${notoSansBengali.variable} font-sans bg-gray-50 text-gray-900 antialiased`} suppressHydrationWarning>
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
