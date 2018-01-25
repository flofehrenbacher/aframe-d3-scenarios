/* globals AFRAME */
AFRAME.registerComponent('afd-anteil', {
  init: function () {
    // for converting Strings to Ints
    var rowConverter = function(d) {
      return {
        bundesland: d.bundesland,
        antraege: parseInt(d.antraege),
        afderststimme: parseFloat(d.afderststimme),
        abschiebungen: parseInt(d.abschiebungen),
        antraegeRel: parseFloat(d.antraegeRel),
        abschiebungenRel: parseFloat(d.abschiebungenRel)
      };
    }

    var heightScale = d3.scaleLinear()
      .range([0,5]);

    var colorScale = d3.scaleLinear()
      .range(['green','orange','red']);

    d3.csv('data/asyl-and-afd.csv', rowConverter, function(data) {
      var maxAfdAnteil = d3.max(data, function(d){return d.afderststimme });
      heightScale.domain([0, maxAfdAnteil]);
      colorScale.domain([0, maxAfdAnteil/2, maxAfdAnteil]);

      var scene = d3.select('a-scene');
      var bars = scene.selectAll('a-cylinder.bar')
        .data(data)
        .enter()
        .append('a-cylinder')
        .attrs({
          radius: 0.6,
          position: function(d,i) {
            var x = 2*i-25;
            var y = (heightScale(d.afderststimme)/2).toFixed(3);
            var z = -8;
            return x + ' ' + y + ' ' + z;
          },
          height: function(d) {
            return heightScale(d.afderststimme);
          },
          color: function(d) {
            return colorScale(d.afderststimme)
          },
          shadow: '',
          animation: function(d,i){
            var radius = 8;
            var angle = (i/data.length) * (2 * Math.PI) + Math.PI*1.5;
            var x = (radius * Math.cos(angle)).toFixed(3);
            var y = (heightScale(d.afderststimme)/2).toFixed(3);
            var z = (radius * Math.sin(angle)).toFixed(3);
            return {'property': 'position',
                    'dur': '2000',
                    'to': x + ' ' + y + ' ' + z,
                    'easing': 'easeInElastic',
                    'startEvents': 'startAnim'
                  };
          },
          animation__2: function(d,i){
            return {'property': 'rotation',
                    'dur': '2000',
                    'to': '0 ' + -360 * i/data.length + ' 0',
                    'startEvents': 'startAnim'
                  };
          }
        })
        .on('mouseenter', function(d){
          var selected = d3.select(this);
          selected
            .append('a-text')
            .attrs({
              position: function(d){
                var y = (heightScale(d.afderststimme)/2 + 1).toFixed(3);
                return '0 ' + y + ' 0'
              },
              value: function(d){ return d.afderststimme + '%' },
              width: 20,
              color: 'black',
              align: 'center'
            });
        });

      bars
        .append('a-text')
        .attrs({
          value: function(d){ return (d.bundesland)},
          position: function(d){ return '-0.2 ' + (-heightScale(d.afderststimme)/2).toFixed(3) + ' 0.6'},
          rotation: '-30 45 0',
          color: 'black',
          width: 10,
          align: 'right'
        });

        d3.select('#start-ring')
          .on('mouseenter',function(){
            bars._groups[0].forEach(function(item, index, arr) {
              item.emit('startAnim');
            });
            bars
              .attr('rotation', '0 0 0');

          });
    });
  }
});
