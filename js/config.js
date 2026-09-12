// ==============================================================================
// NUTRILEARN - APPLICATION CONFIGURATION (.env LOADER)
// ==============================================================================
// SECURE CONFIGURATION:
// Walang hardcoded na credentials dito. Lahat ay binabasa nang direkta mula
// sa .env file para manatiling secure at protektado ang iyong API keys.
// ==============================================================================

window.NUTRI_CONFIG = {
  // Lahat ay default sa blanko / null. Binabasa lamang mula sa .env
  SUPABASE_URL: '',
  SUPABASE_ANON_KEY: '',
  ENVIRONMENT: '',

  // Flag kung matagumpay na na-load ang .env
  isLoaded: false,

  // Helper para i-verify kung kumpleto ang credentials mula sa .env
  isConfigured() {
    return (
      Boolean(this.SUPABASE_URL) &&
      Boolean(this.SUPABASE_ANON_KEY) &&
      this.isLoaded
    );
  }
};

// ==============================================================================
// DYNAMIC .env LOADER
// Binabasa at pina-parse ang .env file sa runtime nang hindi inilalantad sa code
// ==============================================================================
(async function loadEnvFile() {
  try {
    // Subukan i-fetch ang .env file (relatibo sa root ng project)
    const response = await fetch('.env', { cache: 'no-store' });
    
    if (!response.ok) {
      console.warn('⚠️ [Config] Hindi ma-load ang .env file. HTTP status:', response.status);
      return;
    }

    const text = await response.text();
    const lines = text.split(/\r?\n/);

    lines.forEach(line => {
      const trimmed = line.trim();
      // Laktawan ang comments (#) at blank lines
      if (!trimmed || trimmed.startsWith('#')) return;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();

        // Tanggalin ang quotes kung meron (" o ')
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1).trim();
        }

        // Ilagay lamang kung valid config property
        if (key in window.NUTRI_CONFIG) {
          window.NUTRI_CONFIG[key] = value;
        }
      }
    });

    window.NUTRI_CONFIG.isLoaded = true;
    console.log('🔒 [Config] Matagumpay na na-load ang credentials mula sa .env reference.');

    // I-broadcast na handa na ang config para sa supabaseClient.js
    window.dispatchEvent(
      new CustomEvent('nutriConfigReady', { detail: window.NUTRI_CONFIG })
    );

  } catch (err) {
    console.warn('⚠️ [Config] Hindi mabasa ang .env. Siguraduhin na tumatakbo ang app sa local server (hal. python server / localhost).', err.message);
  }
})();
