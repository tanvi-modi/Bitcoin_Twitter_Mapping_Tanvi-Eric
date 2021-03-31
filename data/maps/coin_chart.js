d3.csv("./data/1000tweets_bitcoin.csv").then(function (data) {

    /*
    DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    const width = document.querySelector("#chart3").clientWidth;
    const height = document.querySelector("#chart3").clientHeight;
    const margin = { top: 50, left: 50, right: 50, bottom: 150 };

    const svg = d3.select("#chart3")
        .append("svg")
        .attr("width", width)
        .attr("height", height);



    var data = [{ "count": 112, "geo_location": "Los Angeles, CA" },{ "count": 31, "geo_location": "Chicago, IL" },{ "count": 29, "geo_location": "Manhattan, NY" },{ "count": 20, "geo_location": "Austin, TX" },{ "count": 20, "geo_location": "Minneapolis, MN" },{ "count": 18, "geo_location": "Brooklyn, NY" },{ "count": 18, "geo_location": "Bronx, NY" },{ "count": 18, "geo_location": "Macedonia, OH" },{ "count": 17, "geo_location": "Baltimore, MD" },{ "count": 16, "geo_location": "San Diego, CA" },{ "count": 16, "geo_location": "Staten Island, NY" },{ "count": 16, "geo_location": "Staten Island, NY" },{ "count": 16, "geo_location": "Burlington, MA" },{ "count": 15, "geo_location": "Anaheim, CA" },
    { "count": 14, "geo_location": "Philadelphia, PA" },  { "count": 11, "geo_location": "Portsmouth, VA" } ]

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("r",function(d) { return d.count })
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style('fill', 'orange')
        .style("fill-opacity", 0.3)
        .attr("stroke", "yellow")
        .style("stroke-width", 4)
        .on("mouseover", function(e, d) {
    
            d3.select(this)
            .attr("stroke", "white")
            .attr("stroke-width", 10);
    
            tooltip.style("visibility", "visible") 
        .html(`<b>count: ${d.count}</b><br><b>geo_location:</b> ${d.geo_location}`)
        .style("top", (event.pageY)-170+"px")
        .style("left",(event.pageX)-170+"px");
    
    
    
    }).on("mouseout", function() {
    
        tooltip.style("visibility", "hidden") ;

    d3.select(this)
    .attr("stroke", "yellow");
    
        


    })
;
        
    
    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
       .force('center', d3.forceCenter(width / 2, height / 2)) // Attraction to the center of the svg area
        .force('charge', d3.forceManyBody().strength(30)) // Nodes are attracted one each other of value is > 0
        //.force("collide", d3.forceCollide().strength(1.0).radius(38).iterations(1)) // Force that avoids circle overlapping
        .force('collision', d3.forceCollide().radius(function(d) {
            return d.count
          }))
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });
    
    


        
    });

