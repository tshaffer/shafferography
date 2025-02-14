const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

import { useEffect, useState } from "react";

export function useGooglePhotosPicker() {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [tokenClient, setTokenClient] = useState<{ requestAccessToken: () => void } | null>(null);

  useEffect(() => {
    console.log("useGooglePhotosPicker invoked");

    const loadScript = (src: string, callback: () => void) => {
      if (document.querySelector(`script[src='${src}']`)) {
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

    // Load Google Identity Services API
    loadScript("https://accounts.google.com/gsi/client", () => {
      console.log("Google Identity Services API loaded");

      // Load Google API Client Library
      loadScript("https://apis.google.com/js/api.js", () => {
        console.log("Google API script loaded");

        window.gapi?.load("client", async () => {
          console.log("gapi.client loaded, initializing APIs...");

          try {
            await window.gapi.client.load("photoslibrary", "v1"); // Load Google Photos API
            console.log("Google Photos API loaded!");

            // Initialize OAuth Token Client
            const tokenClientInstance = window.google.accounts.oauth2.initTokenClient({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              scope: "https://www.googleapis.com/auth/photoslibrary.readonly " +
                "https://www.googleapis.com/auth/drive.file",
              callback: (response) => {
                if (response.error) {
                  console.error("OAuth Token Error:", response.error);
                  return;
                }
                console.log("OAuth Token received!", response.access_token);
                setAuthToken(response.access_token);
              },
            });

            setTokenClient(tokenClientInstance);
            console.log("Google Identity Services initialized!");

            // Load Picker API
            window.gapi.load("picker", () => {
              console.log("Google Picker API loaded!");

              const checkPickerLoaded = setInterval(() => {
                if (window.google?.picker) {
                  clearInterval(checkPickerLoaded);
                  setIsGoogleLoaded(true);
                  console.log("Google Picker API is now available");
                } else {
                  console.log("Waiting for google.picker...");
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

  function requestAccessToken() {
    if (!tokenClient) {
      console.error("Token client not initialized.");
      return;
    }

    tokenClient.requestAccessToken();
  }

  return { isGoogleLoaded, authToken, requestAccessToken };
}
