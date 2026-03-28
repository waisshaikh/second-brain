import { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

export default function GraphView() {
  const svgRef = useRef();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/memory/graph", { withCredentials: true })
      .then((res) => {
        
        const nodes = res.data.nodes || [];
        const links = res.data.links || [];

        console.log("NODES:", nodes);
        console.log("LINKS:", links);

        if (!nodes.length) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("background", "#020617");

        svg.selectAll("*").remove();

        const simulation = d3
          .forceSimulation(nodes)
          .force(
            "link",
            d3.forceLink(links).id((d) => d.id).distance(120)
          )
          .force("charge", d3.forceManyBody().strength(-250))
          .force("center", d3.forceCenter(width / 2, height / 2));

        // links
        const link = svg
          .append("g")
          .selectAll("line")
          .data(links)
          .enter()
          .append("line")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.6);

        //  NODES
        const node = svg
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 12)
          .attr("fill", "#00E19E")
          .attr("stroke", "#00FFF7")
          .attr("stroke-width", 1.5)
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          );

        //  LABELS
        const label = svg
          .append("g")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .text((d) => d.title?.slice(0, 20))
          .attr("font-size", 10)
          .attr("fill", "#fff");

        simulation.on("tick", () => {
          link
            .attr("x1", (d) => d.source.x)
            .attr("y1", (d) => d.source.y)
            .attr("x2", (d) => d.target.x)
            .attr("y2", (d) => d.target.y);

          node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

          label.attr("x", (d) => d.x + 10).attr("y", (d) => d.y);
        });

        function dragstarted(event, d) {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(event, d) {
          d.fx = event.x;
          d.fy = event.y;
        }

        function dragended(event, d) {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }
      })
      .catch((err) => {
        console.error("GRAPH ERROR:", err);
      });
  }, []);

  return <svg ref={svgRef} />;
}