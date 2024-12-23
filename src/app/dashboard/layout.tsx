import NavBar from "@/components/nav-bar";
import cachedSession from "@/lib/session-cache";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // Session manager for all routes
    const session = await cachedSession();
    if (!session) {
        return {
            redirect: {
                destination: "/login", // Redirect to login page if no session
                permanent: false, // Temporary redirect
            },
        };
    }
    return (
        <div className="h-screen">
            <NavBar />
            {children}
        </div>
    )
}