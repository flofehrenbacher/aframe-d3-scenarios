AFRAME.registerComponent('barchart', {
    init: function() {
        d3.csv('election-result-2017.csv', function(electionData){
            var heightScale = d3.scaleLinear()
                .domain([0,32.9])
                .range([0,3]);

            var scene = d3.select('a-scene');
            var bars = scene.selectAll('a-cylinder')
                .data(electionData)
                .enter()
                .append('a-cylinder')
                .attr('position', function(d,i) {
                    return i-2*0.8 + ' ' + heightScale(d.result)/2 + ' -5';
                })
                .attr('height', function(d) { return heightScale(d.result) })
                .attr('color', function(d) { return d.color })
                .attr('radius', 0.3);
        });
    }
});
