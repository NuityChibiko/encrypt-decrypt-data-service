import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.publicKey = process.env.RSA_PUBLIC_KEY;
    this.privateKey = process.env.PRIVATE_KEY;

    if (!this.publicKey || !this.privateKey) {
      console.error('RSA keys are not loaded correctly.');
    } else {
      console.log('RSA keys are loaded successfully.');
    }
  }

  encrypt(payload: string): {
    successful: boolean;
    error_code: string | null;
    data: { data1: string; data2: string } | null;
  } {
    if (!this.publicKey) {
      return { successful: false, error_code: 'PublicKeyMissing', data: null };
    }

    try {
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      const aesEncryptor = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      let encryptedPayload = aesEncryptor.update(payload, 'utf8', 'base64');
      encryptedPayload += aesEncryptor.final('base64');

      const encryptedAesKey = crypto.publicEncrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        aesKey,
      );

      return {
        successful: true,
        error_code: null,
        data: {
          data1: encryptedAesKey.toString('base64'),
          data2: encryptedPayload,
        },
      };
    } catch (error) {
      console.error(`Encryption Error: ${error}`);
      return { successful: false, error_code: 'EncryptionFailed', data: null };
    }
  }

  decrypt(
    data1: string,
    data2: string,
  ): {
    successful: boolean;
    error_code: string | null;
    data: { payload: string } | null;
  } {
    if (!this.privateKey) {
      return { successful: false, error_code: 'PrivateKeyMissing', data: null };
    }

    try {
      const encryptedAesKey = Buffer.from(data1, 'base64');
      const decryptedAesKey = crypto.privateDecrypt(
        {
          key: this.privateKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        encryptedAesKey,
      );

      const iv = Buffer.alloc(16, 0);
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        decryptedAesKey,
        iv,
      );
      let decryptedPayload = decipher.update(data2, 'base64', 'utf8');
      decryptedPayload += decipher.final('utf8');

      return {
        successful: true,
        error_code: null,
        data: { payload: decryptedPayload },
      };
    } catch (error) {
      console.error(`Decryption Error: ${error}`);
      return { successful: false, error_code: 'DecryptionFailed', data: null };
    }
  }
}
