function init(){

var w = 900;
var h = 600;
var padding = 100;
var dataset;
    // Load data from CSV file and parse it
    d3.csv("sources/GDP.csv", function(d) {
        return {
        date: new Date(+d.date),
        GdpG: +d.GdpG,
        UnemploymentR:+d.UnemploymentR,
        SchoolEnrollmentR: +d.SchoolEnrollmentR
      };
    }).then(function(data) {
      dataset = data;
      // Set x and y scales
      var xScale = d3.scaleLinear()
                      .domain([
                        d3.min(dataset, function(d) { return d.date; }),
                        d3.max(dataset, function(d) { return d.date; })
                      ])
                      .range([padding, w - padding]);
      var yScale = d3.scaleLinear()
                      .domain([0, d3.max(dataset, function(d) { return Math.max(d.GdpG, d.UnemploymentR, d.SchoolEnrollmentR); })])
                      .range([h - padding, padding]);
      // Add the x-axis and y-Axis to the chart
      var xAxis = d3.axisBottom(xScale)
                    .ticks(5);
  
      var yAxis = d3.axisLeft(yScale);

      // Set the line generator functions
      var lineGdpG = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.GdpG); });

      var lineUnemploymentR = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.UnemploymentR); });

      var lineSchoolEnrollmentR = d3.line()
        .x(function(d) { return xScale(d.date); })
        .y(function(d) { return yScale(d.SchoolEnrollmentR); });

      // Add the area shape to the chart
      var area = d3.area()
                    .x(function(d) { return xScale(d.date); })
                    .y0(function() { return yScale.range()[0]; })
                    .y1(function(d) { return yScale(d.GdpG); })

      // Create the SVG element
      var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      var tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("display", "none");
      // Append circles and tooltips for GdpG data
      svg.selectAll("circle.gdp")
      .data(dataset)
      .enter()
      .append("circle")
      .attr("class", "gdp")
      .attr("cx", function(d) { return xScale(d.date); })
      .attr("cy", function(d) { return yScale(d.GdpG); })
      .attr("r", 3)
      .attr("fill", "blue")
      .on("mouseover", function(d) {
        svg.append("text")
            .attr("id", "tooltip_gdp")
            .attr("x", xScale(d.date) + 5)
            .attr("y", yScale(d.GdpG) - 5)
            .text("Date: " + d.date + "GDP Growth: " + d.GdpG);
        d3.select(this)
          .attr("fill", "orange");
      })
      .on("mouseout", function() {
        svg.select('#tooltip_gdp').remove();
        d3.select(this).attr("fill", "blue");
      });
  
      // Append circles and tooltips for UnemploymentR data
      svg.selectAll("circle.unemployment")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "unemployment")
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.UnemploymentR); })
        .attr("r", 3)
        .attr("fill", "green")
        .on("mouseover", function(d) {
          // Show tooltip
          tooltip.style("display", "inline")
            .html("Date: " + d.date + "<br/>Unemployment Rate: " + d.UnemploymentR);
    
          // Highlight circle
          d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.style("display", "none");
    
          // Restore circle color
          d3.select(this).attr("fill", "green");
        });
    
      // Append circles and tooltips for SchoolEnrollmentR data
      svg.selectAll("circle.school-enrollment")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "school-enrollment")
        .attr("cx", function(d) { return xScale(d.date); })
        .attr("cy", function(d) { return yScale(d.SchoolEnrollmentR); })
        .attr("r", 3)
        .attr("fill", "red")
        .on("mouseover", function(d) {
          // Show tooltip
          tooltip.style("display", "inline")
            .html("Date: " + d.date + "<br/>School Enrollment Rate: " + d.SchoolEnrollmentR);
    
          // Highlight circle
          d3.select(this).attr("fill", "orange");
        })
        .on("mouseout", function() {
          // Hide tooltip
          tooltip.style("display", "none");
    
          // Restore circle color
          d3.select(this).attr("fill", "red");
        });

      svg.append("path")
        .datum(dataset)
        .attr("fill", "none") //#FFD3D9
        .attr("class", "area")
        .attr("d", area);
  
        svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", lineGdpG);
  
      svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 2)
        .attr("d", lineUnemploymentR);
  
      svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2)
        .attr("d", lineSchoolEnrollmentR);
      
      //xAxis
      svg.append("g")
          .attr("transform", "translate(0," + (h - padding) + ")")
          .call(xAxis);
      //yAxis
      svg.append("g")
          .attr("transform", "translate(" + padding + ",0)")
          .call(yAxis);
    });
}

window.onload = init;
