import Storage from './storage';

export const localStore = new Storage('localStorage', {
  prefix: 'app',
});
