// @flow
import { errorLog } from './logsUtils';

function isNonInteger<T>(val: T): boolean {
  if (typeof val === 'string') {
    return !/^[0-9,]*$/.test(val);
  }
  return val === '.';
}

function triggerCallback(
  callback?: VoidFunctionWithParams<mixed>,
  ...args: Array<mixed>
) {
  if (callback && typeof callback === 'function') {
    callback(...args);
  }
}

function generateUniqSerial(base: number): string {
  return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, () => {
    const r = Math.floor(Math.random() * 16);
    return r.toString(base);
  });
}

function generateRandomString(len: number): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < len; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function getMaskedValue(str: string): string {
  return `${str}`.replace(/.(?=.{4})/g, '*');
}

function downloadFileFromData(
  fileData: BlobPart,
  fileName: string = 'file.pdf',
  contentType: string = 'application/pdf',
) {
  const file = new Blob([fileData], { type: contentType });
  const url = window.URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body?.appendChild(link);
  link.click();
  document.body?.removeChild(link);
}

function getEncodedURI(url: string, pathname: string): string {
  return `redirect=${encodeURIComponent(url)}&pathname=${pathname.slice(1)}`;
}

function scrollToTop() {
  window.scrollTo(0, 0);
}

async function copyToClipboard(
  text: string,
  callback: VoidFunctionWithParams<mixed> | (() => void),
): Promise<void> {
  navigator?.clipboard
    ?.writeText(text)
    .then(() => {
      callback();
    })
    .catch(e => {
      errorLog('Failed to copy: ', e);
    });
}

function isLocalhost(): boolean {
  return Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
      ),
  );
}

export {
  isNonInteger,
  triggerCallback,
  generateUniqSerial,
  generateRandomString,
  getMaskedValue,
  downloadFileFromData,
  getEncodedURI,
  scrollToTop,
  copyToClipboard,
  isLocalhost,
};
