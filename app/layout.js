import './globals.css';

export const metadata = {
  title: 'URL Bundle Creator | Share multiple links with one link',
  description: 'Create a clean, shareable page for your useful links. Perfect for teachers, developers, and creators.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
