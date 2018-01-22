/* globals AFRAME */
AFRAME.registerComponent('corruption-d3', {
  init: function () {
    var rowConverter = function(d) {
      return {
        country: d.country,
        cpi2016: parseInt(d.cpi2016),
        hdi2015: parseInt(d.hdi2015),
        gic: parseInt(d.gic),
        wef: parseInt(d.wef)
      };
    }
    d3.csv('data/corruption.csv', rowConverter, function(data) {
      var width = 10;
      var height = 10;
      var boxDimension = 10/data.length - 0.1;

      // hdi 2015
      var xScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.hdi2015 }) , d3.max(data, function(d){ return d.hdi2015 })])
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

      // cpi2016
      var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.cpi2016 }), d3.max(data, function(d){ return d.cpi2016 })])
        .range([0, height]);

      // wef
      var zScale = d3.scaleLinear()
        .domain([d3.min(data, function(d){ return d.wef }), d3.max(data, function(d){ return d.wef })])
        .range([0 + boxDimension, width + boxDimension]);

      var scene = d3.select('#target');
      var countries = scene.selectAll('a-entity.country')
        .data(data)
        .enter()
        .append('a-entity')
        .classed('country',true)
        .attrs({
          position: function(d,i){
            return xScale(d.hdi2015) + ' ' + yScale(d.cpi2016) + ' ' + (-zScale(d.wef))
          }
        });

      countries
        .append('a-plane')
        .attrs({
          width: boxDimension,
          height: boxDimension/3,
          color: function(d){
            return cpiColorScale(d.cpi2016);
          }
        });

      countries
        .append('a-plane')
        .attrs({
          color: function(d){ return wefColorScale(d.wef)},
          position: '0 ' + boxDimension/3 + ' 0',
          width: boxDimension,
          height: boxDimension/3
        });

      countries
        .append('a-plane')
        .attrs({
          color: function(d){ return hdiColorScale(d.hdi2015)},
          position: '0 ' + -boxDimension/3 + ' 0',
          width: boxDimension,
          height: boxDimension/3
        });

      countries
        .append('a-text')
        .attrs({
          value: function(d){ return d.country },
          position: '0 ' + -2*boxDimension/3 + ' 0',
          width: 4,
          align: 'center'
        });

      countries
        .on('mouseenter', function (d) {
          var selected = d3.select(this);
          selected.attr('scale', '4 4 4');
          selected
            .append('a-text')
            .classed('detail',true)
            .attrs({
              value: ('hdi2015: ' + d.hdi2015 +
                    '\n\n cpi2016: ' + d.cpi2016 +
                    '\n\n wef:     ' + d.wef),
              color: 'black',
              position: '0 0 0',
              width: 1.8,
              align: 'center'
            });

          selected.on('mouseleave',function(){
            selected.attr('scale', '1 1 1');
            selected.selectAll('.detail').remove();
          })
        });
    });
  }
});
