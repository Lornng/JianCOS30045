function init(){

    //Initialize
    var w = 900;
    var h = 600;

    var projection = d3.geoMercator()
    .translate([w/2, h/1.4]);

    var path = d3.geoPath()
                    .projection(projection);

    var svg = d3.select("#world_map")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    //Include <g> element in SVG
    var g = svg.append("g");
    
    var zoom = d3.zoom()
                    .on("zoom", zoomed);

    svg.call(zoom);

    function zoomed(){
        g.attr('transform', d3.event.transform);
    }

    //Add reset button
    d3.select("#reset").on("click", function() {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });
        

    //Load TSV and JSON data concurrenntly using Promise.all()
    Promise.all([
        d3.tsv("https://unpkg.com/world-atlas@1.1.4/world/50m.tsv"),
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json")
    ]).then(function (results){
        var tsvData = results[0];
        var topoData = results[1];

        //convert TopoJSON to GeoJSON
        var countries = topojson.feature(topoData, topoData.objects.countries);

        //use this to bring in the country name
        var countryName = tsvData.reduce(function(obj, d) {
            obj[d.iso_n3] = d.name;
            return obj;
          }, {});
        
        //Append <path> element to the <g> element
        g.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            //set each d attribute of the of the 'path' as country
            .attr("d", path)
            .on("mouseover", function(d) {
                //Get the country name from the countryName object
                var country = countryName[d.id];
                //Update the text element with the country name
                svg.append('text')
                    .attr('id', 'tooltip')
                    .attr('x', 10)
                    .attr('y', 30)
                    .attr('fill', 'white')
                    .style('font-size', '20px')
                    .text("Country Name: " + countryName[d.id]);
            })
            .on("mouseout", function() {
                //Reset the text element to an empty string
                svg.select('#tooltip').remove();
            });
    })

}
window.onload = init; 