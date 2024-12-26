import Link from "next/link";
import { Button } from "./ui/button";
import { MdOutlineLogout } from "react-icons/md";
import { MdCollectionsBookmark } from "react-icons/md";
import LogOutButton from "./log-out";
import { SiWikibooks } from "react-icons/si";

export default async function NavBar() {
    return (
        <div className="border-b border-muted h-16 pr-5 pl-5 flex justify-between items-center bg-background">
            <Link href="/">
                <div className="flex items-center gap-2 text-primary-foreground">
                    <SiWikibooks size={20} />
                    <h1 className="font-semibold tracking-normal ">booklyai</h1>
                </div>
            </Link>
            <div className="flex gap-2">
                <Link href="/dashboard">
                    <Button className="flex items-center gap-2" ><span>Dashboard</span> <MdCollectionsBookmark /></Button>
                </Link>
                <LogOutButton variant="outline" className="flex items-center border-muted"><span>Logout</span> <MdOutlineLogout /></LogOutButton>
            </div>
        </div>
    )
}