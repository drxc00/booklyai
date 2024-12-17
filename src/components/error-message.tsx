import { TriangleAlert } from "lucide-react";

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex flex-col items-center gap-2 text-destructive ">
                <TriangleAlert size={100} />
                {children}
            </div>
        </>
    );
}