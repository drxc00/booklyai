export const dynamic = 'force-dynamic';

import { lemonSqueezyRequest, LemonSqueezyResponse } from "@/lib/lemon-squeezy";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
    bookId: string;
    userId: string;
    email: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        // Get the request body
        const data: RequestBody = await req.json();

        // Short circuit if bookId or userId is missing
        if (!data.bookId || !data.userId) {
            return NextResponse.json({
                error: "Missing bookId or userId",
                status: 400
            })
        }

        // Const 'expires_at' for 20 mins 
        const expires_at = new Date(Date.now() + 20 * 60 * 1000).toISOString();

        // Request payload
        const payload = {
            data: {
                type: "checkouts",
                attributes: {
                    checkout_data: {
                        email: data.email,
                        custom: {
                            bookId: data.bookId,
                            userId: data.userId,
                            email: data.email,
                        },
                    },
                    product_options: {
                        redirect_url: `http://localhost:3000/dashboard/generate/${data.bookId}/final`,
                    },
                    expires_at: expires_at, // 24 hours
                },
                relationships: {
                    store: {
                        data: {
                            type: "stores",
                            id: process.env.LEMON_SQUEEZY_STORE_ID?.toString(),
                        },
                    },
                    variant: {
                        data: {
                            type: "variants",
                            id: process.env.LEMON_SQUEEZY_VARIANT_ID?.toString(),
                        },
                    },
                },
            },
        };

        // Call the Lemon Squeezy API
        const response: LemonSqueezyResponse = await lemonSqueezyRequest({
            method: "POST",
            url: "checkouts",
            data: payload,
        });

        return NextResponse.json({
            id: response.data.id,
            checkoutUrl: response.data.attributes.url,
            checkout_data: response.data.attributes.checkout_data,
            expires_at: response.data.attributes.expires_at
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}