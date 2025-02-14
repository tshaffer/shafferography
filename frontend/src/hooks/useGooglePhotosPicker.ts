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

    // Load Google Identity Services
    loadScript("https://accounts.google.com/gsi/client", () => {
      // Load Google API Client Library
      loadScript("https://apis.google.com/js/api.js", () => {
        console.log("Google API script loaded");

        window.gapi?.load("client", async () => {
          console.log("gapi.client loaded, initializing picker API...");

          try {
            await window.gapi.client.load("photoslibrary", "v1"); // Explicitly load Photos API
            console.log("Google Photos API loaded!");

            // Wait for google.photos.picker to be available
            const checkPickerLoaded = setInterval(() => {
              if (window.google?.photos?.picker) {
                clearInterval(checkPickerLoaded);
                setIsGoogleLoaded(true);
                console.log("Google Photos Picker API is now available");
              } else {
                console.log("Waiting for google.photos.picker...");
              }
            }, 100);
          } catch (error) {
            console.error("Error loading Google Photos API:", error);
          }
        });
      });
    });
  }, []);

  return isGoogleLoaded;
}
