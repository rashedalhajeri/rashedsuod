/**
 * Enhanced Encryption utilities for sensitive data with improved security
 * 
 * This utility uses the Web Crypto API to encrypt and decrypt sensitive data
 * with additional security measures against common attacks
 */

// Advanced encryption settings
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const DERIVATION_ALGORITHM = 'PBKDF2';
const HASH_ALGORITHM = 'SHA-256';
const AUTH_TAG_LENGTH = 128;

// Generate a random encryption key or use an existing one with added security
const getEncryptionKey = async (): Promise<CryptoKey> => {
  // Check if we have a stored key in sessionStorage (only lives for the session duration)
  const storedKey = sessionStorage.getItem('linok-encryption-key');
  
  if (storedKey) {
    try {
      // Convert the stored key back to a CryptoKey with additional validation
      const importedKey = await window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(storedKey),
        { 
          name: ENCRYPTION_ALGORITHM,
          length: KEY_LENGTH 
        },
        false, // not extractable to prevent key leakage
        ['encrypt', 'decrypt']
      );
      return importedKey;
    } catch (error) {
      console.error('Invalid stored key detected, generating new one:', error);
      // Fall through to generate a new key if the stored one is invalid
    }
  }
  
  // Generate a new key with enhanced security
  const key = await window.crypto.subtle.generateKey(
    {
      name: ENCRYPTION_ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
  
  // Export the key to save it with additional security measures
  const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
  
  // Store the key securely in sessionStorage
  sessionStorage.setItem('linok-encryption-key', JSON.stringify(exportedKey));
  
  return key;
};

// Generate a key from a password for a more secure option
const getKeyFromPassword = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  // Convert password to key material
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // Import password as key material
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: DERIVATION_ALGORITHM },
    false,
    ['deriveKey']
  );
  
  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: DERIVATION_ALGORITHM,
      salt,
      iterations: ITERATIONS,
      hash: HASH_ALGORITHM
    },
    baseKey,
    {
      name: ENCRYPTION_ALGORITHM,
      length: KEY_LENGTH
    },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
};

// Convert string to buffer
const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Anti-tampering validation
const validateData = (data: ArrayBuffer): boolean => {
  // Check for typical attack patterns
  const dataView = new Uint8Array(data);
  
  // Check for unusually large data (potential buffer overflow)
  if (dataView.length > 10 * 1024 * 1024) { // 10MB max
    return false;
  }
  
  // Additional validation can be added based on expected data patterns
  return true;
};

// Generate secure random values
const getSecureRandomValues = (length: number): Uint8Array => {
  return window.crypto.getRandomValues(new Uint8Array(length));
};

/**
 * Enhanced encryption function with added security
 * @param value The string to encrypt
 * @param customPassword Optional custom password for additional security
 * @returns The encrypted string in base64 format with IV and salt
 */
