import * as d3 from 'https://unpkg.com/d3?module'

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data.data);

    const w = 1120;
    const h = 730;

    const space = w / (data.data.length + 1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data.data, (d) => d[1])])
      .range([h, 0]);

    const svg = d3.select("body")
      .append("svg")
      .attr("width", w + 50)
      .attr("height", h + 100)
      .attr("id", "title")

    // Making tooltip
    let tooltip = d3.select("body")
      .append("span")
      .attr("class", "tooltip");

    function moveTooltip(event) {
      console.log("moving tooltip");
      const [x, y] = d3.pointer(event);
      tooltip.style("top", `${h}px`);
      tooltip.style("left", `${x + 10}px`);
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
      .attr("y", (d, i) => yScale(d[1]))
      .attr("width", space - 1)
      .attr("height", (d) => h - yScale(d[1]))
      .on("mouseover", (event, d) => {
        moveTooltip(event);
        tooltip.html("<p>" + d[1] + " Billion</p>");
        tooltip.text(data.data[i] + "Billion");
      })
      ;

      // Adding axis
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
        .attr("transform", "translate(" + 50 + "," + 0 + ")")
        .call(yAxis);

      // Adding axis label
      svg.append("text")
        .text("Gross Domestic Product, in billions of dollars")
        .attr("transform", "rotate(-90)")
        .attr("x", -300)
        .attr("y", 80)
  });