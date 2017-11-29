/* globals AFRAME */
AFRAME.registerComponent('show-country-info', {
  init: function () {
    d3.json("data/all-one-week.geo.json", function(worldData) {
      var data = worldData.features;

      var inradians = function (degrees) {
        return degrees * (Math.PI / 180);
      }
      var magnitudeScale = d3.scale.linear()
  			.domain([d3.min(data, function(d) { return d.properties.mag ; }), d3.max(data, function(d) { return d.properties.mag ; }) ])
  			.range([0.2,1])

      var globeRadius = 2;
      var scene = d3.select("#target");
      var earthquakes = scene.selectAll("a-cylinder")
  			.data(data)
  			.enter()
  			.append("a-cylinder")
  			.classed("earthquake",true)
  			.attr({
  				position: function(d) {
  					// convert lat(geometry[1]) and long(geometry[0]) in cartesian coordinates
  					var x = globeRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.cos(inradians(d.geometry.coordinates[0]));
            var y = globeRadius * Math.sin(inradians(d.geometry.coordinates[1]))
            var z = -(globeRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.sin(inradians(d.geometry.coordinates[0])))
  					return x + " " + y + " " + z
  				},
  				height: function(d) {
  					return magnitudeScale(d.properties.mag);
  				},
          rotation: function(d){
            var xRot = - (90 - d.geometry.coordinates[1])
            var yRot = - (90 - d.geometry.coordinates[0])
            return xRot + " " + yRot + " 0"
          },
          radius: '0.02',
          color: function(d){
            return 'rgb(' + Math.floor(Math.random() * 255)
                    + ',' + Math.floor(Math.random() * 255)
                    + ',' + Math.floor(Math.random() * 255) + ')'
          }
        });
    //this.el.addEventListener('geojson-feature-selected', this.setText);
    });
  }
/*
  setText: function (event) {

    //console.log(event.detail.feature);
  }
*/
});
