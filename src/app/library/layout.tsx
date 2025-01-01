
import cachedSession from "@/lib/session-cache";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Session manager for all routes
    const session = await cachedSession();
    
    if (!session) redirect("/login");

    return (
        <div className="">
            {children}
        </div>
    )
}