declare global {
  interface Window {
    google: typeof google & {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string; error?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    gapi: any;
  }

  namespace google {
    namespace accounts {
      namespace oauth2 {
        interface TokenClient {
          requestAccessToken: () => void;
        }

        function initTokenClient(config: {
          client_id: string;
          scope: string;
          callback: (response: { access_token: string; error?: string }) => void;
        }): TokenClient;
      }
    }
    
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

export { };
