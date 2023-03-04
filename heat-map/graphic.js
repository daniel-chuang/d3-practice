import * as d3 from 'https://unpkg.com/d3?module';

// First, get the data fetched in
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {

  // Setting up the SVG dimensions
  const block_h = 33;
  const h = block_h * 12;
  
  const block_w = 6;
  const w = block_w * Math.ceil(data.monthlyVariance.length / 12);

  const fontSize = 15;
  const padding = {
    left : fontSize * 9,
    right : fontSize * 9,
    top : fontSize * 1,
    bottom : fontSize * 9,
  }

  // Setting up the svg
  var svg = d3.select("div")
    .append("svg")
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom)
    .attr("id", "description")
  ;

  // Setting up the axis
  function month_num_to_string(month) {
    var date = new Date('December 17, 1995 03:24:00');
    date.setMonth(month);
    return date.toLocaleString([], { month: 'long' });
  }

  // y-axis
  var yScale = d3.scaleBand()
    .domain([0,1,2,3,4,5,6,7,8,9,10,11])
    .range([0, h])
    .round(true);

  var yAxis = d3.axisLeft(yScale)
    .tickValues(yScale.domain())
    .tickFormat(month => month_num_to_string(month))
    .tickSize(10, 1)
    ;

  svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding.left}, ${padding.top})`)
    .append("text")
    .style("text-anchor", "middle")
    .text("Months")
    .attr("transform", `translate( ${(-7 * fontSize)}, ${h / 2} ) rotate(-90)`)
    .attr("fill", "black")
    ;

  // x-axis
  var xScale = d3.scaleLinear()
    .domain(d3.extent(data.monthlyVariance, (d) => {
      return d.year;
    }))
    .range([padding.left, w + padding.left])
    ;


  const xAxis = d3.axisBottom(xScale)
    .tickFormat((year) => {
      return String(year);
    })
    .ticks(Math.floor((xScale.domain()[1] - xScale.domain()[0]) / 10))
    ;

  svg.append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${padding.top + h})`)
    .append("text")
    // .style("text-anchor", "middle")
    .text("Years")
    .attr("transform", `translate(${(w) / 2}, ${fontSize * 3})`)
    .attr("fill", "black")
    ;

  // Plotting out the data
  // For making the colors of the fill
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateRdYlBu)
    .domain(d3.extent(data.monthlyVariance, (d) => {
      return data.baseTemperature + d.variance;
    }).reverse());

  var data_rects = svg.selectAll("rect")
    .data(data.monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d) => {
      return yScale(d.month - 1) + (block_h / 2);
    })
    .attr("width", block_w)
    .attr("height", block_h)
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => data.baseTemperature + d.variance)
    .attr("fill", (d) => {
      return myColor(data.baseTemperature + d.variance);
    })
    ;

  // Making the tooltip
  var tooltip = d3.select("body")
    .append("div")
    .style("width", "fit-content")
    .style("height", "fit-content")
    .style("padding", "12px")
    .style("background", "rgba(200, 200, 200, 0.8)")
    .style("pointer-events", "none")
    .attr("class", "tooltip")
    .attr("id", "tooltip")
    .style("border", "solid")
    .style("border-radius", "8px")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("justify-content", "center");
  
  data_rects
    .on("mouseover", function(event, d) {
      tooltip
        .html(`
          ${month_num_to_string(d.month - 1)}, ${d.year}
          <br>
          ${(data.baseTemperature + d.variance).toFixed(2)} &#x2103
          <br>
          ${d.variance > 0 ? "+" + (d.variance).toFixed(2) : (d.variance).toFixed(2)} &#x2103
        `)
      tooltip
        .style("margin", `12px 0 0 -${tooltip.node().clientWidth / 2 - 12}px`)
        .style("top", yScale(d.month - 1) + (block_h / 2) + "px")
        .attr("data-year", d.year)
        .style("left", xScale(d.year) + "px");
      tooltip
        .transition()
        .style("opacity", 0.9);
      d3.select(this)
        .attr("stroke-width", "2px")
        .attr("stroke", "black");
      this.parentNode.appendChild(this);
    })
    .on("mouseout", function(event, d) {
      tooltip
        .transition()
        .style("opacity", 0);
        
      d3.select(this)
        .attr("stroke-width", "0px");
    });
})