export function Wallpaper() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(155deg, var(--goose-bg) 0%, color-mix(in srgb, var(--goose-accent-blue) 14%, var(--goose-bg)) 48%, color-mix(in srgb, var(--goose-primary) 12%, var(--goose-bg)) 100%)',
        }}
      />
      <div
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--goose-accent-blue), transparent 70%)' }}
      />
      <div
        className="absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--goose-primary), transparent 70%)' }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          color: 'var(--goose-fg)',
        }}
      />
    </div>
  );
}