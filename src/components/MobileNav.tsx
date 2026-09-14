import type { TabId } from '../audio/types';

const TABS: { id: TabId; label: string; icon: 'editor' | 'effects' | 'eq' | 'presets' | 'export' }[] = [
  { id: 'editor', label: 'Editor', icon: 'editor' },
  { id: 'effects', label: 'Effects', icon: 'effects' },
  { id: 'eq', label: 'EQ', icon: 'eq' },
  { id: 'presets', label: 'Presets', icon: 'presets' },
  { id: 'export', label: 'Export', icon: 'export' },
];

function NavIcon({ name, active }: { name: (typeof TABS)[number]['icon']; active: boolean }) {
  const stroke = active ? 'currentColor' : 'currentColor';
  const common = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'editor':
      return (
        <svg {...common}>
          <path d="M4 8h16M4 12h10M4 16h13" />
          <circle cx="18" cy="12" r="2" fill={active ? 'currentColor' : 'none'} />
        </svg>
      );
    case 'effects':
      return (
        <svg {...common}>
          <path d="M12 3v18M5 8l14 8M5 16l14-8" />
        </svg>
      );
    case 'eq':
      return (
        <svg {...common}>
          <path d="M6 18V10M12 18V6M18 18v-7" />
          <circle cx="6" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="12" cy="4" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="9" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case 'presets':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="14" rx="2.5" />
          <path d="M8 9h8M8 12h5M8 15h7" />
        </svg>
      );
    case 'export':
      return (
        <svg {...common}>
          <path d="M12 4v10" />
          <path d="M8 10l4 4 4-4" />
          <path d="M5 18h14" />
        </svg>
      );
  }
}

export function MobileNav({ tab, onChange }: { tab: TabId; onChange: (t: TabId) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`nav-item ${tab === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="nav-icon">
            <NavIcon name={t.icon} active={tab === t.id} />
          </span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
