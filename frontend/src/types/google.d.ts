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
      picker: {
        PickerBuilder: new () => {
          setOAuthToken: (token: string) => any;
          setAppId: (clientId: string) => any;
          addView: (view: any) => any;
          setCallback: (callback: (data: any) => void) => any;
          build: () => { setVisible: (visible: boolean) => void };
        };
        ViewId: {
          PHOTOS: string;
          PHOTO_ALBUMS: string;
        };
        Action: {
          PICKED: string;
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
    
    namespace picker {
      class PickerBuilder {
        setOAuthToken(token: string): this;
        setAppId: (clientId: string) => any;
        addView(view: any): this;
        setCallback(callback: (data: any) => void): this;
        build(): { setVisible: (visible: boolean) => void };
      }

      const ViewId: {
        PHOTOS: string;
        PHOTO_ALBUMS: string;
      };

      const Action: {
        PICKED: string;
      };
    }
  }
}

export { };
