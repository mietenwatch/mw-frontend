import { DomUtil, Layer } from 'leaflet';

/* eslint-disable no-underscore-dangle */
function setInteractive(interactive) {
  if (this.getLayers) {
    this.getLayers().forEach(layer => {
      layer.setInteractive(interactive);
    });
    return;
  }
  if (!this._path) {
    return;
  }

  this.options.interactive = interactive;

  if (interactive) {
    DomUtil.addClass(this._path, 'leaflet-interactive');
  } else {
    DomUtil.removeClass(this._path, 'leaflet-interactive');
  }
}

if (typeof Layer !== 'undefined') {
  Layer.prototype.setInteractive = setInteractive;
}
