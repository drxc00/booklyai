

import { signOut } from "@/lib/auth";
import { Button } from "../ui/button";

export default function LogOutButton({ children, className, variant }: { children: React.ReactNode, className?: string, variant?: "default" | "destructive" | "secondary" }) {
    // bullshit lmao
    return (
        <form action={async () => {
            "use server";
            await signOut({
                redirectTo: "/"
            })
        }}>
            <Button variant={variant} className={className}>{children}</Button>
        </form>
    );
}