import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import uid from './uid';

function MapTreeComponent({ alldata, year, setTid, colors }) {

    const svgRef = useRef();
    // const wrapperRef = useRef();

    useEffect(() => {

        const topic_names = ['Music & Creativity', 'Happiness', 'Medicine', 'Development',
                            'Environment', 'Design', 'Tech', 'Story & Women'];
        var colorDict = {};

        for (var i = 0; i < topic_names.length; i++) {
            colorDict[topic_names[i]] = i
        }

        const height = 1200; // 924
        const width = 1200; //954
        const format = d3.format(",d");
        // fuction name will return the name of the path
        const name = d => d.ancestors().reverse().map(d => d.data.name).join("/");
        // function color will return the color of the current block
        const colorYear = d => d.ancestors().reverse().map(d => d.data.name)[0];
        const colorTopic = d => colorDict[d.ancestors().reverse().map(d => d.data.name)[1]];
        const color = d => colors[colorYear(d)][colorTopic(d)];
    
        const tile = (node, x0, y0, x1, y1) => {
            d3.treemapBinary(node, 0, 0, width, height);
            for (const child of node.children) {
              child.x0 = x0 + child.x0 / width * (x1 - x0);
              child.x1 = x0 + child.x1 / width * (x1 - x0);
              child.y0 = y0 + child.y0 / height * (y1 - y0);
              child.y1 = y0 + child.y1 / height * (y1 - y0);
            }
        }

        // 联动 year with stream graph
        const year_index = parseInt(year) - 2006
        // make sure it's connected
        console.log(year_index)

        const data = alldata.tree_hyerarchy[year_index]
        console.log(data)
        const treemap = (data) => d3.treemap()
                                    .tile(tile)
                                (d3.hierarchy(data)
                                    .sum(d => d.value)
                                    .sort((a, b) => b.value - a.value))
    
        const x = d3.scaleLinear().rangeRound([0, width]);
        const y = d3.scaleLinear().rangeRound([0, height]);
    
        // viewBox(x, y, width, height)
        // whole treemap svg
        const svg = d3.select(svgRef.current)
                    .attr("viewBox", [0.5, -30.5, width, height + 30])
                    .style("font", "10px sans-serif")
    
        let group = svg.append("g")
                    .call(render, treemap(data));
    
        function render(group, root) {
            // associate each children with a g
            const node = group
                .selectAll("g")
                .data(root.children.concat(root))
                .join("g");
        
            // change cursor format to pointer, no idea what the filter does
            // click to zoom in or zoom out depending on what you click
            node.filter(d => d === root ? d.parent : d.children)
                .attr("cursor", "pointer")
                .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));
        
            node.append("title")
                .text(d => `${name(d)}\n${format(d.value)}`);
            
            // white, dark gray, light gray, white stroke
            node.append("rect")
                .attr("id", d => (d.leafUid = uid("leaf")).id)
                .attr("fill", d => d === root ? "#fff" : color(d))
                .attr("stroke", "#fff")
                .on("click", (e, d) => d.children ? function () {} : setTid(d.data.name));
        
            // what is clipUid? 
            node.append("clipPath")
                .attr("id", d => (d.clipUid = uid("clip")).id)
                .append("use")
                .attr("xlink:href", d => d.leafUid.href);
        
            // text in rect
            node.append("text")
                .attr("clip-path", d => d.clipUid)
                .attr("font-weight", d => d === root ? "bold" : null)
                .attr("font-size", d => d === root ? 40 : 40)
                .selectAll("tspan")
                // originally split in every capitalized char
                // .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
                .data(d => (d === root ? getPhrases(name(d), 5) : getPhrases(d.data.name, 2).concat(format(d.value))))
                .join("tspan")
                // margin weights inside rect
                .attr("x", 3)
                .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
                // change opacity and weight of value
                .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
                .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "bold" : null)
                // change font size of the text
                // TODO: 重叠
                // .attr("font-size", 30)
                // .attr("font-size", 30)
                .text(d => d);
        
            group.call(position, root);
        }

        /* useful functions */
        function getPhrases(text, wordsPerPhrase) {
            var words = text.split(/\s+/g)
            var result = []
            for (var i = 0; i < words.length; i += wordsPerPhrase) {
              result.push(words.slice(i, i + wordsPerPhrase).join(" "))
            }
            console.log(result)
            return result
        }

    
        function position(group, root) {
            group.selectAll("g")
                // translate the location of root
                .attr("transform", d => d === root ? `translate(0,-50)` : `translate(${x(d.x0)},${y(d.y0)})`)
              .select("rect")
                .attr("width", d => d === root ? width : x(d.x1) - x(d.x0))
                // set the height of rectangle of root vs rectangles
                .attr("height", d => d === root ? 60 : y(d.y1) - y(d.y0));
        }
    
        // When zooming in, draw the new nodes on top, and fade them in.
        function zoomin(d) {
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.append("g").call(render, d);
    
            x.domain([d.x0, d.x1]);
            y.domain([d.y0, d.y1]);
    
            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                .call(position, d.parent))
                .call(t => group1.transition(t)
                .attrTween("opacity", () => d3.interpolate(0, 1))
                .call(position, d));
        }
    
        // When zooming out, draw the old nodes on top, and fade them out.
        function zoomout(d) {
            const group0 = group.attr("pointer-events", "none");
            const group1 = group = svg.insert("g", "*").call(render, d.parent);
    
            x.domain([d.parent.x0, d.parent.x1]);
            y.domain([d.parent.y0, d.parent.y1]);
    
            svg.transition()
                .duration(750)
                .call(t => group0.transition(t).remove()
                .attrTween("opacity", () => d3.interpolate(1, 0))
                .call(position, d))
                .call(t => group1.transition(t)
                .call(position, d.parent));
        }
    }, [alldata, year, setTid, colors]);
    
    return (<svg ref={svgRef}></svg>);

}

export default MapTreeComponent;