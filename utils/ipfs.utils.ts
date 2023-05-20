import axios from 'axios';
import { create as ipfsClient, IPFSHTTPClient } from 'ipfs-http-client';
import { IPFS_BASE_URL, IPFS_HOST, IPFS_UPLOAD_SERVER_URL } from '../constants';

export class IPFSUtils {
  private static _client: IPFSHTTPClient;

  static get client(): IPFSHTTPClient {
    if (this._client) return this._client;

    this._client = ipfsClient({
      host: IPFS_HOST,
      protocol: 'https',
    });

    return this._client;
  }

  public static uploadDataToIPFS({
    data,
    onSuccess,
    onError,
  }: {
    data: any;
    onSuccess?: (url: string) => any;
    onError?: any;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      axios
        .post(IPFS_UPLOAD_SERVER_URL + '/upload', {
          data,
        })
        .then(async (res: any) => {
          const url = res.data.hash;
          if (onSuccess) await onSuccess(url);
          resolve(url);
        })
        .catch(async (err: any) => {
          if (onError) await onError(err);
          reject();
        });
    });
  }

  public static uploadFileToIPFS({
    file,
    onSuccess,
    onError,
  }: {
    file: File;
    onSuccess?: (url: string) => any;
    onError?: any;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const body = new FormData();
      body.append('file', file);
      axios
        .post(IPFS_UPLOAD_SERVER_URL + '/uploadFile', body)
        .then(async (res: any) => {
          const url = IPFS_BASE_URL + res.data.hash;
          if (onSuccess) await onSuccess(url);
          resolve(url);
          return url;
        })
        .catch(async (err: any) => {
          if (onError) await onError(err);
          reject();
          throw 'Upload failed';
        });
    });
  }

  public static async getDataFromIPFS(hash: string) {
    try {
      let res = await axios.get(IPFS_BASE_URL + hash);
      return res.data;
    } catch (e) {
      throw e;
    }
  }

  public static async getDataByCID(cid: string) {
    const stream = IPFSUtils.client.cat(cid);
    let data = '';
    // eslint-disable-next-line no-restricted-syntax
    for await (const chunk of stream) {
      data += new TextDecoder().decode(chunk);
    }

    return data;
  }
}
