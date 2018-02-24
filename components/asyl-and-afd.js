/* globals AFRAME */
AFRAME.registerComponent('scatterplot', {
    schema: {
        datasrc: {
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
        height: {
            type: 'number'
        },
        depth: {
            type: 'number'
        },
        width: {
            type: 'number'
        }
    },
    init: function() {
        var dataPointer = this.data;
        var x = dataPointer.xattribute;
        var y = dataPointer.yattribute;
        var z = dataPointer.zattribute;
        var label = dataPointer.label;
        var width = dataPointer.width;
        var height = dataPointer.height;
        var depth = dataPointer.depth;
        console.log(width);
        var rowConverter = function(d) {
            return {
                label: d[label],
                x: parseFloat(d[x]),
                y: parseFloat(d[y]),
                z: parseFloat(d[z])
            };
        }
        d3.csv(dataPointer.datasrc, rowConverter, function(data) {
            var boxDimension = width / data.length - 0.1;

            // xattribute
            var minX = d3.min(data, function(d) {
                return d['x'];
            });
            var maxX = d3.max(data, function(d) {
                return d['x'];
            });
            var xScale = d3.scaleLinear()
                .domain([minX, maxX])
                .range([0 + boxDimension, width + boxDimension]);

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
                .range([0, height]);
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
                .range([0 + boxDimension, depth + boxDimension]);
            var zColorScale = d3.scaleLinear()
                .domain([minZ, maxZ])
                .range(['white', '#1b8424']);


            var scatterplot = d3.select('#scatterplot');
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

            points
                .append('a-animation')
                .attrs({
                    attribute: 'position',
                    to: function(d){
                        return xScale(d['x']) + ' '+ yScale(d['y']) +' ' + (-zScale(d['z']));
                    },
                    dur: '2000'
                })

            points
                .append('a-plane')
                .attrs({
                    width: boxDimension,
                    height: boxDimension / 3,
                    color: function(d) {
                        return xColorScale(d['x']);
                    }
                });

            points
                .append('a-plane')
                .attrs({
                    color: function(d) {
                        return zColorScale(d['z'])
                    },
                    position: '0 ' + boxDimension / 3 + ' 0',
                    width: boxDimension,
                    height: boxDimension / 3
                });

            points
                .append('a-plane')
                .attrs({
                    color: function(d) {
                        return yColorScale(d['y'])
                    },
                    position: '0 ' + -boxDimension / 3 + ' 0',
                    width: boxDimension,
                    height: boxDimension / 3
                });

            points
                .append('a-text')
                .attrs({
                    value: function(d) {
                        return d['label']
                    },
                    position: '0 ' + boxDimension + ' 0',
                    width: 8,
                    align: 'center'
                });

            points
                .on('mouseenter', function(d) {
                    var selected = d3.select(this);
                    selected.attr('scale', '7 7 7');
                    selected
                        .append('a-text')
                        .classed('detail', true)
                        .attrs({
                            value: (y + ': ' + d['y'] +
                                '\n\n\n' + x + ': ' + d['x'] +
                                '\n\n\n' + z + ': ' + d['z']),
                            color: 'black',
                            position: '0 0 0',
                            width: 1,
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
