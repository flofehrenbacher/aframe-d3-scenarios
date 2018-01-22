/* globals AFRAME */
AFRAME.registerComponent('animals-d3', {
  init: function () {
    // for converting Strings to Ints
    var rowConverter = function(d) {
      return {
        rank: parseInt(d.rank),
        numbersleft: parseInt(d.numbersleft)
      };
    }

    var heightScale = d3.scaleLinear()
      .range([0,5]);

    var colorScale = d3.scaleLinear()
      .range(['red','orange','green']);

    d3.csv('data/animals.csv', rowConverter, function(data) {
      var maxNumbersleft = d3.max(data, function(d){return d.numbersleft });
      heightScale.domain([0, maxNumbersleft]);
      colorScale.domain([0, maxNumbersleft/2, maxNumbersleft]);

      var scene = d3.select('a-scene');
      var bars = scene.selectAll('a-cylinder.bar')
        .data(data)
        .enter()
        .append('a-cylinder')
        .attrs({
          radius: 0.8,
          position: function(d,i) {
            var x = 2*i-10;
            var y = (heightScale(d.numbersleft)/2).toFixed(3);
            var z = -8;
            return x + ' ' + y + ' ' + z;
          },
          height: function(d) {
            return heightScale(d.numbersleft);
          },
          color: function(d) {
            return colorScale(d.numbersleft)
          }
        })
        .attr("animation", function(d,i){
          var radius = 10;
          var angle = (i/data.length) * (2 * Math.PI) + Math.PI*1.5;
          var x = (radius * Math.cos(angle)).toFixed(3);
          var y = (heightScale(d.numbersleft)/2).toFixed(3);
          var z = (radius * Math.sin(angle)).toFixed(3);
          return {'property': 'position',
                  'dur': '2000',
                  'to': x + ' ' + y + ' ' + z,
                  'easing': 'easeInElastic',
                  'startEvents': 'startAnim'
                };
        });

        d3.select('#start-plane')
          .on('mouseenter',function(){
            bars._groups[0].forEach(function(item, index, arr) {
              item.emit('startAnim');
            });
          });
    });
  }
});
