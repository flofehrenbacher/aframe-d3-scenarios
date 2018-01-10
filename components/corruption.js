/* globals AFRAME */
AFRAME.registerComponent('startd3', {
  init: function () {
    d3.csv("data/corruption.csv", function(data) {
      console.log(data);

      var width = 10;
      var height = 10;
      var boxDimension = 10/data.length - 0.1;

      // hdi 2015
      var xScale = d3.scaleLinear()
        .domain([0, 24])
        .range([0 + boxDimension, width + boxDimension]);

      // colorScale
      var cpiColorScale = d3.scaleLinear()
        .domain([ d3.min(data, function(d){ return d.cpi2016 }) , d3.max(data, function(d){ return d.cpi2016 }) ])
        .range(['white','red']);

      var wefColorScale = d3.scaleLinear()
        .domain([ d3.min(data, function(d){ return d.wef }) , d3.max(data, function(d){ return d.wef }) ])
        .range(['white','blue']);

      var hdiColorScale = d3.scaleLinear()
        .domain([ d3.min(data, function(d){ return d.hdi2015 }) , d3.max(data, function(d){ return d.hdi2015 }) ])
        .range(['white','yellow']);

      // TODO max 2015 hdi is not 9
      console.log(d3.max(data, function(d){ return d.hdi2015 }));
      console.log(d3.min(data, function(d){ return d.hdi2015 }));

      // cpi2016
      var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.cpi2016 }), d3.max(data, function(d){ return d.cpi2016 })])
        .range([0, height]);

      // wef
      var zScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.wef }), d3.max(data, function(d){ return d.wef })])
        .range([0 + boxDimension, width + boxDimension]);

      var scene = d3.select("#target");

      var countries = scene.selectAll("a-plane")
        .data(data)
        .enter()
        .append("a-plane")
        .attrs({
          position: function(d,i){
            return xScale(d.hdi2015) + " " + yScale(d.cpi2016) + " " + (-zScale(d.wef))
          },
          width: boxDimension,
          height: boxDimension/3,
          color: function(d){
            return cpiColorScale(d.cpi2016);
          }
        })

      countries
        .append("a-plane")
        .attrs({
          color: function(d){ return wefColorScale(d.wef)},
          position: "0 " + boxDimension/3 + " 0",
          width: boxDimension,
          height: boxDimension/3
        });

      countries
        .append("a-plane")
        .attrs({
          color: function(d){ return wefColorScale(d.hdi2015)},
          position: "0 " + -boxDimension/3 + " 0",
          width: boxDimension,
          height: boxDimension/3
        });

    });
  }
});
