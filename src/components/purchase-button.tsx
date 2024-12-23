"use client";

import { Button } from "./ui/button";
import axios from "axios";
import { Session } from "next-auth";
import { toast } from "@/hooks/use-toast";
import { MdOutlinePayment } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PurchaseButtonProps {
    bookId: string;
    session: Session
}

export default function PurchaseButton({ bookId, session }: PurchaseButtonProps) {

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
            <Button type="submit" disabled={isPaymentPending}>
                {isPaymentPending ? "Redirecting..." : "Purchase Book"} <MdOutlinePayment />
            </Button>
        </form>
    )
}