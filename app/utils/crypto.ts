// app/utils/crypto.ts

export const SECRET_KEY = 'sheikh-el-qahwa-secure-salt-2026'

// Pure JS synchronous SHA-256 implementation
export function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const lengthProperty = 'length';
  let i, j;
  let result = '';

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106bb87f,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  let asciiBitLength = ascii.length * 8;
  let wordsCount = ((ascii.length + 8) >> 6) + 1;
  let wordsList = new Array(wordsCount * 16);
  for (i = 0; i < wordsList.length; i++) wordsList[i] = 0;
  for (i = 0; i < ascii.length; i++) {
    wordsList[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  wordsList[ascii.length >> 2] |= 0x80 << (24 - (ascii.length % 4) * 8);
  wordsList[wordsList.length - 1] = asciiBitLength;

  for (i = 0; i < wordsList.length; i += 16) {
    let w = new Array(64);
    let a = hash[0], b = hash[1], c = hash[2], d = hash[3], e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = wordsList[i + j];
      } else {
        let s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        let s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      let ch = (e & f) ^ (~e & g);
      let maj = (a & b) ^ (a & c) ^ (b & c);
      let S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      let S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      let t1 = (h + S1 + ch + k[j] + w[j]) | 0;
      let t2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    let word = hash[i];
    let hex = (word >>> 0).toString(16);
    result += ('00000000' + hex).slice(-8);
  }
  return result;
}

export function encodeUnicodeToBase64(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64');
  }
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

export function decodeBase64ToUnicode(str: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(str, 'base64').toString('utf-8');
  }
  return decodeURIComponent(atob(str).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

export interface CompactOrder {
  n: string;     // customer name
  p: string;     // phone
  a: string;     // address
  nt: string;    // notes
  i: {
    t: 's' | 'b';  // type: single or blend
    id: string | number;
    n: string;   // name
    w: number;   // weight
    q?: number;  // quantity
    pr: number;  // price
    img?: string; // image key/illustration
    gr?: string;  // background gradient
    ac?: string;  // accent color
    c?: {        // components
      n: string; // component name
      w: number; // component weight
    }[];
  }[];
  t: number;     // total price
  sf: number;    // shipping fee
  ts: number;    // timestamp
}

export function encodeOrder(order: CompactOrder): { data: string; sig: string } {
  const jsonStr = JSON.stringify(order);
  const data = encodeUnicodeToBase64(jsonStr);
  const sig = sha256(data + SECRET_KEY);
  return { data, sig };
}

export function decodeOrder(dataStr: string, sig: string): { order: CompactOrder | null; isValid: boolean } {
  try {
    const computedSig = sha256(dataStr + SECRET_KEY);
    if (computedSig !== sig) {
      return { order: null, isValid: false };
    }
    const jsonStr = decodeBase64ToUnicode(dataStr);
    const order = JSON.parse(jsonStr) as CompactOrder;
    return { order, isValid: true };
  } catch (e) {
    return { order: null, isValid: false };
  }
}
