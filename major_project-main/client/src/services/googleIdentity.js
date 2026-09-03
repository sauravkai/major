const GIS_SRC = 'https://accounts.google.com/gsi/client';

export const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
export const isGoogleAuthEnabled = Boolean(googleClientId);

let scriptPromise = null;

const loadGis = () => {
  if (window.google?.accounts?.id) return Promise.resolve(window.google);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Failed to load Google sign-in'));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Resolve with a Google ID token; the server verifies it, so nothing here is trusted.
 */
export const requestGoogleCredential = async () => {
  if (!isGoogleAuthEnabled) {
    throw new Error('Google sign-in is not configured for this deployment');
  }

  const google = await loadGis();

  return new Promise((resolve, reject) => {
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) =>
        credential ? resolve(credential) : reject(new Error('Google sign-in was cancelled')),
    });

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        reject(new Error('Google sign-in was dismissed'));
      }
    });
  });
};
