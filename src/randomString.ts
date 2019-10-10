import cryptoRandomString from 'crypto-random-string';

function randomString(): string {
  return cryptoRandomString({
    length: 6,
    characters:
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  });
}

export default randomString;
