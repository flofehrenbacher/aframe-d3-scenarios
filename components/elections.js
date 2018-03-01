AFRAME.registerComponent('elections', {
    init: function() {
        var temp = this;
        var rowConverter = function(d) {
            return {
                bundesland: d.Bundesland,
                wahlbeteiligung: parseFloat(d.Wahlbeteiligung),
                parties: {
                    union: parseFloat(d.Union),
                    spd: parseFloat(d.SPD),
                    linke: parseFloat(d.DIE_LINKE),
                    gruene: parseFloat(d.GRÜNE),
                    fdp: parseFloat(d.FDP),
                    afd: parseFloat(d.AfD),
                    sonstige: parseFloat(d.Sonstige)
                },
                latitude: parseFloat(d.latitude),
                longitude: parseFloat(d.longitude)
            };
        }
        d3.csv('data/elections.csv', rowConverter, function(data) {
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
            var links = target.selectAll('a-link')
                .data(data)
                .enter()
                .append('a-link')
                .classed('link', true)
                .attrs({
                    position: function(d) {
                        var x = longitudeScale(d.longitude);
                        var z = latitudeScale(d.latitude);
                        var y = 0;
                        return x + ' ' + y + ' ' + z
                    }
                });

            links
                .append('a-text')
                .attrs({
                    value: function(d) {
                        return d.bundesland
                    },
                    color: 'black',
                    anchor: 'left',
                    position: '0.2 0 0',
                    rotation: '-20 0 0'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'black',
                    height: function(d) {
                        return heightScale(d.parties.union)
                    },
                    position: function(d) {
                        return '0 ' + heightScale(d.parties.union) / 2 + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'red',
                    height: function(d) {
                        return heightScale(d.parties.spd)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) + (heightScale(d.parties.spd) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'darkred',
                    height: function(d) {
                        return heightScale(d.parties.linke)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) +
                            heightScale(d.parties.spd) +
                            (heightScale(d.parties.linke) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'green',
                    height: function(d) {
                        return heightScale(d.parties.gruene)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) +
                            heightScale(d.parties.spd) +
                            heightScale(d.parties.linke) +
                            (heightScale(d.parties.gruene) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'yellow',
                    height: function(d) {
                        return heightScale(d.parties.fdp)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) +
                            heightScale(d.parties.spd) +
                            heightScale(d.parties.linke) +
                            heightScale(d.parties.gruene) +
                            (heightScale(d.parties.fdp) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: '#19bffc',
                    height: function(d) {
                        return heightScale(d.parties.afd)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) +
                            heightScale(d.parties.spd) +
                            heightScale(d.parties.linke) +
                            heightScale(d.parties.gruene) +
                            heightScale(d.parties.fdp) +
                            (heightScale(d.parties.afd) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .append('a-cylinder')
                .attrs({
                    color: 'grey',
                    height: function(d) {
                        return heightScale(d.parties.sonstige)
                    },
                    position: function(d) {
                        return '0 ' + (heightScale(d.parties.union) +
                            heightScale(d.parties.spd) +
                            heightScale(d.parties.linke) +
                            heightScale(d.parties.gruene) +
                            heightScale(d.parties.fdp) +
                            heightScale(d.parties.afd) +
                            (heightScale(d.parties.sonstige) / 2)) + ' 0'
                    },
                    radius: '0.2'
                });

            links
                .on('click', function(d) {
                    temp.detailedBarchart(d);
                })

            links
                .on('mouseenter', function(){
                    temp.hoverEffect(this);
                });
        });
    },
    hoverEffect: function(element){
        d3.select(element).attr('scale', '1.4 1 1.4');
        d3.select(element).on('mouseleave', function(){
            d3.select(element).attr('scale', '1 1 1');
        });
    },
    detailedBarchart: function(d) {
        var wahlbeteiligung = d.wahlbeteiligung;
        var bundesland = d.bundesland;
        var heightScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 3]);
        var parties = d.parties;
        var data = Object.keys(parties).map(function(key) {
            return parties[key];
        });
        var colorParties = d3.scaleOrdinal()
            .range(['black', 'red', 'darkred', 'green', 'yellow', '#19bffc', 'grey']);

        var nameParties = d3.scaleOrdinal()
            .range(['Union', 'SPD', 'DIE LINKE', 'GRÜNE', 'FDP', 'AfD', 'Sonstige']);

        var scene = d3.select('#camera');

        var bundeslandText = scene
            .append('a-text')
            .classed('detail', true)
            .attrs({
                value: function(){
                    return bundesland;
                },
                position: '0 -1 -3.5',
                width: 18,
                color: 'black',
                align: 'center'
            })

        bundeslandText
        .append('a-text')
        .classed('detail', true)
        .attrs({
            value: function(){
                return 'Wahlbeteiligung ' + wahlbeteiligung + '%';
            },
            position: '0 -1 0',
            width: 10,
            color: 'black',
            align: 'center'
        });

        scene
            .append('a-plane')
            .classed('link', true)
            .classed('exit', true)
            .classed('detail', true)
            .attrs({
                position: '0 0 -3.5',
                color: 'white'
            });

        var bars = scene.selectAll('a-cylinder')
            .data(data)
            .enter()
            .append('a-cylinder')
            .classed('detail', true)
            .attrs({
                radius: 0.6,
                position: function(d, i) {
                    var x = -3 + i;
                    var y = 0;
                    var z = -3;
                    return x + ' ' + heightScale(d) / 2 + ' ' + z;
                },
                radius: function(d) {
                    return 0.1
                },
                color: function(d) {
                    return colorParties(d);
                }
            });

        bars
            .transition()
            .duration(2000)
            .attr('height', function(d) {
                return heightScale(d);
            });

        bars
            .append('a-text')
            .attrs({
                value: function(d) {
                    return nameParties(d);
                },
                color: 'black',
                position: function(d) {
                    return '0 ' + (-heightScale(d) / 2 - 0.1) + ' 0'
                },
                align: 'center'
            });

        bars
            .append('a-text')
            .attrs({
                value: function(d) {
                    return d;
                },
                color: 'black',
                position: function(d) {
                    return '0 ' + (heightScale(d) / 2 + 0.2) + ' 0'
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
