import * as d3 from 'https://unpkg.com/d3?module';

// First, get the data fetched in
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
fetch("./map.json")
  .then((response) => response.json())
  .then((us) => {
  
  // Setting up the SVG dimensions
  const h = 1000;
  const w = 670;

  const fontSize = 15;
  const padding = {
    left : fontSize * 9,
    right : fontSize * 9,
    top : fontSize * 1,
    bottom : fontSize * 9,
  }

  // Setting up the SVG
  var svg = d3.select("div")
    .append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("id", "graphic");

  // Making the map
  var projection = d3.geoMercator()
    .scale(2000)
    .center([34.5,38.5])
    .translate([w/2,h/2]);
  var path = d3.geoPath()
    .projection(projection);

  console.log(topojson.feature(us, us.objects.counties).features);
  console.log(path);

  svg
    .append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("d", path);

}) // End us
}) // End data