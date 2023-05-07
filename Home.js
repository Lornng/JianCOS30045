function init(){

    //Initialize
    var w = 900;
    var h = 600;

    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h)
                .attr("fill", "grey");

    d3.json("https://unpkg.com/world-atlas@1.1.4/world/110m.json").then(function(data){
        console.log(data);
        
        var countries = topojson.feature(data, data.objects.countries);

    })
}
window.onload = init; 