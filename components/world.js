/* globals AFRAME */
AFRAME.registerComponent('show-country-info', {
  init: function () {
    this.el.addEventListener('geojson-feature-selected', this.setText);
  },

  setText: function (event) {
    console.log(event.detail.feature);
  }
});