import type { TabId } from '../audio/types';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'editor', label: 'Editor', icon: '🎚️' },
  { id: 'effects', label: 'Effects', icon: '✨' },
  { id: 'eq', label: 'EQ', icon: '📊' },
  { id: 'presets', label: 'Presets', icon: '🎵' },
  { id: 'export', label: 'Export', icon: '💾' },
];

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
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
