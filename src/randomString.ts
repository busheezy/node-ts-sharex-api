import cryptoRandomString from 'crypto-random-string';

function randomString(): string {
  return cryptoRandomString({ length: 6, type: 'url-safe' });
}

export default randomString;
