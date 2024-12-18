import Loader from "@/components/loader";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <Loader message="Loading" />
        </div>
    )
}