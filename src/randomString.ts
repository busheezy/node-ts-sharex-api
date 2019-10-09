import cryptoRandomString from 'crypto-random-string';

function randomString(): string {
  return cryptoRandomString({ length: 6, type: 'base64' });
}

export default randomString;
