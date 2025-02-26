// @flow
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

class IsMobile {
  static android(): string | boolean {
    return navigator.userAgent.match(/Android/i) ? 'android' : false;
  }

  static iOS(): string | boolean {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? 'ios' : false;
  }

  static any(): string | boolean {
    return this.android() || this.iOS();
  }
}

function isMobileBrowser(): string | boolean {
  return isBrowser() ? IsMobile.any() : false;
}

function isDesktop(): boolean {
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

export { isBrowser, isDesktop, IsMobile, isMobileBrowser };
