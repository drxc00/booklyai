'use client'
import { useCallback } from 'react'
import { generateData, StreamResponseChunk } from '@/app/actions';


function iterateStreamResponse<T>(streamResponse: Promise<StreamResponseChunk<T>>) {
    return {
        [Symbol.asyncIterator]: function () {
            return {
                current: streamResponse,
                async next() {
                    const { iteratorResult, next } = await this.current

                    if (next) this.current = next
                    else iteratorResult.done = true

                    return iteratorResult
                }
            };
        }
    };
}

function Streams() {
    const run = useCallback(async () => {
        try {
            const start = Date.now()
            for await (const value of iterateStreamResponse(generateData(1, '1'))) {
                console.log('Elapsed: ', Date.now() - start, ' Got: ', value)
            }
        } catch (error) {
            console.error(error)
        }
    }, [])

    return (
        <button onClick={run}>
            Start the show!
        </button>
    )
}

export default Streams