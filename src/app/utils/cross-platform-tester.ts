// Cross-Platform Testing Utility
export class CrossPlatformTester {
  private static readonly BREAKPOINTS = {
    xs: 375,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  };

  private static readonly DEVICE_VIEWPORTS = {
    iPhone_SE: { width: 375, height: 667, devicePixelRatio: 2 },
    iPhone_12: { width: 390, height: 844, devicePixelRatio: 3 },
    iPhone_12_Pro_Max: { width: 428, height: 926, devicePixelRatio: 3 },
    iPad: { width: 768, height: 1024, devicePixelRatio: 2 },
    iPad_Pro: { width: 1024, height: 1366, devicePixelRatio: 2 },
    Galaxy_S21: { width: 360, height: 800, devicePixelRatio: 3 },
    Galaxy_Tab_S7: { width: 753, height: 1037, devicePixelRatio: 2.625 },
    Desktop_HD: { width: 1366, height: 768, devicePixelRatio: 1 },
    Desktop_FHD: { width: 1920, height: 1080, devicePixelRatio: 1 },
    Desktop_4K: { width: 3840, height: 2160, devicePixelRatio: 2 }
  };

  static getCurrentBreakpoint(): string {
    const width = window.innerWidth;
    
    if (width >= this.BREAKPOINTS.xxl) return 'xxl';
    if (width >= this.BREAKPOINTS.xl) return 'xl';
    if (width >= this.BREAKPOINTS.lg) return 'lg';
    if (width >= this.BREAKPOINTS.md) return 'md';
    if (width >= this.BREAKPOINTS.sm) return 'sm';
    return 'xs';
  }

  static getViewportInfo() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
      breakpoint: this.getCurrentBreakpoint(),
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isTablet: /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
      isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
  }

  static checkTouchSupport(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  static checkCSSupport(): { [key: string]: boolean } {
    const testElement = document.createElement('div');
    
    return {
      flexbox: testElement.style.flexWrap !== undefined,
      grid: testElement.style.gridTemplateColumns !== undefined,
      customProperties: CSS.supports('color', 'var(--test)'),
      backdropFilter: CSS.supports('backdrop-filter', 'blur(5px)'),
      clamp: CSS.supports('width', 'clamp(1rem, 2vw, 3rem)'),
      aspectRatio: CSS.supports('aspect-ratio', '1/1'),
      containerQueries: CSS.supports('container-type', 'inline-size'),
      logicalProperties: CSS.supports('margin-inline-start', '1rem')
    };
  }

  static runCompatibilityCheck(): {
    viewport: any;
    css: any;
    features: any;
    recommendations: string[];
  } {
    const viewport = this.getViewportInfo();
    const css = this.checkCSSupport();
    const features = {
      touch: this.checkTouchSupport(),
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      webgl: !!window.WebGLRenderingContext,
      serviceWorker: 'serviceWorker' in navigator,
      intersectionObserver: 'IntersectionObserver' in window
    };

    const recommendations = [];

    // Check viewport issues
    if (viewport.width < 320) {
      recommendations.push('Viewport too narrow - consider minimum width constraints');
    }

    // Check CSS support issues
    if (!css['flexbox']) {
      recommendations.push('Flexbox not supported - provide fallback layouts');
    }
    if (!css['grid']) {
      recommendations.push('Grid not supported - use flexbox fallbacks');
    }
    if (!css['customProperties']) {
      recommendations.push('CSS Custom Properties not supported - provide fallback values');
    }

    // Check feature support
    if (!features.intersectionObserver) {
      recommendations.push('Intersection Observer not supported - use scroll event fallbacks');
    }

    return { viewport, css, features, recommendations };
  }

  static simulateViewport(deviceName: keyof typeof CrossPlatformTester.DEVICE_VIEWPORTS) {
    const device = this.DEVICE_VIEWPORTS[deviceName];
    if (!device) return;

    // This is for development testing only
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      document.documentElement.style.width = `${device.width}px`;
      document.documentElement.style.height = `${device.height}px`;
      document.documentElement.style.transform = `scale(${1 / device.devicePixelRatio})`;
      document.documentElement.style.transformOrigin = 'top left';
      
      console.log(`Simulating ${deviceName}:`, device);
    }
  }

  static resetSimulation() {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      document.documentElement.style.width = '';
      document.documentElement.style.height = '';
      document.documentElement.style.transform = '';
      document.documentElement.style.transformOrigin = '';
    }
  }
}