import * as cryptojs from 'crypto-js';

export class CommonUtils {
    private secretKey: string;
    constructor() { 
        this.secretKey = process.env.SECRET_KEY|| '';
    }

    /**
     * returns data in in decrypted format
     * @param data 
     * 
     */
    public getEncryptedData(data:string): string {
       return cryptojs.AES.encrypt(data, this.secretKey).toString();
    }


    /**
     * returns data in in decrypted format
     * @param data 
     * 
     */
    public getDecryptedData(data:string): string {
       return cryptojs.AES.decrypt(data, this.secretKey).toString(cryptojs.enc.Utf8);
    }

public getRandomValue(length?: number, isString?: true): string;
public getRandomValue(length?: number, isString?: false): number;
public getRandomValue(length = 10, isString = true): string | number {
  if (isString) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomValues = crypto.getRandomValues(new Uint32Array(length));    
    return Array.from(randomValues).map(v=> chars[v % chars.length]).join("");
  } else {
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    const numStr = Array.from(randomValues).map(v => v % 10).join("");
    return Number(numStr);
  }
}

}
