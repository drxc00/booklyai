import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full border-t sticky top-[100vh]">
            <div className="border-t">
                <div className="px-4 md:px-6 py-4 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                        © 2024 booklyai. All rights reserved.
                    </p>
                    <nav className="flex flex-col lg:flex-row gap-2 lg:gap-4 text-end">
                        <Link href="/privacy-policy" className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Terms of Service</Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

