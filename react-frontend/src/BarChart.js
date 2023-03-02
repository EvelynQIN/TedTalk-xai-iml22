import * as d3 from "d3";
import React, { useRef, useEffect } from "react";

function BarChart({ tid, data, year, colors }){

    const svgRef = useRef();
    const wrapperRef = useRef();
    const height =150;
    const width =400;
    const marginTop = 40; // top margin, in pixels
    const marginRight = 30; // right margin, in pixels
    const marginBottom = 160; // bottom margin, in pixels
    const marginLeft = 30; // left margin, in pixels

    useEffect(() => {

        const topic_names = ["Music & Creativity", "Happiness", "Medicine", "Development",
                            "Environment", "Design", "Tech", "Story & Women"];

        const format = d3.format(",d");

        const full_title=d3.map(data.talks_detail, d => d.full_title); //array all full_title 
        var title_dict = {};
        for (var i = 0 ; i < full_title.length ; i++){
            title_dict[full_title[i]] = i;
        }
        const t_id = title_dict[tid];// t_id : index into the array

        const topic_distribution=d3.map(data.talks_detail,d => d.topic_distribution) //all topic_distribution

        const topic_dist = topic_distribution[t_id];//[10, 30, 40, 20];
        
        const url = data.talks_detail[t_id]["url"].slice(0, -5)
        const speaker = data.talks_detail[t_id]["speaker"]
        const event = data.talks_detail[t_id]["event"]
        const views = data.talks_detail[t_id]["views"]
        const description = data.talks_detail[t_id]["description"]
        const sentiment = data.talks_detail[t_id]["sentiment"]
       
        const tooltip = d3.select(wrapperRef.current)
            .append("div")
                .attr("class", "tooltip")
                .style("width", "450px")
                .style("opacity", 0)
                .style("position", "absolute")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "5px")
                .style("font-size", ".8rem");

        const svgEl = d3.select(svgRef.current)
            .attr("width", width + marginLeft + marginRight)
            .attr("height", height + marginBottom + marginTop)
            .attr("viewBox", [0, 0, width+ marginLeft + marginRight, height + marginBottom + marginTop]);
            //.style("margin-top","75px")

        svgEl.selectAll('*').remove(); //clear previour rendering
        const svg = svgEl;
            
        //scaling
        const xScale=d3.scaleBand()
            .domain(topic_names)
			.range([0, width - 10])
            .padding(0.2);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);//.tick(1);
        const yAxis = d3.axisLeft(yScale);

        const g = svg
                    .append('g')
                    .attr('transform', `translate(${marginLeft}, ${marginTop})`);

        g.append("g")
            .attr("transform", `translate(0, ${height})`) //move x axis to the bottom
            .call(xAxis)
            .selectAll('text')
            .attr('x', xScale.bandwidth() / 2 - 30)
            .attr('y', 15)
            .attr('dy', '.35em')
            .attr("font-size", 11)
            .attr('transform', 'rotate(30)')
            .attr('text-anchor', 'start');

        g.append("g")
            .call(yAxis)
            .append("text")
                //.attr("transform", "rotate(-90)")
                .attr("text-anchor", "end")
                .attr("x", (width + marginLeft + marginRight)/2) 
                .attr("y", -25) 
                .text("Topic Distribution")
                .style("fill", "black")
                .style("font-size", 14);

        let bar = g
            .selectAll(".bar")
            .data(topic_dist)
            .enter()
            .append("g")
            .attr("class", "bar-group");

        bar.append("rect")
            .attr("class", ".bar")
            .attr('x',(v,i)=>xScale(topic_names[i]))
            .attr("y", (v, i) => yScale(v))
            .attr('width', xScale.bandwidth())
            .attr("height", (v, i) => (height - yScale(v)))
            .attr("fill", (v, i) => colors[year][i]);

        bar
            .append('text')
            .text((d, i) => d.toFixed(2))
            .attr('x', (d, i) => xScale(topic_names[i]) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d) - 5)
            .attr('text-anchor', 'middle')
            .style('font-family', 'sans-serif')
            .style('font-size', 12)
            .style('fill', 'black');
        
        // add icon to each text component
        g.append("svg:image")
            .attr("href", "/assets/speaker.png")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", marginLeft - 60)
            .attr("y", height + 78)
            .style("border", "1px solid black");

        g.append("text")
            .text(`Speaker: ${speaker}`)
            .attr("x", marginLeft - 40)
            .attr("y", height + 90)
            .attr("text-anchor", "start")
            .style("font-size", 14)

        g.append("svg:image")
            .attr("href", "/assets/event.png")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", marginLeft + 160)
            .attr("y", height + 78)
            .style("border", "1px solid black");

        g.append("text")
            .text(`Event: ${event}`)
            .attr("x", marginLeft + 180)
            .attr("y", height + 90)
            .attr("text-anchor", "start")
            .style("font-size", 14)

        g.append("svg:image")
            .attr("href", "/assets/view.png")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", marginLeft - 60)
            .attr("y", height + 108)
            .style("border", "1px solid black");

        g.append("text")
            .text(`Views: ${format(views)}`)
            .attr("x", marginLeft - 40)
            .attr("y", height + 120)
            .attr("text-anchor", "start")
            .style("font-size", 14)

        g.append("svg:image")
            .attr("href", "/assets/like.png")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", marginLeft + 160)
            .attr("y", height + 108)
            .style("border", "1px solid black");

        g.append("text")
            .text(`Positve comment ratio: ${(sentiment*100).toFixed(2)}%`)
            .attr("x", marginLeft + 180)
            .attr("y", height + 120)
            .attr("text-anchor", "start")
            .style("font-size", 14)

        g.append("svg:image")
            .attr("href", "/assets/description.png")
            .attr("width", 15)
            .attr("height", 15)
            .attr("x", marginLeft - 60)
            .attr("y", height + 138)
            .style("border", "1px solid black");

        g.append("text")
            .text("Read the description")
            .attr("x", marginLeft - 40)
            .attr("y", height + 150)
            .attr("text-anchor", "start")
            .style("font-size", 14)
            .style("text-decoration", "underline")
            .on("mouseover", function(event, d) {
                var matrix = this.getScreenCTM()
                .translate(+ this.getAttribute("cx"), + this.getAttribute("cy"));

                tooltip
                    .html(description)
                    .style("left", window.pageXOffset + matrix.e - 40 + "px")
                    .style("top", window.pageYOffset + matrix.f + 120 + "px");

                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 1);
                })
            .on("mouseout", function(d) {
                tooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 0)
                });

        g.append("svg:image")
                .attr("href", "/assets/video.png")
                .attr("width", 15)
                .attr("height", 15)
                .attr("x", marginLeft + 160)
                .attr("y", height + 138)
                .style("border", "1px solid black");

        g.append("a")
            .attr("xlink:href", url)
            .append("text")
            .text("Watch the full talk")
            .attr("x", marginLeft + 180)
            .attr("y", height + 150)
            .attr("text-anchor", "start")
            .style("font-size", 14)
            .style("text-decoration", "underline")
        
    }, [tid, data, year, colors]);


    return (
        <div ref={wrapperRef}>
            <svg ref={svgRef}>
            </svg>
        </div>
        
    )

}

export default BarChart;