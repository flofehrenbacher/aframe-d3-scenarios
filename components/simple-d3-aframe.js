/* globals AFRAME */
AFRAME.registerComponent('simple-d3-aframe', {
  init: function () {
    d3.csv('data/simple-d3-aframe.csv', function(data) {
      // convert strings to ints
      data.forEach(function(d) {
        d.numbersleft = +d.numbersleft;
      });

      var heightScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return d.numbersleft })])
        .range([0,4]);

      var colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return d.numbersleft })/2, d3.max(data, function(d){return d.numbersleft })])
        .range(['red','orange','green']);

      var scene = d3.select('a-scene');

      var bars = scene.selectAll('a-cylinder.bar')
        .data(data)
        .enter()
        .append('a-cylinder')
        .classed('bar', true)
        .attrs({
          position: function(d,i) {
            var x = i*0.5 - 4;
            var y = heightScale(d.numbersleft)/2;
            var z = -4;
            return x + ' ' + y + ' ' + z
          },
          radius: 0.2,
          height: function(d) {
            return heightScale(d.numbersleft)
          },
          color: function(d) {
            return colorScale(d.numbersleft)
          },
          shadow: ''
        })
    });
  }
});
