import React, { useRef, useEffect }from "react";
import * as d3 from "d3";

function LineChart({ alldata, topic }) {
    
    const svgRef = useRef();
    const wrapperRef = useRef();

    useEffect(() => {
        
        const margin = {top: 10, right: 40, bottom: 20, left: 40},
            width = 450 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        const parseTime = d3.timeParse("%Y");

        const data = alldata[topic];
        console.log(data);
        data.forEach(d => d.year = parseTime(d.year));
        
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d.year))
            .range([margin.left + 20, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.probability) - (d3.max(data, d => d.probability) - d3.min(data, d => d.probability))/5, d3.max(data, d => d.probability) + (d3.max(data, d => d.probability) - d3.min(data, d => d.probability))/5])
            .range([height, 5]);
        
        const xAxis = d3.axisBottom()
            .scale(xScale)
        
        const yAxis = d3.axisLeft()
            .scale(yScale)

        const groupedData = Array.from(d3.group(data, d => d.keyword), ([key, values]) => ({key, values}))
        const keyword = groupedData.map(d => d.key) 

        const color = d3.scaleOrdinal()
            .domain(keyword)
            .range(d3.schemeCategory10);
        
        const tooltip = d3.select(wrapperRef.current)
            .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("font-size", ".7rem");

        const svg = d3.select(svgRef.current);

        svg.selectAll('*').remove();

        svg.attr("width", 450)
            .attr("height", 400)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
              
        svg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0, ${height})`)
                .call(xAxis)
            .append("text")
                .attr("text-anchor", "end")
                .attr("x", width + 10) 
                .attr("y", margin.bottom + 10) 
                .text("Year")
                .style("fill", "black")
                .style("font-size", 12);

        svg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(${margin.left + 20}, 0)`) 
                .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "end")
                .attr("x", -5) 
                .attr("y", -45) 
                .text("Weight")
                .style("fill", "black")
                .style("font-size", 12);

        svg.selectAll(".line")
            .append("g")
                .attr("class", "line")
                .data(groupedData)
                .join("path")
                .attr("d", function (d) {
                    return d3.line()
                        .x(d => xScale(d.year))
                        .y(d => yScale(d.probability))
                        (d.values)
                })
                .attr("fill", "none")
                .attr("stroke", d => color(d.key))
                .attr("stroke-width", 2);
                
        svg.selectAll(".circle")
            .append("g")
                .data(data)
                .join("circle")
                .attr("r", 3)
                .attr("cx", d => xScale(d.year))
                .attr("cy", d => yScale(d.probability))
                .style("fill", d => color(d.keyword))
                .on("mouseover", function(event, d) {
                    var matrix = this.getScreenCTM()
                    .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));
                    
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("r", 5);
                    tooltip
                        .transition()
                        .duration(100)
                        .style("opacity", 1);
                    tooltip
                        .html(d3.format(".5f")(d.probability))
                        .style("left", window.pageXOffset + matrix.e + 15 + "px")
                        .style("top", window.pageYOffset + matrix.f - 30 + "px");
                    })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr("r", 3);
                    tooltip
                        .transition()
                        .duration(100)
                        .style("opacity", 0)
                    });
        
        svg.selectAll(".legend")
            .append("g")
                .attr("class", "legend")
                .data(groupedData)
                .join("circle")
                .attr("cx", 385)
                .attr("cy", (d, i) => i * 20 + 100)
                .attr("r", 3)
                .style("fill", d => color(d.key));

        svg.selectAll(".legend")
            .append("g")
                .data(groupedData)
                .join("text")
                .attr("x", 390)
                .attr("y", (d, i) => i * 20 + 105)
                .attr("font-size", 10)
                .text(d => d.key)
                .style("fill", "black");
        
    }, [alldata, topic]);

    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default LineChart;