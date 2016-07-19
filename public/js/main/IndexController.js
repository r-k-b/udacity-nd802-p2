/* eslint-disable no-underscore-dangle */

import idb from 'idb';
import ToastsView from './views/Toasts';

const db = {
  name: 'bondord',
  store: 'stations',
};

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  const onUpgrade = upgradeDb => {
    const store = upgradeDb.createObjectStore(db.store, {
      keyPath: 'id',
    });
    store.createIndex('');
  };

  return idb.open(db.name, 1, onUpgrade);
}

export default function IndexController(container) {
  if (!(this instanceof IndexController)) {
    return new IndexController(container);
  }

  this._container = container;
  this._toastsView = new ToastsView(this._container);
  this._dbPromise = openDatabase();
  this._registerServiceWorker();
}

IndexController.prototype._registerServiceWorker = function registerIndexCSW() {
  var refreshing; // eslint-disable-line no-var

  if (!navigator.serviceWorker) return;

  const indexController = this;

  navigator.serviceWorker.register('/sw.js').then(reg => {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', () => {
      indexController._trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

IndexController.prototype._trackInstalling = function _trackInstalling(worker) {
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      this._updateReady(worker);
    }
  });
};

IndexController.prototype._updateReady = function _updateReady(worker) {
  const toast = this._toastsView.show('New version available', {
    buttons: ['refresh', 'dismiss'],
  });

  toast.answer.then(answer => {
    if (answer !== 'refresh') return;
    worker.postMessage({ action: 'skipWaiting' });
  });
};
