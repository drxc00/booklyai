import React from 'react'
import { inView, motion } from 'framer-motion'
import { TextShimmer } from '@/components/ui/text-shimmer'

export default function Loader({ message }: { message?: string }) {
    return (
        <div>
            <div className="flex items-center justify-center space-x-1">
                {[...Array(5)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="h-8 w-2 rounded bg-muted-foreground/70"
                        animate={{
                            scaleY: [1, 1.5, 1],
                            translateY: ['0%', '-25%', '0%'],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: index * 0.1,
                        }}
                    />
                ))}
            </div>
            {message && <TextShimmer className='mt-2 font-medium text-2xl'>{message}</TextShimmer>}
        </div>
    )
}