import React from "react";
import Header from "../Component/Header/Header";
import Footer from "../Component/Footer/Footer";

function Layout({ children }) {
    return (
        <div className="w-screen min-h-screen flex flex-col">
            <Header />
            <div className="mt-16">{children}</div>
            <Footer />
        </div>
    );
}

export default Layout;
