import React from 'react'

export default function Loader({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
            {message && <span className='mt-2 font-semibold text-2xl font-serif'>{message}</span>}
        </div>
    )
}