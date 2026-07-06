
export function RedPulse() {
    return (
        <div className="flex flex-row gap-1 items-center">
            <span className="text-red-500">LIVE</span>
            <div className="relative flex h-2 w-2 ">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </div>
        </div>
    )
}

export function GreenPulse() {
    return (
        <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
    )
}