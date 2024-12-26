

import { signOut } from "@/lib/auth";
import { Button } from "./ui/button";

interface LogOutButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "secondary" | "outline";
}

export default function LogOutButton({ children, className, variant }: LogOutButtonProps) {
    // bullshit lmao
    return (
        <form action={async () => {
            "use server";
            await signOut({
                redirectTo: "/login"
            })
        }}>
            <Button variant={variant} className={className}>{children}</Button>
        </form>
    );
}