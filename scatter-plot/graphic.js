import * as d3 from 'https://unpkg.com/d3?module'

// First, get the data fetched in
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {

    // Setting up the SVG
    const w = 896;
    const h = 600;
    const w_buff = 40;
    const h_buff = 40;

    var svg = d3.select("div")
      .append("svg")
      .attr("width", w + 2 * w_buff)
      .attr("height", h + (2 * h_buff) + 20); // Adding +20 for the axis

    // Setting up the axis
    // xAxis
    const xScale = d3.scaleLinear()
      .domain([1993, 2016])
      .range([0, w])
    
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));

    svg.append("g")
      .attr("transform", "translate(" + w_buff + "," + (h + h_buff) + ")")
      .call(xAxis)
      .attr("id", "x-axis");

    // yAxis
    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, (d) => {
        return d.Seconds;
      }))
      .range([0, h]);
    
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", "translate(" + w_buff + "," + h_buff + ")")
      .call(yAxis)
      .attr("id", "y-axis");


    // Drawing circles for the scatterplot
    var circles = svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.Year) + w_buff)
      .attr("cy", (d) => yScale(d.Seconds) + h_buff)
      .attr("r", (d) => 7.5)
      .attr("fill", (d) => d.Doping.length == 0 ? "green" : "red")
      .attr("opacity", "0.7")
      .attr("stroke", "black")
      .attr("stroke-width", `2px`)
      ;

    // Creating a legend
    svg.append("rect")
    .attr("x", w - 2 * w_buff - 50)
    .attr("y", 5 * h_buff)
    .attr("width", 195)
    .attr("height", 90)
    .attr("fill", "white")
    .attr("opacity", "0.7")
    .attr("stroke", "black")
    .attr("stroke-width", `2px`)

    svg.append("rect")
    .attr("x", w - 2 * w_buff - 30)
    .attr("y", 5 * h_buff + 20)
    .attr("width", 2 * 6.5)
    .attr("height", 2 * 6.5)
    .attr("fill", "red")
    .attr("opacity", "0.7")
    .attr("stroke", "black")
    .attr("stroke-width", `2px`)

    svg.append("text")
    .attr("x", w - 2 * w_buff - 10)
    .attr("y", 5 * h_buff + 20 + 12)
    .text("Doping allegations")

    svg.append("rect")
    .attr("x", w - 2 * w_buff - 30)
    .attr("y", 5 * h_buff + 50)
    .attr("width", 2 * 6.5)
    .attr("height", 2 * 6.5)
    .attr("fill", "green")
    .attr("opacity", "0.7")
    .attr("stroke", "black")
    .attr("stroke-width", `2px`)

    svg.append("text")
    .attr("x", w - 2 * w_buff - 10)
    .attr("y", 5 * h_buff + 50 + 12)
    .text("No doping allegations")
    
    // Defining the div for the tooltip
    var tooltip = d3
      .select("body")
      .append("div")
      .style("width", "fit-content")
      .style("height", "fit-content")
      .style("padding", "12px")
      .style("background-color", "LightGray")
      .style("pointer-events", "none")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0)
      .style("border", "solid")
      .style("border-radius", "8px")
      .style("position", "absolute");

    // Making a function for when the tooltip is activated
    function showTooltip(event) {
      const [x, y] = d3.pointer(event);
      console.log("showing tooltip");
      console.log(window.innerWidth);
      tooltip.style("opacity", 100);
      tooltip.text("testing");
    }

    // Making the function trigger when a dot is hovered
    circles
      .on("mouseover", (event, d) => {
        showTooltip(event);
        tooltip.style("display", "")
        tooltip.attr('data-year', d.Year);
        tooltip.style("left", xScale(d.Year) + w_buff + ((window.innerWidth - (w + 2 * w_buff)) / 2) + "px");
        console.log(document.getElementById("tooltip").offsetHeight);
        tooltip.style("top", yScale(d.Seconds) + h_buff + document.getElementById("tooltip").offsetHeight + "px");
        tooltip.html(
          `<h3>${d.Name}, ${d.Nationality}</h3>
          <p>Year: ${d.Year}, Time: ${d.Time}</p>
          <p>${d.Doping}</p>
          `);
      })
      .on("mouseout", () => tooltip.style("display", "none"));
  })