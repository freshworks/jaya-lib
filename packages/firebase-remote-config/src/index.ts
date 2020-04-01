import axios from 'axios';
import { google } from 'googleapis';
import { Credentials } from 'google-auth-library';

export interface RemoteConfigData {
  parameters: {
    [key: string]: {
      defaultValue: {
        value: string;
      };
    };
  };
  version: {
    updateOrigin: string;
    updateTime: string;
    updateType: string;
    updateUser: {
      email: string;
    };
    versionNumber: number;
  };
}

export default class RemoteConfig {
  projectId = '';

  privateKey = '';

  clientEmail = '';

  HOST = 'https://firebaseremoteconfig.googleapis.com';

  SCOPES = ['https://www.googleapis.com/auth/firebase.remoteconfig'];

  PATH = '';

  init(projectId: string, privateKey: string, clientEmail: string) {
    this.projectId = projectId;
    this.privateKey = privateKey;
    this.clientEmail = clientEmail;
    this.PATH = `/v1/projects/${projectId}/remoteConfig`;
  }

  /**
   * Get a valid access token.
   */
  private getAccessToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const jwtClient = new google.auth.JWT(this.clientEmail, undefined, this.privateKey, this.SCOPES, undefined);
      jwtClient.authorize((err: Error | null, tokens: Credentials | undefined) => {
        if (err) {
          reject(err);
          return;
        }

        if (tokens && tokens.access_token) {
          resolve(tokens.access_token);
        }

        reject();
      });
    });
  }

  /**
   * Retrieve the current Firebase Remote Config template from the server. Once
   * retrieved the template is stored locally in a file named `config.json`.
   */
  public async getTemplate(): Promise<RemoteConfigData> {
    const accessToken = await this.getAccessToken();
    const response = await axios.get(this.HOST + this.PATH, {
      headers: {
        'Accept-Encoding': 'gzip',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
}
