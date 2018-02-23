AFRAME.registerComponent('animation-test', {
    init: function() {
        var testLength = 200;
        var testData = [];

        var heightScale = d3.scaleLinear()
            .domain([0, testLength])
            .range([0, 4]);

        var colorScale = d3.scaleLinear()
            .domain([0, testLength / 2, testLength])
            .range(['red', 'orange', 'green']);

        for (var i = 1; i <= testLength; i++) {
            testData.push(i);
        }

        var scene = d3.select('a-scene');
        var bars = scene.selectAll('a-cylinder')
            .data(testData).enter()
            .append('a-cylinder')
            .attrs({
                position: function(d, i) {
                    var x = i * 0.5 - 4;
                    var y = heightScale(d) / 2;
                    var z = -4;
                    return x - testLength * 0.5 + 7 + ' ' + y + ' ' + z
                },
                radius: 0.2,
                height: function(d) {
                    return 0
                },
                color: function(d) {
                    return colorScale(d)
                },
                shadow: ''
            });

        console.log("START");
        var start = performance.now();

        /* ######################## ANIMATION USING D3 ###################### */
        bars
            .transition()
            .duration(3000)
            .attr('height', function(d) {
                return heightScale(d).toFixed(3)
            })
            .on("end", function(d) {
                if (d == testLength) {
                    var end = performance.now();
                    console.log("ANIMATION USING D3");
                    console.log("TESTLENGTH: " + testLength);
                    console.log("ended after " + (end - start));
                }
            });

        /* ################ ANIMATION USING NATIVE AFRAME ################### */
        // bars
        //     .append('a-animation')
        //     .attrs({
        //         attribute: 'height',
        //         to: function(d) {
        //             return heightScale(d).toFixed(3)
        //         },
        //         dur: '3000'
        //     })
        // counter = 1;
        // document.addEventListener('animationend', function(event) {
        //     if (counter == testLength) {
        //         var end = performance.now();
        //         console.log("ANIMATION USING NATIVE AFRAME");
        //         console.log("TESTLENGTH: " + testLength);
        //         console.log("ended after " + (end - start));
        //     }
        //     counter++;
        // });

        /* ################ ANIMATION USING ANIMATION COMPONENT AFRAME ###### */
        // bars
        //     .attrs({
        //         animation: function(d, i) {
        //             return {
        //                 'property': 'height',
        //                 'dur': '3000',
        //                 'to': heightScale(d).toFixed(3),
        //                 'autoplay': 'true'
        //             };
        //         }
        //     });
        // counter = 1;
        // document.addEventListener('animationcomplete', function(event) {
        //     if (counter == testLength) {
        //         var end = performance.now();
        //         console.log("ANIMATION USING COMPONENT AFRAME");
        //         console.log("TESTLENGTH: " + testLength);
        //         console.log("ended after " + (end - start));
        //     }
        //     counter++;
        // });
    }
});
