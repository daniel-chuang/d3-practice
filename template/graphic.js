import * as d3 from 'https://unpkg.com/d3?module';

// First, get the data fetched in
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
fetch("./map.json")
  .then((response) => response.json())
  .then((map_data) => {
  
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

}) // End map_data
}) // End data