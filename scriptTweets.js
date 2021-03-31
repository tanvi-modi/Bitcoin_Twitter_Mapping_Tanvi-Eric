const margin = {t: 100, r:100, b: 100, l: 100};
const size = {w: 1200, h: 800};
const svg = d3.select('svg');




// defining a container group
// which will contain everything within the SVG
// we can transform it to make things everything zoomable
const containerG = svg.append('g').classed('container', true);
let mapData, tweetData;
let bubblesG, radiusScale, colorScale, projection;

svg.attr('width', size.w)
    .attr('height', size.h);

// defining zoom function
let zoom = d3.zoom()
    .scaleExtent([1, 8])
    // everytime we scroll or double click on the SVG
    // 'zoomed' function will be called
    .on("zoom", zoomed);

// attaching zoom function to SVG
svg.call(zoom);

// loading data
Promise.all([
    d3.json('data/maps/us-states.geo.json'),
    d3.csv('data/1000tweets_bitcoin.csv'),


]).then(function (datasets) {
    mapData = datasets[0];
    tweetData = datasets[1];


    // --------- DRAW MAP ----------
    // creating a group for map paths
    let mapG = containerG.append('g').classed('map', true);

    // defining a projection that we will use
    projection = d3.geoAlbersUsa()
        .fitSize([size.w, size.h], mapData)
        .scale(1234);;

    // defining a geoPath function
    let path = d3.geoPath(projection);

    // adding county paths
    mapG.selectAll('path')
        .data(mapData.features)
        .enter()
        .append('path')
        .attr('d', function(d) {
            return path(d);
        });

    // --------- DRAW BUBBLES ----------
    // creating a group for bubbles
    bubblesG = containerG.append('g').classed('bubbles', true);

    // defining a scale for the radius of bubbles
    radiusScale = d3.scaleSqrt()
        .domain(d3.extent(tweetData, d => +d.count))
        .range([3, 50]);
    

        opacityScale = d3.scaleSqrt()
        .domain(d3.extent(tweetData, d => +d.count))
        .range([0.8, 0.5]);
    



    drawBubbles();
});





function drawBubbles(scale = 1) {
    // creating a bubbles selection
    let bubblesSelection = bubblesG.selectAll('circle')
        .data(tweetData, d => d.key);

    console.log(tweetData[0])
    // creating/updating circles
    bubblesSelection
        .join('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .style('fill', 'orange')
        .style('opacity', d => opacityScale(d.count))
        // projection is the function that translates lat,long
        // to the x,y coordinates on our 2D canvas
        .attr('transform', d => 'translate('+projection([d.longitude, d.latitude])+')')
        // dividing by scale
        // to make the circles adjust for particular zoom levels
        .attr('r', d => radiusScale(+d.count)/scale)
        .on("mouseover", function(e, d) {

            d3.select(this)
            .attr("r", radiusScale(+d.count)/scale)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
    
    tooltip.style("visibility", "visible") 
        .html(`No.of Tweets: <b> ${d.count}</b> <br>City | State:<b> ${d.geo_location}</b> </br>`)
        .style("top", (event.pageY)-100+"px")
        .style("left",(event.pageX)-90+"px");


}).on("mouseout", function() {

    tooltip.style("visibility", "hidden");

    d3.select(this)
        .attr("r", d => radiusScale(+d.count)/scale)
        .attr("stroke", "none");


});;
}

function zoomed(event) {
    // event contains the transform variable
    // which tells us about the zoom-level
    let transform = event.transform;
    containerG.attr("transform", transform);
    containerG.attr("stroke-width", 1 / transform.k);

    // adjust the bubbles according to zoom level
    drawBubbles(transform.k);
}

const tooltip = d3.select("#chart1")
.append("div")
.attr("class", "tooltip1");

///////////////////////

