import { useEffect, useState } from "react";

export function useGooglePhotosPicker() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {

    console.log("useGooglePhotosPicker invoked");

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

    console.log("invoke loadScript");

    // Load Google Auth API first
    loadScript("https://accounts.google.com/gsi/client", () => {
      // Load Google API
      loadScript("https://apis.google.com/js/api.js", () => {
        console.log("Google API script loaded, checking for google.photos.picker...");

        // Check for google.photos.picker at intervals
        const checkPickerLoaded = setInterval(() => {
          if (window.google?.photos?.picker) {
            clearInterval(checkPickerLoaded);
            setIsGoogleLoaded(true);
            console.log("Google Photos Picker API is now available");
          } else {
            console.log("Waiting for google.photos.picker...");
          }
        }, 100); // Check every 100ms
      });
    });
  }, []);

  return isGoogleLoaded;
}
