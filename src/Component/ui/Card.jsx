import React from "react";

export function Card({ children, className = "" }) {
    return (
        <div className={`shadow-lg rounded-xl p-4 border ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "" }) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}

export function Button({ children, className = "", onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
}
