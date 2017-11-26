AFRAME.registerComponent('map', {
  init: function () {
	d3.csv("data/zaehlstellen-durchschnitt.csv", function(data) {

		var heightScale = d3.scale.linear()
			.domain([0, d3.max(data, function(d) { return d.DTV_Kfz_MobisSo_Q; }) ])
			.range([0,0.9])

		var longitudeScale = d3.scale.linear()
			.domain([5.8721,15.0409])
			.range([0,10.213])

		var latitudeScale = d3.scale.linear()
			.domain([47.2691,55.0572])
			.range([0,-8.647])

		var scene = d3.select("a-scene");

		var cylinders = scene.selectAll("a-cylinder.cyl")
			.data(data)
			.enter()
			.append("a-cylinder")
			.classed("cyl",true)
			.attr({
				position: function(d) {
					// returning x coordinate between 0 and 2
					var x = longitudeScale(d.Koor_WGS84_E);
					var z = latitudeScale(d.Koor_WGS84_N);

					var y = heightScale(d.DTV_Kfz_MobisSo_Q) / 2;

					return x + " " + y + " " + z
				},
				height: function(d) {
					return heightScale(d.DTV_Kfz_MobisSo_Q)
				},
				radius: function(d) {
					return 0.03
				},
				color: function(d) {
					if(heightScale(d.DTV_Kfz_MobisSo_Q)<0.3)
					return "rgb(0,255,0)"
					if(heightScale(d.DTV_Kfz_MobisSo_Q)>0.6)
					return "rgb(255,0,0)"
					else
					return "rgb(255,255,0)"
				}
			})
	});
  }
});