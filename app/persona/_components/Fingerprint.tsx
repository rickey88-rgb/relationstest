export default function Fingerprint({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 120 140" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" aria-hidden="true">
    <path d="M18 50C20 26 37 12 60 12s42 17 42 42" />
    <path d="M10 70V58C10 27 31 3 60 3s51 24 51 55v20" />
    <path d="M21 89c4-12 6-24 6-35 0-19 14-33 33-33s33 14 33 33c0 34 6 48 13 60" />
    <path d="M9 97c8-15 9-26 9-40M17 113c13-18 19-36 19-57 0-14 10-26 24-26s25 12 25 26c0 35 5 55 15 70" />
    <path d="M27 125c14-22 18-41 18-69 0-9 6-17 15-17s16 8 16 17c0 37 4 58 16 78" />
    <path d="M38 132c14-26 16-45 16-76 0-4 2-8 6-8s7 4 7 8c0 39 4 62 16 80" />
    <path d="M49 136c12-27 12-50 12-78M61 113c1 10 4 19 8 26M60 127l-1 12M100 85c0-9 0-18 1-26M93 101c2 11 5 18 9 24" />
  </svg>;
}
