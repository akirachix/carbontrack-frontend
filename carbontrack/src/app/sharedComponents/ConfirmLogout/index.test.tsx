import { performLogout } from ".";

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
  (global as any).localStorage = localStorageMock;
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