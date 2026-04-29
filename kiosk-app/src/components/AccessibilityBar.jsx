import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Volume2, VolumeX, Globe, Keyboard, Contrast } from "lucide-react";
import { useLanguage } from '../context/LanguageContext';
import { useAccessibilityContext } from '../context/AccessibilityContext';
import { useKeyboard } from '../context/KeyboardContext';

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "as", label: "অসমীয়া" },
  { code: "hi", label: "हिन्दी" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.4;
const STEP = 0.1;

export default function AccessibilityBar() {
  const { lang, setLang, t } = useLanguage();
  const { 
    displayMode, setDisplayMode, 
    screenReaderEnabled, toggleScreenReader, announce 
  } = useAccessibilityContext();
  const { isOpen, openKeyboard } = useKeyboard();

  /* ── Font Scale ────────────────────────────────── */
  const [fontScale, setFontScale] = useState(() => {
    const saved = localStorage.getItem("kiosk-font-scale");
    return saved ? parseFloat(saved) : 1;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 16}px`;
    localStorage.setItem("kiosk-font-scale", String(fontScale));
  }, [fontScale]);

  const increaseFont = useCallback(() => {
    setFontScale((prev) => Math.min(prev + STEP, MAX_SCALE));
  }, []);

  const decreaseFont = useCallback(() => {
    setFontScale((prev) => Math.max(prev - STEP, MIN_SCALE));
  }, []);

  const resetFont = useCallback(() => {
    setFontScale(1);
  }, []);

  /* ── Handlers ───────────────────────────────────── */
  const toggleDark = () => {
    if (displayMode === 'dark') {
      setDisplayMode('light');
    } else {
      setDisplayMode('dark');
    }
  };

  const toggleHighContrast = () => {
    if (displayMode === 'high-contrast') {
      setDisplayMode('light');
    } else {
      setDisplayMode('high-contrast');
    }
  };

  /* ── Render ─────────────────────────────────────── */
  return (
    <div
      className="a11y-bar"
      role="toolbar"
      aria-label="Accessibility controls"
    >
      {/* Theme Toggles */}
      <div className="a11y-group" role="group" aria-label="Theme controls">
        <button
          className={`a11y-btn ${displayMode === 'dark' ? 'a11y-btn--active' : ''}`}
          onClick={toggleDark}
          aria-label={displayMode === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
          title={displayMode === 'dark' ? t('light') || 'Light' : t('dark') || 'Dark'}
          aria-pressed={displayMode === 'dark'}
        >
          {displayMode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="a11y-btn-text hidden sm:inline">{displayMode === 'dark' ? t('light') || 'Light' : t('dark') || 'Dark'}</span>
        </button>

        <button
          className={`a11y-btn ${displayMode === 'high-contrast' ? 'a11y-btn--active' : ''}`}
          onClick={toggleHighContrast}
          aria-label="Toggle high contrast mode"
          title="High Contrast"
          aria-pressed={displayMode === 'high-contrast'}
        >
          <Contrast size={16} />
          <span className="a11y-btn-text hidden sm:inline">High Contrast</span>
        </button>
      </div>

      {/* Divider */}
      <span className="a11y-divider" aria-hidden="true" />

      {/* Font Controls */}
      <div className="a11y-group" role="group" aria-label="Font size controls">
        <button
          className="a11y-btn"
          onClick={increaseFont}
          aria-label="Increase font size"
          title="Increase font size"
          disabled={fontScale >= MAX_SCALE}
        >
          <span className="a11y-font-icon">+A</span>
        </button>
        <button
          className="a11y-btn a11y-btn--active"
          onClick={resetFont}
          aria-label="Reset font size"
          title="Reset font size"
        >
          <span className="a11y-font-icon a11y-font-icon--lg">A</span>
        </button>
        <button
          className="a11y-btn"
          onClick={decreaseFont}
          aria-label="Decrease font size"
          title="Decrease font size"
          disabled={fontScale <= MIN_SCALE}
        >
          <span className="a11y-font-icon">-A</span>
        </button>
      </div>

      {/* Divider */}
      <span className="a11y-divider" aria-hidden="true" />

      {/* Screen Reader */}
      <button
        className={`a11y-btn ${screenReaderEnabled ? "a11y-btn--on" : ""}`}
        onClick={() => {
          toggleScreenReader();
          setTimeout(() => {
            if (!screenReaderEnabled) {
              announce("Screen reader enabled. Use arrow keys to navigate. Focus will be announced automatically.");
            }
          }, 100);
        }}
        aria-label={
          screenReaderEnabled ? "Disable screen reader" : "Enable screen reader"
        }
        aria-pressed={screenReaderEnabled}
        title="Screen Reader"
      >
        {screenReaderEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        <span className="a11y-btn-text hidden sm:inline">Screen Reader</span>
      </button>

      {/* Divider */}
      <span className="a11y-divider" aria-hidden="true" />

      {/* On-Screen Keyboard Toggle */}
      <button
        className={`a11y-btn ${isOpen ? 'a11y-btn--on' : ''}`}
        onClick={() => openKeyboard({ currentValue: '', max: 999, onCommit: () => {} })}
        aria-label="Open on-screen keyboard"
        title="On-screen Keyboard"
      >
        <Keyboard size={16} />
        <span className="a11y-btn-text hidden sm:inline">Keyboard</span>
      </button>

      {/* Divider */}
      <span className="a11y-divider" aria-hidden="true" />

      {/* Language Selector */}
      <div className="a11y-lang-wrap">
        <Globe size={16} aria-hidden="true" />
        <select
          className="a11y-lang-select"
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          aria-label="Select language"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
