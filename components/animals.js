/* globals AFRAME */
AFRAME.registerComponent('animals-d3', {
  init: function () {
    // fake data
    var data = [ 10, 20, 30, 15, 25, 35, 40,
                45, 50, 70, 100, 120, 130,
               12, 18, 22, 29, 33, 44, 59, 200]

    var heightScale = d3.scale.linear()
      .domain([0, d3.max(data)])
      .range([0,5])

    var scene = d3.select("a-scene");

    var cubes = scene.selectAll("a-cylinder.bar")
      .data(data)
      .enter()
      .append("a-cylinder")
      .classed("bar", true)
      .attr({
        position: function(d,i) {
          var radius = 10;
          var angle = (i/data.length) * (2 * Math.PI)
          var x = radius * Math.cos(angle);
          var y = heightScale(d)/2;
          var z = radius * Math.sin(angle);
          return x + " " + y + " " + z
        },
        height: function(d,i) {
          return heightScale(d)
        },
        color: '#AB8'
      })
  }
});
