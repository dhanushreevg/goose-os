export function Wallpaper() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(168deg, #FCFCFA 0%, #F4F3F0 46%, #ECEBE6 100%)',
        }}
      />
      <div
        className="absolute -right-28 -top-28 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--goose-primary) 7%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute -bottom-36 -left-24 h-[32rem] w-[32rem] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--goose-accent-blue) 6%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          color: '#5B6572',
        }}
      />
    </div>
  );
}