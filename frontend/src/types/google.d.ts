declare global {
  interface Window {
    google: typeof google;
  }

  namespace google {
    namespace photos {
      namespace picker {
        function configure(config: {
          apiKey: string;
          clientId: string;
          appId: string;
          scopes: string[];
        }): void;

        function selectMedia(config: {
          mediaType: "photos" | "videos";
          multiSelect?: boolean;
          onSelect: (photos: any[]) => void;
        }): void;
      }
    }
  }
}

export {};
