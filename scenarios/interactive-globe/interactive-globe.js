var thisComponent;
var dataPointer;

var allEarthquakes;
var clusteredEarthquakes;
var globeRadius;

var dbscanner;

var magnitudeScale;
var colorScale;
var radiusScale;

var isOverview = true;

AFRAME.registerComponent('show-earthquakes', {
    schema: {
        src: {
            type: 'asset'
        },
        radiusOfGlobe: {
            type: 'int'
        }
    },
    init: function() {
        thisComponent = this;
        dataPointer = this.data;
        globeRadius = dataPointer.radiusOfGlobe;

        d3.json(dataPointer.src, function(earthquakes) {
            allEarthquakes = earthquakes.features;

            dbscanner = jDBSCAN().eps(500).minPts(0).data(allEarthquakes);
            console.log("START: " + performance.now());
            dbscanner();
            console.log("END:" + performance.now());

            // clusters of earthquakes
            clusteredEarthquakes = dbscanner.getClusters();

            // Scales for earthquakes
            // numbers are hardcoded; experts can choose appropriate numbers
            magnitudeScale = d3.scaleLinear()
                .domain([0, 7])
                .range([0.05, 0.3]);
            colorScale = d3.scaleLinear()
                .domain([1, 3.5, 6])
                .range(['#0F0', '#FF0', '#F00']);

            // additional scale for clusters' radius
            radiusScale = d3.scaleLog()
                .domain([1, 300, 100000])
                .range([0.02, 0.2, 0.2])

            thisComponent.initClusterAndDetailedView();
            thisComponent.clusterOverview();
        });
    },
    initClusterAndDetailedView: function() {
        var scene = d3.select('#target');
        var clusters = scene.selectAll('a-cylinder')
            .data(clusteredEarthquakes)
            .enter()
            .append('a-cylinder')
            .classed('earthquake', true)
            .attrs({
                height: function(d) {
                    return magnitudeScale(d.averageMagnitude);
                },
                position: function(d) {
                    // because height of cylinder grows up and down
                    currentRadius = globeRadius + magnitudeScale(d.averageMagnitude) / 2;
                    // convert lat(geometry[1]) and long(geometry[0]) in cartesian coordinates
                    var x = currentRadius * Math.cos(inradians(d.location.latitude)) * Math.cos(inradians(d.location.longitude));
                    var y = currentRadius * Math.sin(inradians(d.location.latitude))
                    var z = -(currentRadius * Math.cos(inradians(d.location.latitude)) * Math.sin(inradians(d.location.longitude)))
                    return x + ' ' + y + ' ' + z
                },
                rotation: function(d) {
                    // cylinders stand on the surface in a right angle
                    var xRot = -(90 - d.location.latitude)
                    var yRot = -(90 - d.location.longitude)
                    return xRot + ' ' + yRot + ' 0'
                },
                radius: function(d) {
                    return radiusScale(d.dimension);
                },
                color: function(d) {
                    return colorScale(d.maxMagnitude)
                },
                visible: false
            });

        clusters
            .on('raycaster-intersected', function(d) {
                console.log(d);
            });

            var earthquakes = scene.selectAll('a-cone')
                .data(allEarthquakes)
                .enter()
                .append('a-cone')
                .classed('earthquake', true)
                .attrs({
                    height: function(d) {
                        return magnitudeScale(d.properties.mag);
                    },
                    position: function(d) {
                        // because height of cylinder grows up and down radius has to be adjusted
                        currentRadius = globeRadius + magnitudeScale(d.properties.mag) / 2;
                        // convert latitude(geometry[1]) and longitude(geometry[0]) in cartesian coordinates
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
                    'radius-bottom': '0.02',
                    'radius-top': '0',
                    color: function(d) {
                        return colorScale(d.properties.mag)
                    },
                    visible: false
                });
    },
    clusterOverview: function() {
        $('#info-box').fadeOut();
        var inradians = function(degrees) {
            return degrees * (Math.PI / 180);
        }

        var scene = d3.select('#target');
        scene.selectAll('a-cone')
            .attr('visible', false);

        scene.selectAll('a-cylinder')
            .attr('visible', true);

    },
    detailedView: function() {
        d3.selectAll('a-cylinder');
        var scene = d3.select('#target');
        $('#info-box').fadeIn();

        scene.selectAll('a-cylinder')
            .attr('visible', false);
        var earthquakes = scene.selectAll('a-cone')
            .attr('visible', true);

        earthquakes
            .on('raycaster-intersected', function(d) {
                updateInformationBox(d);
            });
    },
    tick: function() {
        var earth = thisComponent.el.components.position.attrValue;
        var camera = thisComponent.el.sceneEl.querySelector("#camera").components.position.attrValue;
        var distance = Math.sqrt(Math.pow(earth.x - camera.x, 2) +
            Math.pow(earth.y - camera.y, 2) +
            Math.pow(earth.z - camera.z, 2));
        if (distance < 3 && isOverview === true) {
            thisComponent.detailedView();
            isOverview = false;
        }
        if (distance >= 3 && isOverview === false) {
            thisComponent.clusterOverview();
            isOverview = true;
        }
    }
});

// HELPER METHODS
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

function inradians(degrees) {
    return degrees * (Math.PI / 180);
}
