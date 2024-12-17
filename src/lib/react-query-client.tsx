"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a react-query client;
const queryClient = new QueryClient();

// The purpose of this component is to provide the react-query client to the rest of the app
// QueryClientProvider is only available to client components
// In order to use the react-query client in a server component, we need to wrap it in a client component
export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}