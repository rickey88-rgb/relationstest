import styles from "../_styles/design.module.css";

/** The approved homepage mark; decorative next to the visible brand name. */
export default function Brand({ className = styles.brand, markClassName = styles.brandMark }: {
  className?: string;
  markClassName?: string;
}) {
  return <div className={className}>
    <svg className={markClassName} viewBox="0 0 44 36" fill="none" aria-hidden="true" focusable="false">
      <path d="M17 29 5.5 17.5C-2 10 8 1 17 10c9-9 19 0 11.5 7.5Z" fill="#D7E0D6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M27 29 15.5 17.5C8 10 18 1 27 10c9-9 19 0 11.5 7.5Z" fill="#E9D1CF" fillOpacity=".65" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
    Relationsvarning
  </div>;
}
