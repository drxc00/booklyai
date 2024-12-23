
import React from "react";
export default async function Layout({
    children
}: {
    children: React.ReactNode, params: Promise<{ bookId: string }>
}) {
    return (
        <>
            {children}
        </>
    )
}