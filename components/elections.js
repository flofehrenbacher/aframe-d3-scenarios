AFRAME.registerComponent('elections', {
    schema: {
        dataSrc: {
            type: 'asset'
        }
    },
    init: function() {
        var pointer = this;

        var rowConverter = function(d) {
            return {
                bundesland: d.Bundesland,
                latitude: parseFloat(d.latitude),
                longitude: parseFloat(d.longitude),
                wahlbeteiligung: parseFloat(d.Wahlbeteiligung),
                parties: [{
                        name: 'CDU/CSU',
                        percentage: parseFloat(d.Union),
                        color: 'black'
                    },
                    {
                        name: 'SPD',
                        percentage: parseFloat(d.SPD),
                        color: 'red'
                    },
                    {
                        name: 'DIE LINKE',
                        percentage: parseFloat(d.DIE_LINKE),
                        color: 'darkred'
                    },
                    {
                        name: 'GRUENE',
                        percentage: parseFloat(d.GRUENE),
                        color: 'green'
                    },
                    {
                        name: 'FDP',
                        percentage: parseFloat(d.FDP),
                        color: 'yellow'
                    },
                    {
                        name: 'AfD',
                        percentage: parseFloat(d.AfD),
                        color: '#19bffc'
                    },
                    {
                        name: 'Sonstige',
                        percentage: parseFloat(d.Sonstige),
                        color: 'grey'
                    }
                ]
            };
        }
        d3.csv(pointer.data.dataSrc, rowConverter, function(data) {
            var heightScale = d3.scaleLinear()
                .domain([0, 100])
                .range([0, 1]);

            var longitudeScale = d3.scaleLinear()
                .domain([5.8721, 15.0409])
                .range([0, 10.213])

            var latitudeScale = d3.scaleLinear()
                .domain([47.2691, 55.0572])
                .range([0, -8.647])

            var target = d3.select('#target');
            var container = target.selectAll('a-entity')
                .data(data)
                .enter()
                .append('a-entity')
                .classed('clickable', true)
                .attr('id', function(d) {
                    return d.bundesland;
                })
                .attrs({
                    position: function(d) {
                        var x = longitudeScale(d.longitude);
                        var z = latitudeScale(d.latitude);
                        var y = 0;
                        return x + ' ' + y + ' ' + z
                    }
                });

            container.append('a-text')
                .attrs({
                    value: function(d) {
                        return d.bundesland
                    },
                    color: 'black',
                    anchor: 'left',
                    position: '0.2 0 0',
                    rotation: '-20 0 0'
                });

            data.forEach(function(item){
                d3.select('#' + item.bundesland)
                    .selectAll('a-cylinder.segment')
                    .data(item.parties)
                    .enter()
                    .append('a-cylinder')
                    .classed('segment', true)
                    .attrs({
                        color: function(d) {
                            return d.color
                        },
                        height: function(d, i) {
                            return heightScale(d.percentage)
                        },
                        position: function(d, i) {
                            var yOffset = 0;
                            for (var j = 0; j < i; j++) {
                                yOffset = (yOffset + item.parties[j].percentage);
                            }
                            var y = heightScale(yOffset) + heightScale(d.percentage) / 2;
                            return '0 ' + y + ' 0'
                        },
                        radius: '0.2'
                    });
            });

            container.on('click', function(d) {
                    pointer.detailedBarchart(d);
                })

            container.on('mouseenter', function() {
                    pointer.hoverEffect(this);
                });
        });
    },

    hoverEffect: function(element) {
        d3.select(element).attr('scale', '1.5 1.5 1.5');
        d3.select(element).on('mouseleave', function() {
            d3.select(element).attr('scale', '1 1 1');
        });
    },

    detailedBarchart: function(state) {
        var heightScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 3]);

        var camera = d3.select('#camera');
        var bundeslandText = camera.append('a-text')
            .classed('detail', true)
            .attrs({
                value: function() {
                    return state.bundesland;
                },
                position: '0 -1 -3.5',
                width: 18,
                color: 'black',
                align: 'center'
            })

        bundeslandText.append('a-text')
            .classed('detail', true)
            .attrs({
                value: function() {
                    return 'Wahlbeteiligung ' + state.wahlbeteiligung + '%';
                },
                position: '0 -1 0',
                width: 10,
                color: 'black',
                align: 'center'
            });

        camera.append('a-plane')
            .classed('clickable', true)
            .classed('exit', true)
            .classed('detail', true)
            .attrs({
                position: '0 0 -3.5',
                color: 'white'
            });

        var bars = camera.selectAll('a-cylinder')
            .data(state.parties)
            .enter()
            .append('a-cylinder')
            .classed('detail', true)
            .attrs({
                radius: 0.6,
                position: function(d, i) {
                    var x = -3 + i;
                    var y = 0;
                    var z = -3;
                    return x + ' ' + heightScale(d.percentage) / 2 + ' ' + z;
                },
                radius: function(d) {
                    return 0.1
                },
                color: function(d) {
                    return d.color;
                },
                height: 0
            });

        bars.transition()
            .duration(3000)
            .attr('height', function(d) {
                return heightScale(d.percentage);
            });

        bars.append('a-text')
            .attrs({
                value: function(d) {
                    return d.name;
                },
                color: 'black',
                position: function(d) {
                    return '0 ' + (-heightScale(d.percentage) / 2 - 0.1) + ' 0'
                },
                align: 'center'
            });

        bars.append('a-text')
            .attrs({
                value: function(d) {
                    return d.percentage;
                },
                color: 'black',
                position: function(d) {
                    return '0 ' + (heightScale(d.percentage) / 2 + 0.2) + ' 0'
                },
                align: 'center'
            })

        d3.select('#map')
            .attr('visible', false);

        d3.select('.exit')
            .on('click', function() {
                d3.select('#map')
                    .attr('visible', true);
                d3.selectAll('.detail')
                    .remove();
            });
    }
});
