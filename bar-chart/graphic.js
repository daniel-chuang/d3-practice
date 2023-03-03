import * as d3 from 'https://unpkg.com/d3?module'

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {

    // Setting up the years
    var yearsDate = data.data.map(function (item) {
      return new Date(item[0]);
    });


    const w = 896;
    const h = 600;

    const space = w / (data.data.length + 1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.data, (d) => d[1])])
      .range([h - 20, 0]);

    
    var xScale = d3.scaleTime()
    .domain(d3.extent(yearsDate))
    .range([0, w]);

    const svg = d3.select("div")
      .append("svg")
      .attr("width", w + 60)
      .attr("height", h + 100)
      .attr("id", "title");

    // Making tooltip
    let tooltip = d3.select("div")
      .append("span")
      .attr("id", "tooltip");

    function moveTooltip(event) {
      const [x, y] = d3.pointer(event);
      tooltip.style("top", `${h}px`);
      tooltip.style("left", `${x + 10 + ((window.innerWidth - w) / 2)}px`);
    }

    svg.selectAll("rect")
      .data(data.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", (d) => d[0])
      .attr("data-gdp", (d) => d[1])
      .attr("fill", "red")
      .attr("x", (d, i) => i * space + 50)
      .attr("y", (d, i) => yScale(d[1]) + 20)
      .attr("width", space - 1)
      .attr("height", (d) => h - 20 - yScale(d[1]))
      .on("mouseover", (event, d) => {
        moveTooltip(event);
        tooltip.html("<p>" + d[1] + " Billion</p>");
        tooltip.attr("data-date", d[0])
      })
      ;

      // Adding axis
      const yAxis = d3.axisLeft(yScale);
      const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat('%Y'));

      // For y axis
      svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 20 + ")")
        .call(yAxis)
        .attr("id", "y-axis");

      // For x axis
      svg.append("g")
        .attr("transform", "translate(" + 50 + "," + h + ")")
        .call(xAxis)
        .attr("id", "x-axis");

      // Adding axis label
      svg.append("text")
        .text("Gross Domestic Product, in billions of dollars")
        .attr("transform", "rotate(-90)")
        .attr("x", -330)
        .attr("y", 80)
  });