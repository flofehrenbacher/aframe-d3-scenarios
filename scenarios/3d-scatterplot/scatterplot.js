/* globals AFRAME */
AFRAME.registerComponent('scatterplot', {
    schema: {
        src: {
            type: 'asset'
        },
        xattribute: {
            type: 'string'
        },
        yattribute: {
            type: 'string'
        },
        zattribute: {
            type: 'string'
        },
        label: {
            type: 'string'
        },
        width: {
            type: 'number',
            default: 10
        },
        height: {
            type: 'number',
            default: 10
        },
        depth: {
            type: 'number',
            default: 10
        },
        labeled: {
            type: 'boolean',
            default: true
        },
        dataFlagSize: {
            type: 'number',
            default: 1
        }
    },
    init: function() {
        var scatterplot = d3.select(this.el);
        var dataPointer = this.data;
        var src = dataPointer.src;
        var x = dataPointer.xattribute;
        var y = dataPointer.yattribute;
        var z = dataPointer.zattribute;
        var label = dataPointer.label;
        var width = dataPointer.width;
        var height = dataPointer.height;
        var depth = dataPointer.depth;
        var labelled = dataPointer.labelled;
        var dataFlagSize = dataPointer.dataFlagSize;
        var rowConverter = function(d) {
            return {
                label: d[label],
                x: parseFloat(d[x]),
                y: parseFloat(d[y]),
                z: parseFloat(d[z])
            };
        }

        d3.select('#x-axis')
            .attr('value', x);

        d3.select('#y-axis')
            .attr('value', y);

        d3.select('#z-axis')
            .attr('value', z);

        d3.csv(src, rowConverter, function(data) {
            // xattribute
            var minX = d3.min(data, function(d) {
                return d['x'];
            });
            var maxX = d3.max(data, function(d) {
                return d['x'];
            });
            var xScale = d3.scaleLinear()
                .domain([minX, maxX])
                .range([0 + (dataFlagSize/2), width - (dataFlagSize/2)]);

            var xColorScale = d3.scaleLinear()
                .domain([minX, maxX])
                .range(['white', '#543407']);

            // yattribute
            var minY = d3.min(data, function(d) {
                return d['y']
            });
            var maxY = d3.max(data, function(d) {
                return d['y']
            });
            var yScale = d3.scaleLinear()
                .domain([minY, maxY])
                .range([0 + (dataFlagSize/2), width - (dataFlagSize/2)]);

            var yColorScale = d3.scaleLinear()
                .domain([minY, maxY])
                .range(['white', '#991a1a']);

            // zattribute
            var minZ = d3.min(data, function(d) {
                return d['z']
            });
            var maxZ = d3.max(data, function(d) {
                return d['z']
            });
            var zScale = d3.scaleLinear()
                .domain([minZ, maxZ])
                .range([0, depth]);
            var zColorScale = d3.scaleLinear()
                .domain([minZ, maxZ])
                .range(['white', '#1b8424']);


            var points = scatterplot.selectAll('a-entity.point')
                .data(data)
                .enter()
                .append('a-entity')
                .classed('point', true)
                .attrs({
                    position: function(d, i) {
                        return '0 0 0'
                    }
                });

            points.append('a-text')
                .classed('detail', true)
                .attrs({
                    value: function(d) {
                        return (z + ': ' + d['z'] +
                            '\n\n\n' + x + ': ' + d['x'] +
                            '\n\n\n' + y + ': ' + d['y']);
                    },
                    color: 'black',
                    position: '0 0 0',
                    width: dataFlagSize * 2,
                    align: 'center'
                });

            points.append('a-animation')
                .attrs({
                    attribute: 'position',
                    to: function(d) {
                        return xScale(d['x']) + ' ' + yScale(d['y']) + ' ' + (-zScale(d['z']));
                    },
                    dur: '2000'
                })

            points.append('a-plane')
                .attrs({
                    width: dataFlagSize,
                    height: dataFlagSize / 3,
                    color: function(d) {
                        return xColorScale(d['x']);
                    }
                });

            points.append('a-plane')
                .attrs({
                    color: function(d) {
                        return zColorScale(d['z'])
                    },
                    position: '0 ' + dataFlagSize / 3 + ' 0',
                    width: dataFlagSize,
                    height: dataFlagSize / 3
                });

            points.append('a-plane')
                .attrs({
                    color: function(d) {
                        return yColorScale(d['y'])
                    },
                    position: '0 ' + -dataFlagSize / 3 + ' 0',
                    width: dataFlagSize,
                    height: dataFlagSize / 3
                });

            points.append('a-text')
                .classed('label', true)
                .attrs({
                    value: function(d) {
                        return d['label']
                    },
                    position: '0 ' + 2.2 * (dataFlagSize / 3) + ' 0',
                    width: dataFlagSize * 8,
                    align: 'center',
                    visible: function(d) {
                        if (labelled === false) {
                            return false;
                        } else {
                            return true;
                        }
                    }
                });

            points.on('click', function(d) {
                var selected = d3.select(this);
                var all = scatterplot.selectAll('a-entity.point');
                if (labelled === false) {
                    selected.select('a-text.label')
                        .attr('visible', true);
                }
                all.attr('visible', false);
                selected.attr('scale', '7 7 7')
                    .attr('visible', true)
                    .selectAll('a-plane');
                selected.on('click', function() {
                    selected.attr('scale', '1 1 1');
                    all.attr('visible', true);
                    if (labelled === false) {
                        selected.select('a-text.label')
                            .attr('visible', false);
                    }
                });
            });
        });
    }
});
