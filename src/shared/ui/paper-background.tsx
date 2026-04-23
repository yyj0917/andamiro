const noiseBackground =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"

export function PaperBackground() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-parchment" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.045] mix-blend-multiply"
        style={{ backgroundImage: noiseBackground }}
      />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,253,248,0.8),transparent_34%),linear-gradient(90deg,rgba(45,62,51,0.035),transparent_18%,transparent_82%,rgba(45,62,51,0.035))]" />
    </>
  )
}
