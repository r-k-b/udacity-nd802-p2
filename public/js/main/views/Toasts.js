/* eslint-disable no-underscore-dangle */

import parseHTML from './../../utils/parseHTML';
import toastTemplate from './../../../../templates/toast.hbs';
import { merge } from 'ramda';
import transition from 'simple-transition';
import closest from 'closest';

function Toast(text, duration, buttons) {
  const toast = this;

  this.container = parseHTML(toastTemplate({
    text,
    buttons,
  })).firstChild;

  // noinspection JSUnusedGlobalSymbols
  this.answer = new Promise(resolve => {
    toast._answerResolver = resolve;
  });

  this.gone = new Promise(resolve => {
    toast._goneResolver = resolve;
  });

  if (duration) {
    this._hideTimeout = setTimeout(() => {
      toast.hide();
    }, duration);
  }

  this.container.addEventListener('click', event => {
    const button = closest(event.target, 'button', true);
    if (!button) return;
    toast._answerResolver(button.textContent);
    toast.hide();
  });
}

Toast.prototype.hide = function hideToast() {
  clearTimeout(this._hideTimeout);
  this._answerResolver();

  transition(this.container, {
    opacity: 0,
  }, 0.3, 'ease-out').then(this._goneResolver);

  return this.gone;
};

export default function Toasts(appendToEl) {
  this._container = parseHTML('<div class="toasts"></div>').firstChild;
  appendToEl.appendChild(this._container);
}

// show a message to the user eg:
// toasts.show("Do you wish to continue?", {
//   buttons: ['yes', 'no']
// })
// Returns a toast.
// noinspection JSUnusedGlobalSymbols
Toasts.prototype.show = function showToast(message, optsIn) {
  const opts = merge(optsIn, {
    duration: 0,
    buttons: ['dismiss'],
  });

  const toast = new Toast(message, opts.duration, opts.buttons);
  this._container.appendChild(toast.container);

  transition(toast.container, {
    opacity: 1,
  }, 0.5, 'ease-out');

  toast.gone.then(() => toast.container.parentNode.removeChild(toast.container));

  return toast;
};
