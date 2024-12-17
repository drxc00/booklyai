export default function Dot({
    color = "#cacacaca",
    size = 1,
    spacing = 18,
    children,
    className,
}: DotProps) {
    return (
        <div
            style={{
                backgroundImage: `radial-gradient(${color} ${size}px, transparent ${size}px)`,
                backgroundSize: `calc(${spacing} * ${size}px) calc(${spacing} * ${size}px)`,
                height: "100%",
            }}
            className={className}
        >
            {children}
        </div>
    );
}