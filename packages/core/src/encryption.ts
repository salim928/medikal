import { secretbox, randomBytes } from "tweetnacl";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

export class EncryptionService {
  /**
   * Encrypt data with a key
   */
  static encrypt(data: string, key: Uint8Array): string {
    const nonce = randomBytes(secretbox.nonceLength);
    const ciphertext = secretbox(
      Buffer.from(data),
      nonce,
      key
    );

    const fullMessage = new Uint8Array(nonce.length + ciphertext.length);
    fullMessage.set(nonce);
    fullMessage.set(ciphertext, nonce.length);

    return encodeBase64(fullMessage);
  }

  /**
   * Decrypt data with a key
   */
  static decrypt(encryptedData: string, key: Uint8Array): string {
    const fullMessage = decodeBase64(encryptedData);
    const nonce = fullMessage.slice(0, secretbox.nonceLength);
    const ciphertext = fullMessage.slice(secretbox.nonceLength);

    const plaintext = secretbox.open(ciphertext, nonce, key);
    if (!plaintext) {
      throw new Error("Decryption failed");
    }

    return Buffer.from(plaintext).toString();
  }

  /**
   * Derive key from password
   */
  static async deriveKey(password: string, salt: Uint8Array): Promise<Uint8Array> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      data,
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      256
    );

    return new Uint8Array(derivedBits);
  }

  /**
   * Hash a value
   */
  static async hash(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}