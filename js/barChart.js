import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function barChart(selector, data, attributes = { width: 700, height: 400, margin: { top: 50, right: 30, bottom: 70, left: 60 } }) {
    const { width, height, margin } = attributes;

    // Preprocess the data to count items by Genre
    const genreCounts = {};
    data.forEach(d => {
        genreCounts[d.Genre] = (genreCounts[d.Genre] || 0) + 1;
    });
    const processedData = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));

    // Create SVG container
    const svgBarChart = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("font-family", "'Poppins', sans-serif")
        .style("background", "linear-gradient(to bottom, #f9f9f9, #e9e9e9)")
        .style("border-radius", "10px")
        .style("box-shadow", "0px 4px 10px rgba(0, 0, 0, 0.15)");

    // Define scales
    const xScale = d3.scaleBand()
        .domain(processedData.map(d => d.genre))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(processedData, d => d.count)])
        .range([height - margin.bottom, margin.top]);

    // Add axes with styled fonts
    svgBarChart.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "14px")
        .style("fill", "#333");

    svgBarChart.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "14px")
        .style("fill", "#333");

    // Add bars with gradient fill and shadow
    const defs = svgBarChart.append("defs");
    defs.append("linearGradient")
        .attr("id", "bar-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%")
        .selectAll("stop")
        .data([
            { offset: "0%", color: "#6c5ce7" },
            { offset: "100%", color: "#74b9ff" }
        ])
        .enter()
        .append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);

    svgBarChart.selectAll(".bar")
        .data(processedData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.genre))
        .attr("y", height - margin.bottom)
        .attr("width", xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "url(#bar-gradient)")
        .style("filter", "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))")
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("y", d => yScale(d.count))
        .attr("height", d => height - margin.bottom - yScale(d.count));

    // Tooltip with smooth styling
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#ffffff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "8px")
        .style("padding", "10px")
        .style("box-shadow", "0px 2px 10px rgba(0, 0, 0, 0.1)")
        .style("font-size", "14px")
        .style("color", "#333");

    svgBarChart.selectAll(".bar")
        .on("mouseover", function (event, d) {
            tooltip.style("visibility", "visible").html(`
                <strong>${d.genre}</strong><br>
                Count: ${d.count}
            `);
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "#00cec9");
        })
        .on("mousemove", function (event) {
            tooltip.style("top", `${event.pageY - 40}px`).style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
            d3.select(this)
                .transition()
                .duration(200)
                .attr("fill", "url(#bar-gradient)");
        });

    // Add chart title
    svgBarChart.append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "#2d3436")
        .text("TV Shows and Movies by Genre");

    // Add Y-axis label
    svgBarChart.append("text")
        .attr("x", -(height / 2))
        .attr("y", margin.left / 3)
        .attr("transform", "rotate(-90)")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#2d3436")
        .text("Count");

    // Add X-axis label
    svgBarChart.append("text")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "#2d3436")
        .text("Genre");
}
