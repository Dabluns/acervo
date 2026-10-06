type Props = {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({ size = 48, showText = true, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div
        className="relative overflow-hidden rounded-[22%] border border-white/15 bg-white/6 shadow-[0_10px_35px_rgba(244,63,94,0.18)] backdrop-blur"
        style={{ width: size, height: size, flexShrink: 0 }}
      >
        <img
          src="/acervoaki-mark.png"
          alt="Acervoaki"
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.3),transparent_55%)]" />
      </div>
      {showText && (
        <div className="min-w-0">
          <span
            className="block whitespace-nowrap font-semibold uppercase leading-none text-white"
            style={{ fontFamily: "var(--font-display)", fontSize: size * 0.34, letterSpacing: "0.18em" }}
          >
            Acervoaki
          </span>
          <span className="mt-1 block whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.38em] text-zinc-400">
            digital vault
          </span>
        </div>
      )}
    </div>
  )
}
