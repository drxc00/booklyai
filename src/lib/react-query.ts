
/* singleton implementation for react query client */
import { QueryClient } from "@tanstack/react-query";

const reactQuerySingleton = () => {
    return new QueryClient();
}

declare const globalThis: {
    reactQueryGlobal: ReturnType<typeof reactQuerySingleton>;
} & typeof global;

const reactQueryClient = globalThis.reactQueryGlobal ?? reactQuerySingleton()

export default reactQueryClient

if (process.env.NODE_ENV !== 'production') globalThis.reactQueryGlobal = reactQueryClient