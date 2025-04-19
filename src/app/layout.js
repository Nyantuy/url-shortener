import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakartaSans = Plus_Jakarta_Sans({
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  subsets: ['latin'],
  style: ['normal'],
});

export const metadata = {
  title: 'HytamShortener',
  description: 'URL Shortener',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakartaSans.className} antialiased`}>{children}</body>
    </html>
  );
}
