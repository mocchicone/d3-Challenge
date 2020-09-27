//setting svg dimension
var svgWidth = 825;
var svgHeight = 500;

//setting margin
var margin = {
    top: 60,
    right: 60,
    bottom: 90,
    left: 90
  };

//setting chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

//appending svg area to HTML
var svg = d3.select(".article")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

//import csv data and perform error check
d3.csv("assets/data/data.csv").then((data, err) => {
    if (err) throw err;
    console.log(data);

    //converting data to numbers
    data.forEach(data => {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obesity = +data.obesity;
        data.income = +data.income;
    })

    //set up default value
    var xvalue = "poverty";
    var yvalue = "healthcare";

    //function to scale x axis
    function xScale (data, xvalue) {
        var xLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, data => data[xvalue]))
            .range([0, chartWidth])
        return xLinearScale;
    }

    //function to scale y axis
    function yScale (data, yvalue) {
        var yLinearScale = d3.scaleLinear()
            .domain(d3.extent(data, data => data[yvalue]))
            .range([chartHeight, 0])
        return yLinearScale;
    }

    //function to transition x axis
    function renderxaxis(xscale, xaxis) {
        var bottomAxis = d3.axisBottom(xscale);
        xaxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xaxis;
    }

    //function to transition y axis
    function renderyaxis(yscale, yaxis) {
        var leftAxis = d3.axisLeft(yscale);
        yaxis.transition()
            .duration(1000)
            .call(leftAxis);
        return yaxis;
    }

    //function to transition circles
    function renderxCircles(circles, xscale, xaxis) {

        circles.transition()
          .duration(1000)
          .attr("cx", data => xscale(data[xaxis]));
      
        return circles;
      }

    //function to transition circles
    function renderyCircles(circles, yscale, yaxis) {

        circles.transition()
            .duration(1000)
            .attr("cy", data => yscale(data[yaxis]));
        
        return circles;
    }

    //function to transition text box
    function renderxText(circles, xscale, xaxis) {

        circles.transition()
            .duration(1000)
            .attr("dx", d => xscale(d[xaxis])-10);
        
        return circles;
    }

    //function to transition text box
    function renderyText(circles, yscale, yaxis) {

        circles.transition()
            .duration(1000)
            .attr("dy", d => yscale(d[yaxis])+8);
        
        return circles;
    }

    //function to update tooltip
    function updateToolTip(circlesGroup, xvalue, yvalue) {
        var toolTip = d3.tip()
            .attr("class", "tooltip")
            .offset([80, -60])
            .html(function(d) {
                return (`${d.state}<br>${xvalue}: ${d[xvalue]}<br>${yvalue}: ${d[yvalue]}`);
            });

        circlesGroup.call(toolTip);

        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data, this);
            })
            // onmouseout event
            .on("mouseout", function(data, index) {
            toolTip.hide(data);
            });

        return circlesGroup;
    }

        //setting default values and scales
        var xLinearScale = xScale(data, xvalue);
        var yLinearScale = yScale(data, yvalue);

        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis =  d3.axisLeft(yLinearScale);

        //appending chart and moving them by margin
        var chartGroup = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .attr("id", "chart");

        //appending axis
        var xAxis = chartGroup.append("g")
            .attr("transform", `translate(0, ${chartHeight})`)
            .call(bottomAxis);

        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        //appending circles
        var circlesGroup = chartGroup.selectAll("g circle")
            .data(data)
            .enter()
            .append("g");

        var circles = circlesGroup.append("circle")
            .attr("cx", d => xLinearScale(d[xvalue]))
            .attr("cy", d => yLinearScale(d[yvalue]))
            .attr("r", "15")
            .attr("fill", "pink")
            .attr("stroke", "red")
            .attr("opacity", ".5");

        //appending text
        var circletext = circlesGroup.append("text")
            .text(d => d.abbr)
            .attr("dx", d => xLinearScale(d[xvalue]) - 10)
            .attr("dy", d => yLinearScale(d[yvalue]) + 8);


        //appending axis titles
        var xaxis = chartGroup.append("g")
        var yaxis = chartGroup.append("g")
        var healthcare = yaxis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("value", "healthcare")
            .attr("id", "yaxis")
            .classed("active", true)
            .text("Lacks Healthcare (%)");
        var smokes = yaxis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("value", "smokes")
            .attr("id", "yaxis")
            .classed("inactive", true)
            .text("Smokes (%)");
        var obesity = yaxis.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (chartHeight / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .attr("value", "obesity")
            .attr("id", "yaxis")
            .classed("inactive", true)
            .text("Obese (%)");

        var poverty = xaxis.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 20})`)
            .attr("class", "axisText")
            .attr("value", "poverty")
            .attr("id", "xaxis")
            .classed("active", true)
            .text("Poverty (%)");
        var age = xaxis.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top})`)
            .attr("class", "axisText")
            .attr("value", "age")
            .attr("id", "xaxis")
            .classed("inactive", true)
            .text("Age (median)");
        var income = xaxis.append("text")
            .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top - 20})`)
            .attr("class", "axisText")
            .attr("value", "income")
            .attr("id", "xaxis")
            .classed("inactive", true)
            .text("Income (median)");
    
        //handles clicks on xaxis
        xaxis.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            xvalue = value;
            xLinearScale = xScale(data, xvalue);
            xAxis = renderxaxis(xLinearScale, xAxis);

            circles = renderxCircles(circles, xLinearScale, xvalue);
            circletext = renderxText(circletext, xLinearScale, xvalue);
            circlesGroup = updateToolTip(circlesGroup, xvalue, yvalue);
            if (xvalue === "income") {
                income
                  .classed("active", true)
                  .classed("inactive", false);
                poverty
                  .classed("active", false)
                  .classed("inactive", true);
                age
                  .classed("active", false)
                  .classed("inactive", true);
              } else if (xvalue === "poverty") {
                income
                  .classed("active", false)
                  .classed("inactive", true);
                poverty
                  .classed("active", true)
                  .classed("inactive", false);
                age
                  .classed("active", false)
                  .classed("inactive", true);
              } else {
                income
                  .classed("active", false)
                  .classed("inactive", true);
                poverty
                  .classed("active", false)
                  .classed("inactive", true);
                age
                  .classed("active", true)
                  .classed("inactive", false);
              }
        })

        //handles clicks on yaxis
        yaxis.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            yvalue = value;
            yLinearScale = yScale(data, yvalue);
            yAxis = renderyaxis(yLinearScale, yAxis);

            circles = renderyCircles(circles, yLinearScale, yvalue);
            circletext = renderyText(circletext, yLinearScale, yvalue);
            circlesGroup = updateToolTip(circlesGroup, xvalue, yvalue);

            if (yvalue === "healthcare") {
                healthcare
                  .classed("active", true)
                  .classed("inactive", false);
                smokes
                  .classed("active", false)
                  .classed("inactive", true);
                obesity
                  .classed("active", false)
                  .classed("inactive", true);
              } else if (yvalue === "smokes") {
                healthcare
                  .classed("active", false)
                  .classed("inactive", true);
                smokes
                  .classed("active", true)
                  .classed("inactive", false);
                obesity
                  .classed("active", false)
                  .classed("inactive", true);
              } else {
                healthcare
                  .classed("active", false)
                  .classed("inactive", true);
                smokes
                  .classed("active", false)
                  .classed("inactive", true);
                obesity
                  .classed("active", true)
                  .classed("inactive", false);  
              }
        })

    
  }).catch(function(error) {
    console.log(error);

});
© 2020 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
Pricing
API
Training
Blog
About


var textGroup = chartGroup.append("g")
.selectAll("text")
.data(journalismData)
.enter()
.append("text")
.attr("x", d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.healthcare))
.attr("text-anchor", "middle")
.attr("font-family", "sans-serif")
.attr("alignment-baseline", "middle")
.style("font-size", "10px")
.attr("fill", "#fff")
.text(d => d.abbr);