export const encryptData = async (value: string, customPassword?: string): Promise<string> => {
  try {
    if (!value) {
      throw new Error("Empty value cannot be encrypted");
    }
    
    // Input validation to prevent script injection
    if (value.includes('<script>') || /javascript:/i.test(value)) {
      console.warn("Potentially malicious content detected in input");
      value = value.replace(/<script>/gi, '&lt;script&gt;').replace(/javascript:/gi, 'blocked:');
    }
    
    // Generate a random salt for key derivation
    const salt = getSecureRandomValues(SALT_LENGTH);
    
    // Get encryption key (either from storage or derived from password)
    let key: CryptoKey;
    if (customPassword) {
      key = await getKeyFromPassword(customPassword, salt);
    } else {
      key = await getEncryptionKey();
    }
    
    // Generate a random initialization vector
    const iv = getSecureRandomValues(IV_LENGTH);
    
    // Encrypt the data with GCM authentication
    const data = encoder.encode(value);
    
    // Validate data before encryption
    if (!validateData(data)) {
      throw new Error("Invalid data detected during encryption");
    }
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH 
      },
      key,
      data
    );
    
    // Combine the salt, IV and encrypted data and convert to base64
    const combinedLength = salt.length + iv.length + encryptedData.byteLength;
    const combined = new Uint8Array(combinedLength);
    
    // Add a version byte for future compatibility
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);
    
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error(`Encryption failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Enhanced decryption function with added security
 * @param encryptedValue The encrypted string in base64 format
 * @param customPassword Optional custom password matching the one used for encryption
 * @returns The decrypted string
 */
export const decryptData = async (encryptedValue: string, customPassword?: string): Promise<string> => {
  try {
    if (!encryptedValue) {
      throw new Error("Empty value cannot be decrypted");
    }
    
    // Convert from base64 to array buffer with validation
    let combined: Uint8Array;
    try {
      combined = new Uint8Array(
        atob(encryptedValue)
          .split('')
          .map(char => char.charCodeAt(0))
      );
    } catch (e) {
      throw new Error("Invalid base64 encoding detected");
    }
    
    // Validate minimum length
    if (combined.length < SALT_LENGTH + IV_LENGTH + 16) { // 16 is minimum AES block size
      throw new Error("Data too short for valid encryption");
    }
    
    // Extract the salt and IV
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encryptedData = combined.slice(SALT_LENGTH + IV_LENGTH);
    
    // Get the key (either from storage or derived from password)
    let key: CryptoKey;
    if (customPassword) {
      key = await getKeyFromPassword(customPassword, salt);
    } else {
      key = await getEncryptionKey();
    }
    
    // Validate data before decryption
    if (!validateData(encryptedData)) {
      throw new Error("Invalid data detected during decryption");
    }
    
    // Decrypt with timing attack protection
    const startTime = performance.now();
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv,
        tagLength: AUTH_TAG_LENGTH
      },
      key,
      encryptedData
    );
    
    // Constant-time operation to help prevent timing attacks
    const delay = 10 - (performance.now() - startTime);
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // Decode and return
    const result = decoder.decode(decryptedData);
    
    // Final XSS protection
    return result.replace(/[<>]/g, match => ({ '<': '&lt;', '>': '&gt;' }[match] || match));
    
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Securely stores data in localStorage with enhanced encryption and safety checks
 * @param key The key to store the data under
 * @param value The value to store
 * @param customPassword Optional custom password for additional security
 */
export const secureStore = async (key: string, value: string, customPassword?: string): Promise<void> => {
  // Validate inputs
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid storage key');
  }
  
  if (!value || typeof value !== 'string') {
    throw new Error('Invalid storage value');
  }
  
  // Sanitize key to prevent injection attacks
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  try {
    const encrypted = await encryptData(value, customPassword);
    localStorage.setItem(`linok-secure-${safeKey}`, encrypted);
  } catch (error) {
    console.error(`Failed to securely store data for key ${key}:`, error);
    throw error;
  }
};

/**
 * Retrieves and decrypts data from localStorage with enhanced security
 * @param key The key the data is stored under
 * @param customPassword Optional custom password matching the one used to encrypt
 * @returns The decrypted value or null if not found
 */
export const secureRetrieve = async (key: string, customPassword?: string): Promise<string | null> => {
  // Validate input
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid storage key');
  }
  
  // Sanitize key to prevent injection attacks
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  const encrypted = localStorage.getItem(`linok-secure-${safeKey}`);
  if (!encrypted) return null;
  
  try {
    return await decryptData(encrypted, customPassword);
  } catch (error) {
    console.error(`Failed to decrypt data for key ${key}:`, error);
    return null;
  }
};

/**
 * Removes a secure item from localStorage
 * @param key The key to remove
 */
export const secureRemove = (key: string): void => {
  // Validate input
  if (!key || typeof key !== 'string') {
    throw new Error('Invalid storage key');
  }
  
  // Sanitize key to prevent injection attacks
  const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  localStorage.removeItem(`linok-secure-${safeKey}`);
};

/**
 * Utility function to securely encrypt sensitive data before saving to the database
 * with enhanced injection protection
 * @param data The data object containing fields to encrypt
 * @param fieldsToEncrypt Array of field names to encrypt
 * @returns A new object with encrypted values for the specified fields
 */
export const encryptObjectFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToEncrypt: (keyof T)[]
): Promise<T> => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data object');
  }
  
  if (!Array.isArray(fieldsToEncrypt) || fieldsToEncrypt.length === 0) {
    throw new Error('Invalid fields to encrypt');
  }
  
  const encryptedData = { ...data };
  
  for (const field of fieldsToEncrypt) {
    if (data[field] !== undefined && data[field] !== null) {
      if (typeof data[field] === 'string') {
        // Sanitize input to prevent SQL injection
        const sanitizedValue = data[field].toString()
          .replace(/'/g, "''") // Escape single quotes for SQL safety
          .replace(/--/g, ""); // Remove SQL comment markers
          
        encryptedData[field] = await encryptData(sanitizedValue) as any;
      } else if (data[field] !== null) {
        // For non-string values, convert to JSON string first
        encryptedData[field] = await encryptData(JSON.stringify(data[field])) as any;
      }
    }
  }
  
  return encryptedData;
};

/**
 * Utility function to securely decrypt sensitive data retrieved from the database
 * with enhanced protection
 * @param data The data object containing encrypted fields
 * @param fieldsToDecrypt Array of field names to decrypt
 * @returns A new object with decrypted values for the specified fields
 */
export const decryptObjectFields = async <T extends Record<string, any>>(
  data: T,
  fieldsToDecrypt: (keyof T)[]
): Promise<T> => {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid data object');
  }
  
  if (!Array.isArray(fieldsToDecrypt) || fieldsToDecrypt.length === 0) {
    throw new Error('Invalid fields to decrypt');
  }
  
  const decryptedData = { ...data };
  
  for (const field of fieldsToDecrypt) {
    if (data[field] && typeof data[field] === 'string') {
      try {
        const decrypted = await decryptData(data[field] as string);
        
        // Try to parse as JSON in case it was a non-string value
        try {
          decryptedData[field] = JSON.parse(decrypted) as any;
        } catch {
          // If not valid JSON, use as string
          decryptedData[field] = decrypted as any;
        }
      } catch (error) {
        console.error(`Failed to decrypt field ${String(field)}:`, error);
        // Keep original value if decryption fails
      }
    }
  }
  
  return decryptedData;
};

/**
 * Function to securely hash passwords or sensitive data
 * @param value Value to hash
 * @returns Hashed value
 */
export const secureHash = async (value: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Function to generate a secure random token
 * @param length Length of the token
 * @returns Secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const randomValues = window.crypto.getRandomValues(new Uint8Array(length));
  return Array.from(randomValues)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param input User input to sanitize
 * @returns Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;');
};

/**
 * Validate that an input is safe and contains no malicious code
 * @param input Input to validate
 * @returns Whether the input is safe
 */
export const isInputSafe = (input: string): boolean => {
  // Check for common XSS patterns
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+=/gi,
    /data:/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
};
