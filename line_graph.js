

d3.csv("./data/btcdata1.csv").then(function (data) {

  /*
  SETTING UP THE SVG CANVAS
  */
  const width = document.querySelector("#chart3").clientWidth;
  const height = document.querySelector("#chart3").clientHeight;
  const margin = { top: 25, left: 175, right: 100, bottom: 75 };

  /*
  CREATE THE SVG CANVAS
  */
  const svg = d3.select("#chart3")
    .append("svg")
    .attr("width", width)
    .attr("height", height);


  /*
  DEFINE SCALES

  The scale for the x-axis will map each YEAR in the data set
  to x-position;

  the scale for the y-axis will map TOTAL HONEY PRODUCTION
  to y-position.

  In this example, both scales use d3.scaleLinear().

  */

  const xScale = d3.scaleLinear()
    .domain([1, 27])
    .range([margin.left, width - margin.right]);

  const yScale = d3.scaleLinear()
    .domain([5000, 60000])
    .range([height - margin.bottom, margin.top]);

  /*
  CREATE A LINE GENERATOR

  To create a line chart in D3, we need to use a "line generator"
  function that's built into the D3 language.

  This line generator function can be invoked with d3.line().

  The purpose of this generator will be to accept as input a series
  of x- and y-coordinate values, based on the data set, and to return
  as output a complete specification for an SVG "path" element.

  The d3.line().x() method controls how to compute the x-position
  of each point in the line we are creating; the d3.line().y() method 
  controls how to compute the y-position of each point in the line.
  Both of these methods are given accessor functions.

  In the example below, we are mapping the `year` property
  as the x-coordinate, and the `production` property as the
  y-coordinate for each point in the line.

  See the API for more information:
  https://github.com/d3/d3-shape/blob/v2.0.0/README.md#lines

  */
  const line = d3.line()
    .x(function (d) { return xScale(d.week); })
    .y(function (d) { return yScale(d.value); })
    .curve(d3.curveLinear);


  /*
  GENERATE AXES

  D3 has built in "axis constructors" that will automatically draw
  an axis for us, complete with tick marks and labels; these are built
  from scales we define elsewhere in the code, such as in the
  previous section

  */
  const xAxis = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom().scale(xScale).tickFormat(d3.format("Y")));

  const yAxis = svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft().scale(yScale));

  /*
  DRAW THE MARKS

  In this visualization, we will do two things:

  We'll first draw the line for our line chart, by appending a
  new "path" element to the SVG canvas and computing its geometry
  (through the "d" attribute) with the help of our line generator
  function above.

  Then, after that, we'll draw circles for each point on top
  of the line we've drawn. We're doing this so that we can
  later create a tooltip with these points.

  */

  const path = svg.append("path")
    .datum(data)
    .attr("d", function (d) { return line(d); })
    .attr("stroke", "#f7941d")
    .attr("fill", "none")
    .attr("stroke-width", 1);

  const circle = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return xScale(d.week); })
    .attr("cy", function (d) { return yScale(d.value); })
    .attr("r", 5)
    .attr("fill", "#f7941d");


  /*
  ADDING AXIS LABELS

  */
  svg.append("text")
    .attr("class", "labelAxis")
    .attr("x", width / 2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .attr("fill", "orange")
    .text("Week");

  svg.append("text")
    .attr("class", "labelAxis")
    .attr("x", -height / 2)
    .attr("y", 50)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("fill", "orange")
    .text("Bitcoin Value in USD ($)");

  /*
  SIMPLE TOOLTIP
 
  We begin by creating a new div element inside the #chart container, 
  giving it class 'tooltip'; note that this newly created div inherits 
  (receives) the CSS properties defined by the .tooltip { ... } rule 
  in the stylesheet
 
  */

  const tooltip1 = d3.select("#chart3")
    .append("div")
    .attr("class", "tooltip1");








  /*
  When we hover over any of the circles in the SVG, update the 
  tooltip position and text contents;
  
  note that `circle` here is a reference to the variable named 
  `circle` above (what is in that selection?)
  */

  circle.on("mouseover", function (e, d) {

    let cx = +d3.select(this).attr("cx");
    let cy = +d3.select(this).attr("cy");

    tooltip1.style("visibility", "visible")
      .style("left", `${cx}px`)
      .style("top", `${cy}px`)
      .html(`Week: <b>${d.week}</b> <br> Bitcoin Value in USD ($): <b>${parseFloat(d.value).toFixed(2)}</b>`);

    d3.select(this)
      .attr("stroke", "gray")
      .attr("stroke-width", 5)

  }).on("mouseout", function () {

    tooltip1.style("visibility", "hidden")

    d3.select(this)
      .attr("stroke", "none")
      .attr("stroke-width", 0);

  });




})