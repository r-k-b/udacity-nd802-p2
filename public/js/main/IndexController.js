/* eslint-disable no-underscore-dangle */

import idb from 'idb';
import ToastsView from './views/Toasts';

const db = {
  name: 'bondord',
  store: 'screcell',
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
    store.createIndex('by-date', 'time');
  };

  return idb.open(db.name, 1, onUpgrade);
}

export default function IndexController(container) {
  this._container = container;
  this._toastsView = new ToastsView(this._container);
  this._lostConnectionToast = null;
  this._dbPromise = openDatabase();
  this._registerServiceWorker();
  this._cleanImageCache();

  const indexController = this;

  setInterval(() => {
    indexController._cleanImageCache();
  }, 1000 * 60 * 5);

  this._showCachedMessages()
    .then(() => {
      indexController._openSocket();
    });
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

IndexController.prototype._trackInstalling = function (worker) {
  const indexController = this;
  worker.addEventListener('statechange', () => {
    if (worker.state === 'installed') {
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._updateReady = function (worker) {
  const toast = this._toastsView.show('New version available', {
    buttons: ['refresh', 'dismiss'],
  });

  toast.answer.then(answer => {
    if (answer !== 'refresh') return;
    worker.postMessage({ action: 'skipWaiting' });
  });
};

// open a connection to the server for live updates
IndexController.prototype._openSocket = function () {
  const indexController = this;
  const latestPostDate = this._postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  const socketUrl = new URL('/updates', window.location);
  socketUrl.protocol = 'ws';

  if (latestPostDate) {
    socketUrl.search = `since=${latestPostDate.valueOf()}`;
  }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  socketUrl.search += `&${location.search.slice(1)}`;

  const ws = new WebSocket(socketUrl.href);

  // add listeners
  ws.addEventListener('open', () => {
    if (indexController._lostConnectionToast) {
      indexController._lostConnectionToast.hide();
    }
  });

  ws.addEventListener('message', (event) => {
    requestAnimationFrame(() => {
      indexController._onSocketMessage(event.data);
    });
  });

  ws.addEventListener('close', () => {
    // tell the user
    if (!indexController._lostConnectionToast) {
      indexController._lostConnectionToast = indexController._toastsView.show('Unable to connect. Retrying…');
    }

    // try and reconnect in 5 seconds
    setTimeout(() => {
      indexController._openSocket();
    }, 5000);
  });
};

// called when the web socket sends message data
IndexController.prototype._onSocketMessage = function (data) {
  const messages = JSON.parse(data);

  this._dbPromise.then(function (db) {
    if (!db) return;

    var tx = db.transaction('wittrs', 'readwrite');
    var store = tx.objectStore('wittrs');
    messages.forEach(function (message) {
      store.put(message);
    });

    // limit store to 30 items
    store.index('by-date').openCursor(null, "prev").then(function (cursor) {
      return cursor.advance(30);
    }).then(function deleteRest(cursor) {
      if (!cursor) return;
      cursor.delete();
      return cursor.continue().then(deleteRest);
    });
  });

  this._postsView.addPosts(messages);
};