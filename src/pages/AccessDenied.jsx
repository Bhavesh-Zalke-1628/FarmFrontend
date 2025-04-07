import { Button } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AccessDenied() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4">
            <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
            <p className="text-lg mt-4 text-gray-700">
                You must be logged in to view this page.
            </p>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                className="mt-6"
            >
                Back to Home
            </Button>
        </div>
    );
}

export default AccessDenied;
