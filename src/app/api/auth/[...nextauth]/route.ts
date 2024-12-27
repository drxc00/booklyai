import { handlers } from "@/lib/auth"
import { NextRequest } from "next/server"

// If the request is coming from a trusted origin, we replace the origin with the env origin
// This is a fix for the issue when successful email redirects to 0.0.0.0 when container is run in docker
// Credits to: https://github.com/nextauthjs/next-auth/issues/10928#issuecomment-2144241314
const reqWithTrustedOrigin = (req: NextRequest): NextRequest => {
    if (process.env.AUTH_TRUST_HOST !== 'true') return req
    const proto = req.headers.get('x-forwarded-proto')
    const host = req.headers.get('x-forwarded-host')
    if (!proto || !host) {
        console.warn("Missing x-forwarded-proto or x-forwarded-host headers.")
        return req
    }
    const envOrigin = `${proto}://${host}`
    const { href, origin } = req.nextUrl
    return new NextRequest(href.replace(origin, envOrigin), req)
}

export const GET = (req: NextRequest) => {
    return handlers.GET(reqWithTrustedOrigin(req))
}

export const POST = (req: NextRequest) => {
    return handlers.POST(reqWithTrustedOrigin(req))
}