import { performLogout } from ".";

declare global {
  interface Window {
    localStorage: Storage;
  }
}

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    getStore() {
      return { ...store };
    },
  };
})();

beforeEach(() => {
  const mockStorage = localStorageMock as unknown as Storage;
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
  });

  localStorageMock.clear();
  localStorage.setItem('accessToken', 'fake-token');
  localStorage.setItem('factoryId', '123');
  localStorage.setItem('user', JSON.stringify({ name: 'Test' }));
});

describe('performLogout', () => {
  it('should remove accessToken, factoryId, and user from localStorage', () => {
    performLogout();

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('factoryId')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});