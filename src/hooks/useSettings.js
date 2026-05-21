import { useEffect } from 'react';
import { useContent } from './useContent';

export default function useSettings() {
  const { data: settings, loading } = useContent('/api/content/settings');

  useEffect(() => {
    if (settings) {
      const root = document.documentElement;
      if (settings.primary_color) root.style.setProperty('--color-primary', settings.primary_color);
      if (settings.secondary_color) root.style.setProperty('--color-secondary', settings.secondary_color);
      if (settings.body_font) root.style.setProperty('--font-body', `"${settings.body_font}", sans-serif`);
      if (settings.heading_font) root.style.setProperty('--font-heading', `"${settings.heading_font}", serif`);
    }
  }, [settings]);

  return { settings, loading };
}
