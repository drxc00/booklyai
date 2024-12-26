import { MdErrorOutline } from "react-icons/md";

export default function ForbiddenAccess() {
    return (
        <div className="flex items-center justify-center gap-2 min-h-screen">
            <div className=" flex flex-col justify-center items-center">
                <MdErrorOutline className="h-24 w-24 text-red-500" />
                <span className='mt-2 font-semibold text-3xl font-serif'>Forbidden Access</span>
                <p className="text-muted-foreground mt-2">You don&apos;t own this book</p>
            </div>
        </div>
    )
}