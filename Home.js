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

    var colorScale = d3.scaleOrdinal();

    var colorValue = function(d){
        return d.properties.economy;
    };

    //Include <g> element in SVG
    var g = svg.append("g");
    
    var zoom = d3.zoom()
                    .on("zoom", zoomed);

    svg.call(zoom);

    function zoomed(){
        g.attr('transform', d3.event.transform);
    }

    // Add reset button
    var resetButton = svg.append("g")
                            .attr("id", "reset")
                            .attr("transform", "translate(" + (w - 100) + ",10)")
                            .style("cursor", "pointer");

    // Add button background
    resetButton.append("rect")
                .attr("width", 80)
                .attr("height", 30)
                .attr("rx", 5) // Rounded corners
                .style("fill", "#ddd");

    // Add text to reset button
    resetButton.append("text")
                .attr("x", 12)
                .attr("y", 20)
                .attr("font-size", "20px")
                .attr("font-weight", "bold")
                .attr("font-family", "sans-serif")
                .text("Reset");

    resetButton.on("click", function() {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });

    //Load TSV and JSON data concurrenntly using Promise.all()
    Promise.all([
        d3.tsv("sources/50m.tsv"),
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/50m.json"),
        d3.csv("sources/population_by_country_2020.csv")
    ]).then(function (results){
        var tsvData = results[0];
        var topoData = results[1];
        var popData = results[2];

        //convert TopoJSON to GeoJSON
        var countries = topojson.feature(topoData, topoData.objects.countries);

        //use this to bring in the country info
        var countryInfoByID = tsvData.reduce(function(obj, d) {
            //taking the entire data
            obj[d.iso_n3] = d;
            return obj;
          }, {});
        
        var popDataByCountry = {}

        popData.forEach(function(d){
            popDataByCountry[d.Country] = d["Migrants(net)"];
        });

        //merge the three datasets together
        countries.features.forEach(function(d){
            //d.properties will contain all of the properties fron each row of the tsv table
            Object.assign(d.properties, countryInfoByID[d.id]);
            d.properties.migrantsNet = popDataByCountry[d.properties.name];
        })

        colorScale.domain(countries.features.map(colorValue))
                    //reverse the sequence of the color display for the diff category of counrtry
                    .domain(colorScale.domain().sort().reverse())
                    .range(d3.schemeSpectral[colorScale.domain().length]);

        //Append <path> element to the <g> element
        g.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            //set each d attribute of the of the 'path' as country
            .attr("d", path)
            .attr("fill", function(d){
                return colorScale(colorValue(d));
            })
            .on("mouseover", function(d) {
                //Update the text element with the country name
                svg.append('text')
                    .attr('id', 'tooltip_country')
                    .attr('x', 10)
                    .attr('y', 25)
                    .attr('fill', 'white')
                    .style('font-size', '15px')
                    .text("Country Name: " + d.properties.name );

                svg.append('text')
                    .attr("id", "tooltip_continent")
                    .attr('x', 10)
                    .attr('y', 45)
                    .attr('fill', 'white')
                    .style('font-size', '15px')
                    .text("Continent: " + d.properties.region_un);
                
                svg.append('text')
                    .attr("id", "tooltip_pop")
                    .attr('x', 10)
                    .attr('y', 65)
                    .attr('fill', 'white')
                    .style('font-size', '15px')
                    .text("Population: " + d.properties.pop_est);

                svg.append('text')
                    .attr("id", "tooltip_migration")
                    .attr('x', 10)
                    .attr('y', 85)
                    .attr('fill', function() {
                        return d.properties.migrantsNet < 0 ? 'red' : 'white';
                    })
                    .style('font-size', '15px')
                    .text(function() {
                        if (d.properties.migrantsNet === '') {
                            return 'Migration: undefined';
                        } else {
                            return 'Migration: ' + d.properties.migrantsNet;
                        }
                    });
            })
            .on("mouseout", function() {
                //Reset the text element to an empty string
                svg.select('#tooltip_country').remove();
                svg.select('#tooltip_continent').remove();
                svg.select('#tooltip_pop').remove();
                svg.select('#tooltip_migration').remove();
            });

        //Create legend 
        //group element for legend
        var legend = svg.append("g")
                        .attr("class", "legend")
                        .attr("transform", "translate(" + (10) + "," + (h-200) + ")");
        
        var legendData = colorScale.domain().map(function(d){
            return {
                category: d, color: colorScale(d)
            };
        })
        console.log(legendData.length);
    
        // Add background to legend
        legend.append("rect")
                .attr("x", -5)
                .attr("y", -5)
                .attr("rx", 5)
                .attr("width", 240)
                .attr("height", legendData.length * 25 + 10)
                .attr("fill", "white")
                .attr("opacity", 0.5);

        var legendBoxes = legend.selectAll(".legent-boxes")
                                .data(legendData)
                                .enter()
                                .append("rect")
                                .attr("class", "legend-boxes")
                                .attr("x", 0)
                                .attr("y", function(d,i){
                                    return i*25;
                                })
                                .attr("width", 20)
                                .attr("height", 20)
                                .attr("fill", function(d){
                                    return d.color;
                                })
                                .attr("rx", 5);

        var legendLabels = legend.selectAll("text")
                                    .data(legendData)
                                    .enter()
                                    .append("text")
                                    .attr("x", 25)
                                    .attr("y", function(d, i){
                                        return i*25 + 15;
                                    })
                                    .text(function(d){
                                        return d.category;
                                    })
                                    .style("font-family", "sans-serif");

    })

}
window.onload = init; 