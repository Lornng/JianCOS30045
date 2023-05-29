function init(){

  var w = 1000;
  var h = 600;
  var padding = 50;
  var dataset;

  // Load data from CSV file and parse it
  d3.csv("sources/GDP.csv", function(d) {
    return {
      date: +d.date,
      GdpG: +d.GdpG,
      UnemploymentR: +d.UnemploymentR,
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
      .domain([
        d3.min([0, d3.min(dataset, function(d) { return d.GdpG; })]),
        d3.max([0, d3.max(dataset, function(d) { return d.SchoolEnrollmentR; })])
      ])
      .range([h - padding, padding]);

      // Set the line generator function
      var line = d3.line()
        .x(function(d) {
          return xScale(d.date);
        })
        .y(function(d) {
          return yScale(d.GdpG);
        });

        var lineUnemploymentR = d3.line()
  .x(function(d) {
    return xScale(d.date);
  })
  .y(function(d) {
    return yScale(d.UnemploymentR);
  });

var lineSchoolEnrollmentR = d3.line()
  .x(function(d) {
    return xScale(d.date);
  })
  .y(function(d) {
    return yScale(d.SchoolEnrollmentR);
  });


    // Create the SVG element
    var svg = d3.select("#chart")
      .append
      ("svg")
        .attr("width", w)
        .attr("height", h);

        // Add the line to the chart
      svg.append("path")
        .datum(dataset)
        .attr("fill", "none")
        .attr("stroke", "#3f88c5")
        .attr("stroke-width", 1.5)
        .attr("d", line);
        svg.append("path")
  .datum(dataset)
  .attr("fill", "none")
  .attr("stroke", "red") // change the stroke color to differentiate the lines
  .attr("stroke-width", 1.5)
  .attr("d", lineUnemploymentR);

svg.append("path")
  .datum(dataset)
  .attr("fill", "none")
  .attr("stroke", "green") // change the stroke color to differentiate the lines
  .attr("stroke-width", 1.5)
  .attr("d", lineSchoolEnrollmentR);

      // Add the x-axis and y-axis to the chart
      var xAxis = d3.axisBottom()
        .ticks(10)
        .scale(xScale);

      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + yScale(0) + ")")
        .call(xAxis);

      var yAxis = d3.axisLeft()
        .ticks(8)
        .scale(yScale);

      svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

     
  // -1- Create a tooltip div that is hidden by default:
  var tooltip = d3.select("#chart")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white");

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  var showTooltipGdpG = function(event, d) {
  tooltip
    .transition()
    .duration(200);
  tooltip
    .style("opacity", 1)
    .html("Year: " + d.date + "<br/>GDP Growth: " + d.GdpG + "%")
    .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
}

var showTooltipUnemploymentR = function(event, d) {
  tooltip
    .transition()
    .duration(200);
  tooltip
    .style("opacity", 1)
    .html("Year: " + d.date + "<br/>Unemployment rate: " + d.UnemploymentR + "%")
    .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
}

var showTooltipSchoolEnrollmentR = function(event, d) {
  tooltip
    .transition()
    .duration(200);
  tooltip
    .style("opacity", 1)
    .html("Year: " + d.date + "<br/>School Enrolment: " + d.SchoolEnrollmentR + "%")
    .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
}

var moveTooltip = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  var hideTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

      // Add circles for GdpG data points
svg.append('g')
.selectAll(".point-gdpg")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "point-gdpg")
  .attr("cx", function(d) { return xScale(d.date); })
  .attr("cy", function(d) { return yScale(d.GdpG); })
  .attr("r", 3)
  .on("mouseover", showTooltipGdpG)
  .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );

// Add circles for UnemploymentR data points
svg.append('g')
.selectAll(".point-unemployment")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "point-unemployment")
  .attr("cx", function(d) { return xScale(d.date); })
  .attr("cy", function(d) { return yScale(d.UnemploymentR); })
  .attr("r", 3)
  .on("mouseover", showTooltipUnemploymentR)
  .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );

// Add circles for SchoolEnrollmentR data points
svg.append('g')
.selectAll(".point-enrollment")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "point-enrollment")
  .attr("cx", function(d) { return xScale(d.date); })
  .attr("cy", function(d) { return yScale(d.SchoolEnrollmentR); })
  .attr("r", 3)
  .on("mouseover", showTooltipSchoolEnrollmentR)
  .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip );

        svg.append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "middle")
  .attr("x", w / 2)
  .attr("y", h - 40)
  .text("Date");

    });
  }
    window.onload = init;
