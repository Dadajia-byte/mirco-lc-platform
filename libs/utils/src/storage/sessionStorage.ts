import Storage from './storage';

export const sessionStorage = new Storage('sessionStorage', {
  prefix: 'app',
});
