import React from "react";
import Header from "../Component/Header/Header";
import Footer from "../Component/Footer/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../Component/Comman/ScrollToTop";

function Layout({ children }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="sticky top-0 z-50 shadow-sm bg-white">
                <Header />
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white">
                <Footer />
            </footer>

            {/* Utility Components */}
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#fff',
                        color: '#374151',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                    },
                }}
            />
            <ScrollToTop />
        </div>
    );
}

export default Layout;