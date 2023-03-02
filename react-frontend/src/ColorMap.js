import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
//import Color2D from "./color2D.js";

function ColorMap({data, year, colortheme}) {
    
    const svgRef = useRef();
    const width = 380;
    const height = 380;
    const topic_names = ['Music & Creativity', 'Happiness', 'Medicine', 'Development',
                        'Environment', 'Design', 'Tech', 'Story & Women'];

    var Color2D = {};

    /*
    * dimensions of the colormap image
    */
    Color2D.dimensions = {
        width: 380,
        height: 380
    };

    /*
    * data ranges = min and max values of x and y dimensions
    */
    Color2D.ranges = {
        x: [-46, 46],
        y: [-46, 46]
    }

    /*
    * computes the scaled X value
    */
    Color2D.getScaledX = function(x) {
        var val = ((x+1) - (Color2D.ranges.x[0]+1)) / ((Color2D.ranges.x[1]+1) - (Color2D.ranges.x[0]+1));
        return (val * (Color2D.dimensions.width-1));
    };

    /*
    * computes the scaled Y value
    */
    Color2D.getScaledY = function(y) {
        var val = ((y+1) - (Color2D.ranges.y[0]+1)) / ((Color2D.ranges.y[1]+1) - (Color2D.ranges.y[0]+1));
        return (val * (Color2D.dimensions.height-1));
    }; 

    useEffect(() => {
        const yid = parseInt(year) - 2006;
        const points = data["topic_embeddings"][yid]["embedding"];

        const svgEl = d3.select(svgRef.current)
                        .attr("width", width + 60)
                        .attr("height", height + 10)
                        .attr("viewBox", [0, 0, width, height]);
        
        svgEl.selectAll('*').remove(); //clear previour rendering
        const svg = svgEl;

        svg.append("svg:image")
            .attr("href", "/assets/" + colortheme + ".png")
            .attr("width", Color2D.dimensions.width)
            .attr("height", Color2D.dimensions.height)
            //.attr("x", "30px")
            .style("border", "1px solid black");  
        
        svg.selectAll("text")
            .data(points)
            .enter()
            .append("text")
            .attr("x", d => Color2D.getScaledX(d[0]) > Color2D.dimensions.width - 80 ? Color2D.getScaledX(d[0]) - 80 : Color2D.getScaledX(d[0]))
            .attr("y", d => Color2D.getScaledY(d[1]) < 15 ? 15 : Color2D.getScaledY(d[1]))
            .attr("font-size", 13)
            .attr("font-family", "Georgia", "serif")
            .attr("fill", "#fff")
            .text((d, i )=> topic_names[i]);         

    }, [colortheme, data, year]);
 

    return (
        <div id = "colormap">
            <svg ref = {svgRef}></svg>
        </div>
    );
}

export default ColorMap;