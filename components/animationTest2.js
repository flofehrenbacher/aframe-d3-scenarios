AFRAME.registerComponent('animation-test2', {
    init: function() {
        d3.select('#cylinder')
            .on('click', function(){
                d3.select(this)
                    .attr('animation',function(){
                        return {
                            property: 'height',
                            to: '10'
                        }
                    })
            })
        // d3.select("#cylinder")
        //     .transition()
        //     .duration(3000)
        //     .attr("height",'0');

    }
});
