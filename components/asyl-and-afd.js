/* globals AFRAME */
AFRAME.registerComponent('asyl-and-afd', {
    schema: {
        dataSrc: {
            type: 'asset'
        }
    },
    init: function() {
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
        var dataPointer = this.data;
        d3.csv(dataPointer.dataSrc, rowConverter, function(data) {
            var width = 10;
            var height = 10;
            var boxDimension = 10 / data.length - 0.1;

            // AFD Anteil 2017 Erststimme
            var minAfd = d3.min(data, function(d) {
                return d.afderststimme
            });
            var maxAfd = d3.max(data, function(d) {
                return d.afderststimme
            });

            var xScale = d3.scaleLinear()
                .domain([minAfd, maxAfd])
                .range([0 + boxDimension, width + boxDimension]);

            var afdColorScale = d3.scaleLinear()
                .domain([minAfd, maxAfd])
                .range(['white', '#543407']);

            // Asylanträge absolut 2016
            var minAntraege = d3.min(data, function(d) {
                return d.antraegeRel
            });
            var maxAntraege = d3.max(data, function(d) {
                return d.antraegeRel
            });

            var zScale = d3.scaleLinear()
                .domain([minAntraege, maxAntraege])
                .range([0 + boxDimension, width + boxDimension]);

            var antraegeColorScale = d3.scaleLinear()
                .domain([minAntraege, maxAntraege])
                .range(['white', '#1b8424']);

            // Abschiebungen absolut 2016
            var minAbschiebungen = d3.min(data, function(d) {
                return d.abschiebungenRel
            })
            var maxAbschiebungen = d3.max(data, function(d) {
                return d.abschiebungenRel
            })

            var abschiebungenColorScale = d3.scaleLinear()
                .domain([minAbschiebungen, maxAbschiebungen])
                .range(['white', '#991a1a']);

            var yScale = d3.scaleLinear()
                .domain([minAbschiebungen, maxAbschiebungen])
                .range([0, height]);

            var scene = d3.select('#target');
            var countries = scene.selectAll('a-entity.country')
                .data(data)
                .enter()
                .append('a-entity')
                .classed('country', true)
                .attrs({
                    position: function(d, i) {
                        return xScale(d.afderststimme) + ' ' + yScale(d.abschiebungenRel) + ' ' + (-zScale(d.antraegeRel))
                    }
                });

            countries
                .append('a-plane')
                .attrs({
                    width: boxDimension,
                    height: boxDimension / 3,
                    color: function(d) {
                        return afdColorScale(d.afderststimme);
                    }
                });

            countries
                .append('a-plane')
                .attrs({
                    color: function(d) {
                        return antraegeColorScale(d.antraegeRel)
                    },
                    position: '0 ' + boxDimension / 3 + ' 0',
                    width: boxDimension,
                    height: boxDimension / 3
                });

            countries
                .append('a-plane')
                .attrs({
                    color: function(d) {
                        return abschiebungenColorScale(d.abschiebungenRel)
                    },
                    position: '0 ' + -boxDimension / 3 + ' 0',
                    width: boxDimension,
                    height: boxDimension / 3
                });

            countries
                .append('a-text')
                .attrs({
                    value: function(d) {
                        return d.bundesland
                    },
                    position: '0 ' + -2 * boxDimension / 3 + ' 0',
                    width: 4,
                    align: 'center'
                });

            countries
                .on('mouseenter', function(d) {
                    var selected = d3.select(this);
                    selected.attr('scale', '5 5 5');
                    selected
                        .append('a-text')
                        .classed('detail', true)
                        .attrs({
                            value: ('Anträge: ' + d.antraegeRel + '%' +
                                '\n\n\n AFD: ' + d.afderststimme + '%' +
                                '\n\n\n Abschiebungen: ' + d.abschiebungenRel + '%'),
                            color: 'black',
                            position: '0 0 0',
                            width: 1.2,
                            align: 'center'
                        });

                    selected.on('mouseleave', function() {
                        selected.attr('scale', '1 1 1');
                        selected.selectAll('.detail').remove();
                    })
                });
        });
    }
});
