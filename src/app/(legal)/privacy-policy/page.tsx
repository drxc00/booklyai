import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
    return (
        <main className="flex items-center justify-center text-justify mb-10 p-6">
            <div className="grid space-y-5 items-center justify-center w-full max-w-2xl">
                <h1 className="text-3xl font-semibold font-serif">Privacy Policy</h1>
                <div>
                    <h2 className="font-semibold text-xl font-serif mb-2">Information We Collect</h2>
                    <p>
                        We collect information you provide directly (e.g., account details) and data generated during your use of the platform (e.g., usage analytics).
                        Payment information is handled securely by third-party providers.
                    </p>
                </div>
                <Separator />
                <div>
                    <h2 className="font-semibold text-xl font-serif mb-2">Sharing Your Information</h2>
                    <p>
                        We do not sell your personal data.
                        Information may be shared with service providers to facilitate operations or comply with legal obligations.
                    </p>
                </div>
                <Separator />
                <div>
                    <h2 className="font-semibold text-xl font-serif mb-2">Your Rights</h2>
                    <p>
                        You can access, update, or delete your personal information by contacting us.
                        Some data may be retained as required by law.
                    </p>
                </div>
                <Separator />
                <div>
                    <h2 className="font-semibold text-xl font-serif mb-2">Security</h2>
                    <p>
                        We implement measures to protect your data, but no system is completely secure. Use our platform at your own risk.
                    </p>
                </div>
                <Separator />
                <div>
                    <h2 className="font-semibold text-xl font-serif mb-2">Updates to This Policy</h2>
                    <p>
                        We may revise this policy occasionally. Changes will be posted on our website.
                    </p>
                </div>
            </div>
        </main>
    )
}