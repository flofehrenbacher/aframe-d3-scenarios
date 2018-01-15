/* globals AFRAME */
AFRAME.registerComponent('animals-d3', {
  init: function () {
    d3.csv('data/endangered-species.csv', function(data) {
      // convert strings to ints
      data.forEach(function(d) {
        d.numbersleft = +d.numbersleft;
        d.rank = +d.rank;
      });

      console.log(d3.max(data, function(d){return d.numbersleft }));

      var heightScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return d.numbersleft })])
        .range([0,5]);

      var colorScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return d.numbersleft })/2, d3.max(data, function(d){return d.numbersleft })])
        .range(['red','orange','green']);

      console.log(heightScale(d3.max(data, function(d){return d.numbersleft })));

      var scene = d3.select('a-scene');

      var bars = scene.selectAll('a-cylinder.bar')
        .data(data)
        .enter()
        .append('a-cylinder')
        .classed('bar', true)
        .attrs({
          position: function(d,i) {
            var radius = 10;
            var angle = (i/data.length) * (2 * Math.PI) + Math.PI*1.5
            var x = radius * Math.cos(angle);
            var y = heightScale(d.numbersleft)/2;
            var z = radius * Math.sin(angle);
            return x + ' ' + y + ' ' + z
          },
          height: function(d) {
            return heightScale(d.numbersleft)
          },
          color: function(d) {
            return colorScale(d.numbersleft)
          }
        })
          $('a-scene').fullscreen();
    });
  }
});
