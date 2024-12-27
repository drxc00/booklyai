import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn, auth, providerMap } from "@/lib/auth";
import { AuthError } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa";

// Provider Icons based on ID
const providerIcons = {
    "google": {
        icon: FaGoogle,
        color: "text-slate-500"
    }
}

const SIGNIN_ERROR_URL = "/login";


export default async function LoginPage({ params }: { params: Promise<any> }) {

    const session = await auth();
    if (session) return redirect("/dashboard");

    return (
        <div className="items-centertext-background-foreground justify-items-center p-8 pb-10 gap-16 justify-center">
            <Card className="bg-card w-full max-w-lg shadow-none">
                <CardHeader>
                    <CardTitle className="font-normal text-4xl text-center font-serif">Login to <span className="font-bold">booklyai</span></CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <div className="flex flex-col gap-2">
                        {Object.values(providerMap).map((provider, index) => (
                            <form
                                key={index}
                                action={async () => {
                                    "use server"
                                    try {
                                        await signIn(provider.id, {
                                            redirectTo: "/dashboard",
                                        })
                                    } catch (error) {
                                        // Signin can fail for a number of reasons, such as the user
                                        // not existing, or the user not having the correct role.
                                        // In some cases, you may want to redirect to a custom error
                                        if (error instanceof AuthError) {
                                            return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
                                        }
                                        throw error
                                    }
                                }}
                            >
                                <Button type="submit" size={"lg"}>
                                    <span className="flex items-center gap-2"><span>{providerIcons[provider.id as keyof typeof providerIcons].icon({})} </span> Sign in with {provider.name}</span>
                                </Button>
                            </form>
                        ))}
                    </div>

                    <div className="mt-4 text-muted-foreground text-sm font-serif">
                        <span>Go back to <Link href="/" className="underline font-semibold">Home</Link></span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}