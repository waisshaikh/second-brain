import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import BrainCore from "../components/BrainCore";
import AppLayout from "../layouts/AppLayout";

export default function GraphView() {
  const svgRef = useRef();
  const [hasData, setHasData] = useState(false);
  const [activeNode, setActiveNode] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("⛔ Token missing");
      return;
    }

    axios
      .get("https://second-brain-huvx.onrender.com/api/memory/graph", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("🔥 GRAPH RESPONSE:", res.data);

        const nodes =
          res.data?.nodes ||
          res.data?.data?.nodes ||
          [];

        if (!nodes.length) {
          setHasData(false);
          return;
        }

        setHasData(true);

        if (!svgRef.current) return;

        const parent = svgRef.current.parentElement;
        if (!parent) return;

        const width = parent.clientWidth;
        const height = parent.clientHeight;

        if (width === 0 || height === 0) {
          console.log("⛔ Container size not ready");
          return;
        }

        const centerX = width / 2;
        const centerY = height / 2;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("background", "#020617");

        svg.selectAll("*").remove();

        // ✅ GROUP (IMPORTANT FIX)
        const graphGroup = svg.append("g");

        // GLOW
        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");

        filter
          .append("feGaussianBlur")
          .attr("stdDeviation", "3")
          .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        // STARS
        const stars = d3.range(120);

        graphGroup
          .selectAll("circle.star")
          .data(stars)
          .enter()
          .append("circle")
          .attr("class", "star")
          .attr("cx", () => Math.random() * width)
          .attr("cy", () => Math.random() * height)
          .attr("r", () => Math.random() * 1.5)
          .attr("fill", "#ffffff")
          .attr("opacity", () => Math.random())
          .each(function () {
            function twinkle() {
              d3.select(this)
                .transition()
                .duration(2000 + Math.random() * 3000)
                .attr("opacity", Math.random())
                .on("end", twinkle);
            }
            twinkle.call(this);
          });

        // ORBIT SYSTEM
        const radiusStep = 140;
        const nodesPerRing = 6;

        nodes.forEach((node, i) => {
          const ring = Math.floor(i / nodesPerRing);
          const positionInRing = i % nodesPerRing;

          const angle = (positionInRing / nodesPerRing) * Math.PI * 2;

          node.radius = radiusStep * (ring + 1);
          node.angle = angle;
          node.speed = 0.00005 + ring * 0.000015;
        });

        // ORBITS
        const uniqueRadii = [...new Set(nodes.map((n) => n.radius))];

        graphGroup
          .selectAll("circle.orbit")
          .data(uniqueRadii)
          .enter()
          .append("circle")
          .attr("class", "orbit")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", (d) => d)
          .attr("fill", "none")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.08)
          .attr("stroke-dasharray", "3,6");

        // LINKS
        const link = graphGroup
          .selectAll("line")
          .data(nodes)
          .enter()
          .append("line")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.25)
          .attr("filter", "url(#glow)");

        // NODES
        const node = graphGroup
          .selectAll("circle.node")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("class", "node")
          .attr("r", 7)
          .attr("fill", "#00E19E")
          .attr("stroke", "#00FFF7")
          .attr("stroke-width", 1.5)
          .attr("filter", "url(#glow)")
          .style("cursor", "pointer");

        // LABELS
        const label = graphGroup
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .text((d) => d.title?.slice(0, 18))
          .attr("font-size", 10)
          .attr("fill", "#ffffff");

        // ZOOM
        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 3])
          .on("zoom", (event) => {
            graphGroup.attr("transform", event.transform);
          });

        svg.call(zoom);

        // CLICK FIX
        node.on("click", function (event, d) {
          if (!event) return;

          event.stopPropagation();

          setActiveNode(d);

          node.transition().duration(300).attr("opacity", 0.2);
          link.transition().duration(300).attr("opacity", 0.05);

          d3.select(this)
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("r", 22)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 3);
        });

        svg.on("click", function () {
          setActiveNode(null);

          node
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("r", 7)
            .attr("stroke", "#00FFF7");

          link.transition().duration(300).attr("opacity", 0.25);
        });

        // ANIMATION
        function animate() {
          nodes.forEach((d) => {
            d.angle += d.speed;
            d.x = centerX + Math.cos(d.angle) * d.radius;
            d.y = centerY + Math.sin(d.angle) * d.radius;
          });

          node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

          label
            .attr("x", (d) => d.x + 10)
            .attr("y", (d) => d.y);

          link
            .attr("x1", centerX)
            .attr("y1", centerY)
            .attr("x2", (d) => d.x)
            .attr("y2", (d) => d.y);

          requestAnimationFrame(animate);
        }

        animate();
      })
      .catch((err) => {
        console.error("❌ GRAPH ERROR:", err);
      });
  }, []);

  return (
    <AppLayout>
      <div className="relative w-full h-full bg-[#020617] overflow-hidden">

        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center z-20 text-white">
            No Data Found
          </div>
        )}

        {hasData && (
          <>
            <svg ref={svgRef} className="absolute inset-0 z-0" />

            <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
              <BrainCore />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
