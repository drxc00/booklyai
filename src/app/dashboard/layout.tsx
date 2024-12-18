import NavBar from "@/components/nav-bar";
import { redirect } from "next/navigation";
import cachedSession from "@/lib/session-cache";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {

    // Session manager for all routes
    const session = await cachedSession();
    if (!session) redirect(`/login`);

    return (
        <div className="h-screen">
            <NavBar />
            {children}
        </div>
    )
}