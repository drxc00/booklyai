import { HTMLProps } from 'react'

interface BackgroundGridProps {
    color: string
    cellSize: string | number
    strokeWidth: number | string
    className?: string
    fade?: boolean
}

const BackgroundGrid = ({
    color = '#E6E6E6',
    cellSize = '25px',
    strokeWidth = '4px',
    className,
    fade = true,
    ...props
}: Partial<BackgroundGridProps> & HTMLProps<HTMLDivElement>) => {
    const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' stroke='${color}' stroke-width='${strokeWidth}' fill-opacity='0.4' >
      <path d='M 100 0 L 100 200'/>
      <path d='M 0 100 L 200 100'/>
    </svg>
  `
    const svgDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`

    return (
        <div
            className={`left-0 top-0 flex items-center justify-center h-full w-full ${className}`}
            style={{
                backgroundImage: `url("${svgDataUrl}")`,
                backgroundRepeat: 'repeat',
                backgroundSize: cellSize,

            }}
            {...props}
        ></div>
    )
}

export default BackgroundGrid