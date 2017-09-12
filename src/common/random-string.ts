const digits = '0123456789';
const lowercase = 'abcdefghijklmnoprstuvxuyz';
const uppercase = lowercase.toUpperCase();
const special = '+/';

function base10Chars(): string {
  return digits;
}

function base16Chars(): string {
  return [digits, uppercase.substr(0, 6)].join('');
}

function base32Chars(): string {
  return [uppercase, digits].join('');
}

function base62Chars(): string {
  return [digits, lowercase, uppercase].join('');
}

function base64Chars(): string {
  return [digits, lowercase, uppercase, special].join('');
}

function generate(pool, length: number): string {
  let output = '';
  const max = pool.length - 1;

  for (let i = 0; i < length; i += 1) {
    output += pool[Math.round(Math.random() * max)];
  }

  return output;
}

export function base64String(length: number): string {
  return generate(base64Chars(), length);
}

export function base62String(length: number): string {
  return generate(base62Chars(), length);
}

export function base32String(length: number): string {
  return generate(base32Chars(), length);
}

export function base16String(length: number): string {
  return generate(base16Chars(), length);
}

export function base10String(length: number): string {
  return generate(base10Chars(), length);
}
