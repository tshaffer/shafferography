import { useEffect, useState } from "react";

export function useGooglePhotosPicker() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (src: string, callback: () => void) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        callback(); // Script already loaded
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = callback;
      document.body.appendChild(script);
    };

    // Load the Google API scripts sequentially
    loadScript("https://accounts.google.com/gsi/client", () => {
      loadScript("https://apis.google.com/js/api.js", () => {
        setIsGoogleLoaded(true);
      });
    });
  }, []);

  return isGoogleLoaded;
}
