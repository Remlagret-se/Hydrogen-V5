// Comprehensive polyfill for CommonJS compatibility in Cloudflare Workers
if (typeof globalThis !== 'undefined') {
  // Polyfill exports
  if (typeof globalThis.exports === 'undefined') {
    (globalThis as any).exports = {};
  }
  
  // Polyfill module
  if (typeof globalThis.module === 'undefined') {
    (globalThis as any).module = { exports: {} };
  }
  
  // Polyfill require with better module resolution
  if (typeof globalThis.require === 'undefined') {
    (globalThis as any).require = (id: string) => {
      // Basic module resolution for known problematic modules
      const moduleStubs: Record<string, any> = {
        '@emotion/is-prop-valid': { default: () => true },
        'use-sync-external-store': { useSyncExternalStore: () => {} },
        'use-sync-external-store/with-selector': { useSyncExternalStoreWithSelector: () => {} },
      };
      
      if (moduleStubs[id]) {
        return moduleStubs[id];
      }
      
      // Check for relative paths
      if (id.startsWith('./') || id.startsWith('../')) {
        return {};
      }
      
      console.warn(`CommonJS require() called for "${id}" in edge runtime. This module may not work correctly.`);
      return {};
    };
    
    // Add require.resolve
    (globalThis.require as any).resolve = (id: string) => id;
  }
  
  // Polyfill process
  if (typeof globalThis.process === 'undefined') {
    (globalThis as any).process = {
      env: {
        NODE_ENV: 'production',
      },
      version: 'v16.0.0',
      versions: { node: '16.0.0' },
      platform: 'browser',
      cwd: () => '/',
      nextTick: (fn: Function) => setTimeout(fn, 0),
    };
  }
  
  // Polyfill Buffer
  if (typeof globalThis.Buffer === 'undefined') {
    (globalThis as any).Buffer = {
      from: (data: any) => data,
      isBuffer: () => false,
      alloc: (size: number) => new ArrayBuffer(size),
      allocUnsafe: (size: number) => new ArrayBuffer(size),
    };
  }
  
  // Polyfill global
  if (typeof globalThis.global === 'undefined') {
    (globalThis as any).global = globalThis;
  }
} 
