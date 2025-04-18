import React from "react";
import getCachedSession from "@/lib/session-cache";
import { redirect } from "next/navigation";
export default async function Layout({
    children
}: {
    children: React.ReactNode
}) {

    const session = await getCachedSession();

    if (!session) redirect("/login");

    return (
        <>
            {children}
        </>
    )
}