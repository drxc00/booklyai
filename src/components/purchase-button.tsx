"use client";

import { Button } from "./ui/button";
import axios from "axios";
import { Session } from "next-auth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

interface PurchaseButtonProps {
    bookId: string;
    session: Session
    variant?: "default" | "secondary";
    className?: string;
}

export default function PurchaseButton({ bookId, session, variant, className }: PurchaseButtonProps) {

    const [isPaymentPending, startPayment] = useState<boolean>(false);
    const router = useRouter();

    return (
        <form action={async () => {
            startPayment(true);
            try {
                const response = await axios.post("/api/payments/purchase", {
                    bookId: bookId,
                    userId: session?.user?.id,
                    email: session?.user?.email,
                });
                if (response.status !== 200) {
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Error while making payment",
                    });
                    return;
                }
                const responseJSON = response.data;
                router.push(responseJSON.checkoutUrl);
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error: " + (error as Error).message,
                });
                startPayment(false);
            }
        }}>
            <Button type="submit" disabled={isPaymentPending} className={`w-full ${className}`} variant={variant || "default"}>
                <ShoppingCart /> <span>{isPaymentPending ? "Redirecting..." : "Purchase"}</span>
            </Button>
        </form>
    )
}