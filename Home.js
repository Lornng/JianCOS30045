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
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "grey");
        //Include <g> element in SVG
    var g = svg.append("g");
    
    //READ IN DATA/JSON
    d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(function(data){

        console.log(data);
        //topojson.feature(TopoJSON object, TopoJSON object that want to convert to GeoJSON)
        var countries = topojson.feature(data, data.objects.countries);

        g.selectAll("path")
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            //set each d attribute of the of the 'path' as country
            .attr("d", path)
            .on("mouseover", function(d){
                d3.select(this)
                    .classed("selected", true)
            })
            .on("mouseout", function(){
                d3.select(this)
                    .classed("selected", false)
            })
    })
}
window.onload = init; 