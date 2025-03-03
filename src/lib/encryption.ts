
/**
 * Encryption utilities for sensitive data
 * 
 * This utility uses the Web Crypto API to encrypt and decrypt sensitive data
 * before storing it in the database or localStorage
 */

// Generate a random encryption key or use an existing one
const getEncryptionKey = async (): Promise<CryptoKey> => {
  // Check if we have a stored key in sessionStorage (only lives for the session duration)
  const storedKey = sessionStorage.getItem('linok-encryption-key');
  
  if (storedKey) {
    // Convert the stored key back to a CryptoKey
    const importedKey = await window.crypto.subtle.importKey(
      'jwk',
      JSON.parse(storedKey),
      { name: 'AES-GCM' },
      false, // not extractable
      ['encrypt', 'decrypt']
    );
    return importedKey;
  }
  
  // Generate a new key
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  
  // Export the key to save it
  const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
  sessionStorage.setItem('linok-encryption-key', JSON.stringify(exportedKey));
  
  return key;
};

// Convert string to buffer
const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Encrypts a string value
 * @param value The string to encrypt
 * @returns The encrypted string in base64 format with IV
 */
export const encryptData = async (value: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    
    // Generate a random initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const data = encoder.encode(value);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );
    
    // Combine the IV and encrypted data and convert to base64
    const combined = new Uint8Array(iv.length + encryptedData.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedData), iv.length);
    
    return btoa(String.fromCharCode(...new Uint8Array(combined)));
  } catch (error) {
    console.error('Encryption failed:', error);
    return value; // Fallback to unencrypted value
  }
};

/**
 * Decrypts an encrypted string
 * @param encryptedValue The encrypted string in base64 format with IV
 * @returns The decrypted string
 */
export const decryptData = async (encryptedValue: string): Promise<string> => {
  try {
    // Convert from base64 to array buffer
    const combined = new Uint8Array(
      atob(encryptedValue)
        .split('')
        .map(char => char.charCodeAt(0))
    );
    
    // Extract the IV and encrypted data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);
    
    const key = await getEncryptionKey();
    
    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      encryptedData
    );
    
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedValue; // Return the encrypted value if decryption fails
  }
};

/**
 * Securely stores data in localStorage with encryption
 * @param key The key to store the data under
 * @param value The value to store
 */
export const secureStore = async (key: string, value: string): Promise<void> => {
  const encrypted = await encryptData(value);
  localStorage.setItem(`linok-secure-${key}`, encrypted);
};

/**
 * Retrieves and decrypts data from localStorage
 * @param key The key the data is stored under
 * @returns The decrypted value or null if not found
 */
export const secureRetrieve = async (key: string): Promise<string | null> => {
  const encrypted = localStorage.getItem(`linok-secure-${key}`);
  if (!encrypted) return null;
  
  return await decryptData(encrypted);
};

/**
 * Removes a secure item from localStorage
 * @param key The key to remove
 */
export const secureRemove = (key: string): void => {
  localStorage.removeItem(`linok-secure-${key}`);
};

/**
 * Utility function to encrypt sensitive data before saving to the database
 * @param data The data object containing fields to encrypt
 * @param fieldsToEncrypt Array of field names to encrypt
 * @returns A new object with encrypted values for the specified fields
 */
export const encryptObjectFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): Promise<T> => {
  const encryptedData = { ...data };
  
  for (const field of fieldsToEncrypt) {
    if (data[field] && typeof data[field] === 'string') {
      encryptedData[field] = await encryptData(data[field] as string) as any;
    }
  }
  
  return encryptedData;
};

/**
 * Utility function to decrypt sensitive data retrieved from the database
 * @param data The data object containing encrypted fields
 * @param fieldsToDecrypt Array of field names to decrypt
 * @returns A new object with decrypted values for the specified fields
 */
export const decryptObjectFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): Promise<T> => {
  const decryptedData = { ...data };
  
  for (const field of fieldsToDecrypt) {
    if (data[field] && typeof data[field] === 'string') {
      decryptedData[field] = await decryptData(data[field] as string) as any;
    }
  }
  
  return decryptedData;
};
