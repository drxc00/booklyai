import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import getCachedSession from "@/lib/session-cache";
import { signIn, providerMap } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaGithub, FaGoogle } from "react-icons/fa";

// Provider Icons based on ID
const providerIcons = {
    "google": {
        icon: FaGoogle,
        color: "text-muted-foreground"
    },
    "github": {
        icon: FaGithub,
        color: "text-muted-foreground"
    }
}

const ERROR: { [key: string]: { message: string } } = {
    "OAuthCallbackError": {
        message: "OAuth Login Failed. Please try again.",
    },
    "OAuthAccountNotLinked": {
        message: "Email address is already linked to another account.",
    },
    "OAuthCallback": {
        message: "OAuth Login Failed. Please try again.",
    },
}


export default async function LoginPage({
    params,
    searchParams
}: {
    params: Promise<{ error: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await getCachedSession();
    const urlParams = await searchParams;
    if (session) return redirect("/library");

    return (
        <div className="items-center text-background-foreground justify-items-center p-8 pb-10 gap-16 justify-center">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-normal text-2xl text-center font-serif">
                            Login to {" "}
                            <span className="font-bold">
                                booklyai
                            </span>
                        </CardTitle>
                        <CardDescription>
                            Login with your Google or Github account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {urlParams?.error && (
                            <div className="mb-4">
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Login failed</AlertTitle>
                                    <AlertDescription className="text-sm">
                                        {ERROR[urlParams.error as string]?.message || "Something went wrong. Please try again."}
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                {Object.values(providerMap).map((provider, index) => (
                                    <form
                                        key={index}
                                        action={async () => {
                                            "use server"
                                            await signIn(provider.id, {
                                                redirectTo: "/library",
                                            })
                                        }}
                                    >
                                        <Button variant="outline" className="w-full" type="submit">
                                            <span className="flex items-center gap-2"><span>{providerIcons[provider.id as keyof typeof providerIcons].icon({})} </span> Sign in with {provider.name}</span>
                                        </Button>
                                    </form>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]  ">
                    By clicking continue, you agree to our <a href="/terms-of-service">Terms of Service</a>{" "}
                    and <a href="/privacy-policy">Privacy Policy</a>.
                </div>
            </div>
        </div>
    )
}