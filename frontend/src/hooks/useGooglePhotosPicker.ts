import { useEffect, useState } from "react";

export function useGooglePhotosPicker() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

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

        window.gapi?.load("client:auth2", async () => {
          console.log("gapi.client and auth2 loaded, initializing APIs...");

          const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
          const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
          try {
            await window.gapi.client.init({
              apiKey,
              clientId,
              discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/photoslibrary/v1/rest"],
              scope: "https://www.googleapis.com/auth/photoslibrary.readonly",
            });

            console.log("Google Photos API initialized!");

            const authInstance = window.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
              await authInstance.signIn();
            }
            const token = authInstance.currentUser.get().getAuthResponse().access_token;
            setAuthToken(token);
            console.log("User authenticated, access token received!");

            // Load Picker API
            window.gapi.load("picker", () => {
              console.log("Google Picker API loaded!");

              const checkPickerLoaded = setInterval(() => {
                if (window.gapi?.picker) {
                  clearInterval(checkPickerLoaded);
                  setIsGoogleLoaded(true);
                  console.log("Google Picker API is now available in gapi.picker");
                } else {
                  console.log("Waiting for gapi.picker...");
                }
              }, 100);
            });
          } catch (error) {
            console.error("Error initializing Google APIs:", error);
          }
        });
      });
    });
  }, []);

  return { isGoogleLoaded, authToken };
}
