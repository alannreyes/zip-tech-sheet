import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ZTS - Zip Technical Sheets',
  description: 'Aplicación para generar archivos ZIP con fichas técnicas organizadas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">ZTS</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Zip Technical Sheets
                  </h1>
                </div>
              </div>
            </div>
          </header>
          
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-4">
              <p className="text-center text-sm text-gray-600">
                ZTS - Zip Technical Sheets &copy; {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
} 