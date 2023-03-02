import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

//import useResizeObserver from "./useResizeObserver";



function StreamGraph({ data, property, topic_colors, getStreamData}) 
{
    
    const svgRef = useRef();
    const marginTop = 30; // top margin, in pixels
    const marginRight = 30; // right margin, in pixels
    const marginBottom = 30; // bottom margin, in pixels
    const marginLeft = 20; // left margin, in pixels
    const width = 1000;
    const height = 390;

  
    useEffect(() => { 
        
        let dateStamp;

        const svg = d3.select(svgRef.current)

        svg.selectAll('*').remove();

        svg.attr("width", width)
                      .attr("height", height)
                      .attr("viewBox", [0, 0, width, height])
                      .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
                      .on("mouseover", function(){ // mouse outside of the stream, then initialization
                        line
                          .attr("x1", 0)
                          .attr("x2", 0)
                          .attr("y1", 0)
                          .attr("y2", 0);
                        bigLine
                          .attr("x1", 0)
                          .attr("x2", 0)
                          .attr("y1", 0)
                          .attr("y2", 0);
                        stateLabel
                          .text("")
                          .attr("fill", "none");
                        keywordLabel.text("");
                      });
        
        const parseDate = d3.timeParse("%Y");

        const X = d3.map(data.topic_evolution, d => parseDate(d.date)); // all date
        const Y = d3.map(data.topic_evolution, d => d[property]);  // all topic metrics
        const Z = d3.map(data.topic_evolution, d => d.topic_id);  // all topic id
        const keywords = d3.map(data.topic_evolution, d => d.keywords) // all keywords
        const topic_names = d3.map(data.topic_evolution, d => d.topic_name)  // all topic names
 
        const xType = d3.scaleTime; // type of x-scale
        
        const xRange = [marginLeft, width - marginRight]; // [left, right]

        const yType = d3.scaleLinear; // type of y-scale
        const yRange = [height - marginBottom, marginTop]; // [bottom, top]

        const offset = d3.stackOffsetWiggle; // stack offset method
        const order = d3.stackOrderNone; // stack order method --> stackOrderInsideOut

        //const colors = d3.schemeCategory10;

        const xDomain = d3.extent(X);
        const zDomain = new d3.InternSet(Z);


        // Omit any data not present in the z-domain.
        const I = d3.range(X.length).filter(i => zDomain.has(Z[i]));

        const series = d3.stack()
            .keys(zDomain) // topics
            .value(([x, I], z) => Y[I.get(z)])
            .order(order)
            .offset(offset)
            (d3.rollup(I, ([i]) => i, i => X[i], i => Z[i]))
            .map(s => s.map(d => Object.assign(d, {i: d.data[1].get(s.key)})));
        
        const yDomain = d3.extent(series.flat(2));


        // Construct scales and axes.
        const xScale = xType(xDomain, xRange);
        const yScale = yType(yDomain, yRange);
        //const color = d3.scaleOrdinal(zDomain, colors);
        const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
        
        const area = d3.area()
            .x(({i}) => xScale(X[i]))
            .y0(([y1]) => yScale(y1))
            .y1(([, y2]) => yScale(y2));       
      
        svg.append("g")
          .selectAll("path")
          .data(series)
          .join("path")
          .on("mouseover", over)
          .on("mouseout", out)
          .on("mousemove", move)
          .on("click", onclick)
          //.attr("fill", ([{i}]) => color(Z[i]))
          //.attr("fill", ([{i}]) => topic_colors["topic_colors"][i])
          .attr("fill", ([{i}]) => gradientfill(i))
          .attr("d", area)
        
        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .attr("font-weight", "bold")
            .call(xAxis)
            .call(g => g.select(".domain").remove())

        
        const textArea = svg.append("g")
                            .attr("pointer-events", "none")
                            .attr("fill", "black");
                            //.attr("stroke", "black");

        
        const stateLabel = textArea
                  .append("text")
                  .attr("font-size", 18)
                  .attr("font-family", "Georgia", "serif")
                  .attr("text-anchor", "end");
        const keywordLabel = textArea
                  .append("text")
                  .attr("font-size", 18)
                  .attr("font-family", "Georgia", "serif")
                  .attr("text-anchor", "middle");
            
        const bigLine = svg
                .append("line")
                .attr("stroke", "black")
                .attr("opacity", .8)
                .attr("stroke-dasharray", 3, 4)
                .attr("pointer-events", "none");
            
        const line = svg
                .append("line")
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("pointer-events", "none");

        //fill the stream path with gradient
        function gradientfill(i){
          
          //get the gradient color for stream path TODO
          var defs = svg.append("defs");
          const id = "svgGradient" + i.toString()
          var gradient = defs.append("linearGradient")
                              .attr("id", id);
                              //.attr("x1", "0%")
                              //.attr("x2", "100%")
                              //.attr("y1", "0%")
                              //.attr("y2", "100%");

          const interval = 100 / 6;

          var offsets = {};

          for (var j = 0; j < 6; j++) {
            offsets[j] = (0 + interval * j).toString() + "%";
          }
          offsets[6] = "100%"
          console.log(offsets)
          for (var k = 0; k < 7; k++){//iter over all timestep
            gradient.append("stop")
                    .attr("offset", offsets[k])
                    .attr("stop-color", topic_colors[i.toString()][k])
                    .attr("stop-opacity", 1);
          }

          console.log(id);

          return "url(#" + id + ")";
        }

        // mouse over handler
        function over(e, d) {

            // Fade out other rivers            
            svg.selectAll("path").attr("opacity", .5);
            d3.select(this).attr("opacity", 1);  
            //e.stopPropagation();

        }
         
        // mouse out handler
        function out() {
          svg.selectAll("path").attr("opacity", 1);
          //e.stopPropagation();
        }
        
        //mouse move handler
        function move(e, d) {
            const mouse_x = e.offsetX
            const thres = xScale.invert(mouse_x).getFullYear() > 2010? 0 : 6
            dateStamp = xScale.invert(mouse_x).getMonth() > thres
                ? xScale.invert(mouse_x).getFullYear() + 1
                : xScale.invert(mouse_x).getFullYear();
            const index = d.findIndex(t => t.data[0].getFullYear() === dateStamp); // year index where the mouse is over
            const selectedData = d[index];
            const min = d3.min(series, d => d[index][0]);
            const max = d3.max(series, d => d[index][1]);
            const stateMetric = Y[selectedData.i];
            const topwords = keywords[selectedData.i]
            const curr_topic_name = topic_names[selectedData.i]

            line
              .attr("x1", xScale(parseDate(dateStamp)))
              .attr("x2", xScale(parseDate(dateStamp)))
              .attr("y1", yScale(selectedData[0]))
              .attr("y2", yScale(selectedData[1]));

            bigLine
              .attr("x1", xScale(parseDate(dateStamp)))
              .attr("x2", xScale(parseDate(dateStamp)))
              .attr("y1", yScale(min))
              .attr("y2", yScale(max));

            stateLabel
              .attr("x", d3.max([d3.min([xScale(parseDate(dateStamp)), width - 400]), 400]))
              .attr("y", d3.max([yScale(max) - 40, 20]))
              .attr("fill", "#0d4091")
              .text(curr_topic_name + ": " + stateMetric)
            
            keywordLabel
              .attr("x", d3.max([d3.min([xScale(parseDate(dateStamp)), width - 400]), 400]))
              .attr("y", d3.max([yScale(max) - 20, 40]))
              .text('Top keywords: ' + topwords)
          }

        function onclick(e, d){
          const mouse_x = e.offsetX
          const thres = xScale.invert(mouse_x).getFullYear() > 2010? 0 : 6
          const curyear = xScale.invert(mouse_x).getMonth() > thres
                ? xScale.invert(mouse_x).getFullYear() + 1
                : xScale.invert(mouse_x).getFullYear();
          const index = d.findIndex(t => t.data[0].getFullYear() === curyear); // year index where the mouse is over
          const selectedData = d[index];
          const curr_topic_name = topic_names[selectedData.i]
          getStreamData(curyear.toString(), curr_topic_name);
        }
        
    },[data, property, topic_colors]); //function passed to useEffect will run if one of these changes
    
    return(
        <div>
            <svg ref={svgRef}></svg>
        </div>
    );
  }

export default StreamGraph;