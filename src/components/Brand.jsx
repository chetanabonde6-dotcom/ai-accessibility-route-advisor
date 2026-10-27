export default function Brand() {
  return (
    <a className="brand" href="#home" aria-label="AI Accessibility Route Advisor home">
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" fillOpacity=".09" stroke="currentColor" strokeOpacity=".3" />
        <path d="M11 28V17a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6h-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="11" cy="28" r="3" fill="currentColor" />
        <circle cx="29" cy="12" r="3.5" fill="#a9c8ff" stroke="#111c32" strokeWidth="1.5" />
      </svg>
      <span className="brand-name">AI Accessibility<span>Route Advisor</span></span>
    </a>
  );
}

