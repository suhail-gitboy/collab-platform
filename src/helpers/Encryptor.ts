import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
    private readonly algorithm = 'aes-256-gcm';

    private getKey(): Buffer {
        const key = process.env.ENCRYPTION_KEY;

        if (!key) {
            throw new Error('ENCRYPTION_KEY is not configured');
        }

        const buffer = Buffer.from(key, 'hex');

        if (buffer.length !== 32) {
            throw new Error(
                'ENCRYPTION_KEY must be exactly 32 bytes',
            );
        }

        return buffer;
    }

    encrypt(text: string): string {
        const iv = crypto.randomBytes(12);

        const cipher = crypto.createCipheriv(
            this.algorithm,
            this.getKey(),
            iv,
        );

        const encrypted = Buffer.concat([
            cipher.update(text, 'utf8'),
            cipher.final(),
        ]);

        const authTag = cipher.getAuthTag();

        return [
            iv.toString('hex'),
            authTag.toString('hex'),
            encrypted.toString('hex'),
        ].join(':');
    }

    decrypt(encryptedText: string): string {
        const [ivHex, authTagHex, encryptedHex] =
            encryptedText.split(':');

        if (!ivHex || !authTagHex || !encryptedHex) {
            throw new Error('Invalid encrypted token format');
        }

        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.getKey(),
            Buffer.from(ivHex, 'hex'),
        );

        decipher.setAuthTag(
            Buffer.from(authTagHex, 'hex'),
        );

        const decrypted = Buffer.concat([
            decipher.update(
                Buffer.from(encryptedHex, 'hex'),
            ),
            decipher.final(),
        ]);

        return decrypted.toString('utf8');
    }
}