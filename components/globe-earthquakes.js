// https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=-34.44076&lon=-58.70521
/* globals AFRAME */
AFRAME.registerComponent('show-earthquakes', {
    schema: {
        dataSrc: {
            type: 'asset'
        },
        radiusOfGlobe: {
            type: 'int'
        },
        isBars: {
            type: 'boolean',
            default: true
        }
    },
    init: function() {
        this.initBarsAsCylinders();
    },
    initBarsAsCylinders: function() {
        var dataPointer = this.data;

        d3.json(dataPointer.dataSrc, function(worldData) {
            var data = worldData.features;
            var globeRadius = dataPointer.radiusOfGlobe;

            var inradians = function(degrees) {
                return degrees * (Math.PI / 180);
            }
            var maxMag = d3.max(data, function(d) {
                return d.properties.mag;
            });
            var minMag = d3.min(data, function(d) {
                return d.properties.mag;
            });

            var magnitudeScale = d3.scaleLinear()
                .domain([minMag, maxMag])
                .range([0.1, 0.3]);

            var colorScale = d3.scaleLinear()
                .domain([minMag, (maxMag + minMag) / 2, maxMag])
                .range(['#0F0', '#FF0', '#F00']);

            var scene = d3.select('#target');

            var earthquakes = scene.selectAll('a-cone')
                .data(data)
                .enter()
                .append('a-cone')
                .classed('earthquake', true)
                .attrs({
                    height: function(d) {
                        return magnitudeScale(d.properties.mag);
                    },
                    position: function(d) {
                        // because height of cylinder grows up and down
                        currentRadius = globeRadius + magnitudeScale(d.properties.mag) / 2;
                        // convert lat(geometry[1]) and long(geometry[0]) in cartesian coordinates
                        var x = currentRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.cos(inradians(d.geometry.coordinates[0]));
                        var y = currentRadius * Math.sin(inradians(d.geometry.coordinates[1]))
                        var z = -(currentRadius * Math.cos(inradians(d.geometry.coordinates[1])) * Math.sin(inradians(d.geometry.coordinates[0])))
                        return x + ' ' + y + ' ' + z
                    },
                    rotation: function(d) {
                        // cylinders stand on the surface in a right angle
                        var xRot = -(90 - d.geometry.coordinates[1])
                        var yRot = -(90 - d.geometry.coordinates[0])
                        return xRot + ' ' + yRot + ' 0'
                    },
                    'radius-bottom': '0.05',
                    'radius-top': '0.05',
                    color: function(d) {
                        return colorScale(d.properties.mag)
                    }
                });

            earthquakes
                .on('raycaster-intersected', function(d) {
                    updateInformationBox(d);
                });
        });

        function updateInformationBox(d) {
            $.get('mustache/info-box.mst', function(template) {
                var time = new Date(d.properties.time);
                var rendered = Mustache.render(template, {
                    d: d,
                    time: time
                });
                $('#info-box').html(rendered);
            });
        }
    },
    changeToCones: function(){
        console.log("now");
        var scene = d3.select('#target');
        $('#info-box').fadeIn();
        var earthquakes = scene.selectAll('a-cone')
            .attrs({
                'radius-bottom': '0.01',
                'radius-top': '0'
            })
    },
    changeToBars: function(){
        console.log("now");
        var scene = d3.select('#target');
        $('#info-box').fadeOut();
        var earthquakes = scene.selectAll('a-cone')
            .attrs({
                'radius-bottom': '0.05',
                'radius-top': '0.05',
            })
    },
    tick: function(){
            var earth = this.el.components.position.attrValue;
            var camera = this.el.sceneEl.querySelector("#camera").components.position.attrValue;
            var distance = Math.sqrt(Math.pow(earth.x-camera.x,2)+
                                    Math.pow(earth.y-camera.y,2)+
                                    Math.pow(earth.z-camera.z,2));
            console.log(distance);
            if(distance<3 && this.data.isBars === true){
                this.changeToCones();
                this.data.isBars = false;
            }
            if(distance>=3 && this.data.isBars === false){
                this.changeToBars();
                this.data.isBars = true;
            }
    }
});
