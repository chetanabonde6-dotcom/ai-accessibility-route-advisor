import { useRef } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Check, X, Info } from 'lucide-react';
export function Magnetic({ children, className = '', ...props }) {
  const ref = useRef(null);
  const move = event => {
    if (
      !window.matchMedia(
        '(pointer: fine) and (prefers-reduced-motion: no-preference)'
      ).matches
    )
      return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (event.clientX - r.left - r.width / 2) * 0.09,
      y: (event.clientY - r.top - r.height / 2) * 0.12,
      duration: 0.3,
      overwrite: true,
    });
  };
  return (
    <a
      ref={ref}
      className={`button ${className}`}
      onPointerMove={move}
      onPointerLeave={() =>
        gsap.to(ref.current, {
          x: 0,
          y: 0,
          duration: 0.4,
          overwrite: true,
        })
      }
      {...props}
    >
      {children}
    </a>
  );
}
export function SectionHeading({ index, label, title, children }) {
  return (
    <div className="section-heading reveal">
      <div>
        <p className="eyebrow">
          <span>{index} /</span> {label}
        </p>
        <h2>{title}</h2>
      </div>
      {children && <p className="section-description">{children}</p>}
    </div>
  );
}
export function DemoNote({ children, className = '' }) {
  return (
    <div className={`demo-note ${className}`}>
      <Info size={15} aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}
export function CheckMark({ checked }) {
  return (
    <span
      className={`checkbox-mark ${checked ? 'checked' : ''}`}
      aria-hidden="true"
    >
      {checked && <Check size={12} strokeWidth={3} />}
    </span>
  );
}
export function Arrow({ size = 18 }) {
  return <ArrowUpRight size={size} aria-hidden="true" />;
}
export function CloseButton({ onClick, label = 'Close' }) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      onClick={onClick}
    >
      <X size={20} />
    </button>
  );
}

