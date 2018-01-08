/* globals AFRAME */
AFRAME.registerComponent('show-earthquakes', {
  init: function () {
    d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(worldData) {
      var data = worldData.features;
      console.log("MIN: " + d3.min(data, function(d) { return d.properties.mag ; }));
      console.log("MAX: " + d3.max(data, function(d) { return d.properties.mag ; }));


      var inradians = function (degrees) {
        return degrees * (Math.PI / 180);
      }
      var magnitudeScale = d3.scale.linear()
  			.domain([d3.min(data, function(d) { return d.properties.mag ; }), d3.max(data, function(d) { return d.properties.mag ; }) ])
  			.range([0.1,0.5])

      var colorScale = d3.scale.linear()
  			.domain([d3.min(data, function(d) { return d.properties.mag ; }), d3.max(data, function(d) { return d.properties.mag ; }) ])
  			.range(['#FFF', '#F00'])

      var globeRadius = 2;
      var scene = d3.select("#target");

      var earthquakes = scene.selectAll("a-cylinder")
  			.data(data)
  			.enter()
  			.append("a-cylinder")
  			.classed("earthquake",true)
  			.attr({
  				position: function(d) {
            currentRadius = globeRadius + magnitudeScale(d.properties.mag)/2;
  					// convert lat(geometry[1]) and long(geometry[0]) in cartesian coordinates
  					var x = currentRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.cos(inradians(d.geometry.coordinates[0]));
            var y = currentRadius * Math.sin(inradians(d.geometry.coordinates[1]))
            var z = -(currentRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.sin(inradians(d.geometry.coordinates[0])))
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

            // create three categories of earthquake magnitude
            /*
            if(d.properties.mag < 2){
              return '#0A0';
            } else if (d.properties.mag < 5) {
              return '#AA0';
            } else if (d.properties.mag >= 5) {
              return '#A00';
            } else {
              return '#00A';
            }
            */
            // return colorScale(d.properties.mag)
          }
        });
    });
  }
});
