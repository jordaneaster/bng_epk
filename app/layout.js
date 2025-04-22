import '../styles/globals.css';

export const metadata = {
  title: 'BNG NappSakk | Official EPK',
  description: 'Electronic Press Kit for hip-hop artist BNG NappSakk',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
