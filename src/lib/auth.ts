import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma-db";

const providers: Provider[] = [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string

    })
]

// For Provider References
export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    }).filter((provider) => provider.id !== "credentials");


export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: providers,
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token }) {
            return token
        },
        async session({ session, token }) {
            const userId = token.sub as string;
            session.user.id = userId;
            session.user.email = token.email as string;
            session.user.name = token.name as string;
            return session
        }
    }
})