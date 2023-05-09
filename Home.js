function init(){

    //Initialize
    var w = 900;
    var h = 600;

    var projection = d3.geoMercator()
    .translate([w/2, h/1.4]);

    var path = d3.geoPath()
                    .projection(projection);
    

    var color = d3.scaleQuantize

    
    //APPEND
    var svg = d3.select("#world_map")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

        //Include <g> element in SVG
    var g = svg.append("g");
    
    //Load TSV and JSON data concurrenntly using Promise.all()
    Promise.all([
        d3.tsv("https://unpkg.com/browse/world-atlas@1.1.4/world/110m.tsv"),
        d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json")
    ]).then(function (results){
        var tsvData = results[0];
        var topoData = results[1];

        console.log(tsvData);
        console.log(topoData);

    })

    //READ IN DATA/JSON
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(function(data){
        //topojson.feature(TopoJSON object, TopoJSON object that want to convert to GeoJSON)
        var countries = topojson.feature(data, data.objects.countries);

        g.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            //set each d attribute of the of the 'path' as country
            .attr("d", path)
            .append("title")
            //.text(console.log(d))
    })
}
window.onload = init; 