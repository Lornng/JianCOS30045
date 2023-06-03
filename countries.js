  // Margin, width, and height
  var margin = { top: 20, right: 20, bottom: 50, left: 60 };
  var width = 900 - margin.left - margin.right;
  var height = 600 - margin.top - margin.bottom;

  // Load data from ASIA.csv
  d3.csv("sources/ASIA.csv").then(function(data) {
    var dataset = data;
    var activeColumn = "2020"; // Initially set to "2020"

    // Define X Scale
    var xScale = d3
      .scaleBand()
      .domain(dataset.map(function(d) {
        return d.Countries;
      }))
      .range([0, width])
      .padding(0.1);

    // Define Y Scale
    var yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(dataset, function(d) {
          return +d["2020"];
        })
      ])
      .range([height, 0])
      .nice();

    // Create an SVG element and set its attributes
    var svg = d3
      .select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw the bars
    var bars = svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(d.Countries);
      })
      .attr("y", function(d) {
        return yScale(+d[activeColumn]);
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) {
        return height - yScale(+d[activeColumn]);
      })
      .attr("fill", "orange");

// Add text labels to the bars
var labels = svg
  .selectAll(".bar-label")
  .data(dataset)
  .enter()
  .append("text")
  .attr("class", "bar-label")
  .attr("x", function(d) {
    return xScale(d.Countries) + xScale.bandwidth() / 2;
  })
  .attr("y", function(d) {
    return yScale(+d[activeColumn]) - 10;
  })
  .attr("text-anchor", "middle")
  .style("fill", "white") // Set label color to white
  .style("font-size", "12px") // Adjust the font size as needed
  .text(function(d) {
    return d[activeColumn];
  })
  .style("visibility", "hidden"); // Initially hide the labels


// Add mouseover event listener to the bars
bars.on("mouseover", function(d, i) {
  d3.select(this)
    .attr("fill", "orange") // Change bar color on mouseover
    .attr("opacity", 0.7); // Adjust bar opacity on mouseover
  
  labels
    .filter(function(labelData, labelIndex) {
      return labelIndex === i;
    })
    .style("visibility", "visible"); // Show label on mouseover
})
.on("mouseout", function(d, i) {
  d3.select(this)
    .attr("fill", "orange") // Restore original bar color on mouseout
    .attr("opacity", 1); // Restore original bar opacity on mouseout
  
  labels
    .filter(function(labelData, labelIndex) {
      return labelIndex === i;
    })
    .style("visibility", "hidden"); // Hide label on mouseout
});
 

    // Add x-axis to the chart
    var xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("fill", "white")
	  .style("font-size", "12px");

    // Add y-axis to the chart
    var yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
    svg.append("g")
	.call(yAxis)
	.selectAll("text")
	.style("fill", "white")
	.style("font-size", "10px");

    // Gridlines
    svg
      .insert("g", ":first-child")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-width)
          .tickFormat("")
      ) // Remove labels
      .selectAll(".tick line")
      .style("stroke-width", "1px") // Adjust the stroke
      .style("opacity", "0.3") // Adjust the opacity
      .style("stroke", "white"); // Set grid line color to white
	  
	  

    // Button event listeners
    d3.select("#button2020").on("click", function() {
      console.log("Button 2020 clicked");

      activeColumn = "2020";
      updateChart();
    });

    d3.select("#button2015").on("click", function() {
      console.log("Button 2050 clicked");

      activeColumn = "2015";
      updateChart();
    });

    d3.select("#button2010").on("click", function() {
      activeColumn = "2010";
      updateChart();
    });

    // Function to update the chart based on the active column
    function updateChart() {
      // Sort the dataset in descending order based on the active column
      dataset.sort(function(a, b) {
        return +b[activeColumn] - +a[activeColumn];
      });

      var max2020 = d3.max(dataset, function(d) {
        return +d["2020"];
      });
      var maxActive = d3.max(dataset, function(d) {
        return +d[activeColumn];
      });
      var maxYValue = Math.max(max2020, maxActive); //max value for setting the correct y axis

      yScale.domain([0, maxYValue]).nice();

      // Update the X-axis scale and reposition the X-axis
      xScale.domain(
        dataset.map(function(d) {
          return d.Countries;
        })
      );

      svg
        .select(".x-axis")
        .transition()
        .duration(500)
        .call(xAxis)
        .selectAll("text")
        .style("fill", "white");

      bars.transition().duration(500).attr("x", function(d) {
        return xScale(d.Countries);
      }).attr("y", function(d) {
        return yScale(+d[activeColumn]);
      }).attr("height", function(d) {
        return height - yScale(+d[activeColumn]);
      });

      labels.transition().duration(500).attr("x", function(d) {
        return xScale(d.Countries) + xScale.bandwidth() / 2;
      }).attr("y", function(d) {
        return yScale(+d[activeColumn]) - 5;
      }).text(function(d) {
        return d[activeColumn];
      });
    }
  });
