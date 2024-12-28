import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers"
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma-db";
import Logger from "./logger";

const providers: Provider[] = [
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    GitHub({
        clientId: process.env.AUTH_GITHUB_ID as string,
        clientSecret: process.env.AUTH_GITHUB_SECRET as string
    }),
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
        signIn: "/login",
        error: "/login",
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
        },
        redirect({ url, baseUrl }) {
            return url;
        }
    },
    debug: process.env.NODE_ENV !== "production",
    logger: {
        error: (code, ...message) => Logger.error("AUTH", (code as Error).message),
        warn: (code, ...message) => Logger.warn("AUTH", code),
        debug: (code, ...message) => Logger.debug("AUTH", code),
    }
})