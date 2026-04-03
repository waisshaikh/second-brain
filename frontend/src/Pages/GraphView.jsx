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
    axios.get("https://second-brain-huvx.onrender.com/api/memory/graph", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        console.log(" GRAPH RESPONSE:", res.data);

        const nodes = res.data.nodes || [];

        if (nodes.length === 0) {
          setHasData(false);
          return;
        }

        setHasData(true);
        if (!nodes.length) return;

        if (!svgRef.current) return;

        const parent = svgRef.current.parentElement;
        if (!parent) return;

        const width = parent.clientWidth;
        const height = parent.clientHeight;

        const centerX = width / 2;
        const centerY = height / 2;

        const svg = d3
          .select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .style("background", "#020617");

        svg.selectAll("*").remove();

        //  GLOW EFFECT
        const defs = svg.append("defs");
        const filter = defs.append("filter").attr("id", "glow");

        filter
          .append("feGaussianBlur")
          .attr("stdDeviation", "3")
          .attr("result", "coloredBlur");

        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        //STAR BACKGROUND
        const stars = d3.range(120);

        const starGroup = svg.append("g");

        starGroup
          .selectAll("circle")
          .data(stars)
          .enter()
          .append("circle")
          .attr("cx", () => Math.random() * width)
          .attr("cy", () => Math.random() * height)
          .attr("r", () => Math.random() * 1.5)
          .attr("fill", "#ffffff")
          .attr("opacity", () => Math.random())
          .each(function repeat() {
            function twinkle() {
              d3.select(this)
                .transition()
                .duration(2000 + Math.random() * 3000)
                .attr("opacity", Math.random())
                .on("end", twinkle);
            }
            twinkle.call(this);
          });

        //  ORBIT SYSTEM
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

        //  ORBIT RINGS
        const uniqueRadii = [...new Set(nodes.map((n) => n.radius))];

        svg
          .append("g")
          .selectAll("circle")
          .data(uniqueRadii)
          .enter()
          .append("circle")
          .attr("cx", centerX)
          .attr("cy", centerY)
          .attr("r", (d) => d)
          .attr("fill", "none")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.08)
          .attr("stroke-dasharray", "3,6");

        //  LINKS
        const link =  graphGroup
          .append("g")
          .selectAll("line")
          .data(nodes)
          .enter()
          .append("line")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.25)
          .attr("filter", "url(#glow)");

        //  NODES

        const node = svg
          .append("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 7)
          .attr("fill", "#00E19E")
          .attr("stroke", "#00FFF7")
          .attr("stroke-width", 1.5)
          .attr("filter", "url(#glow)")
          .style("cursor", "pointer");

        //  LABELS
        const label = graphGroup
          .append("g")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .text((d) => d.title?.slice(0, 18))
          .attr("font-size", 10)
          .attr("fill", "#ffffff");

        // ZOOM
        const graphGroup = svg.append("g");

        const zoom = d3
          .zoom()
          .scaleExtent([0.5, 3])
          .on("zoom", (event) => {
            graphGroup.attr("transform", event.transform);
          });

        svg.call(zoom);


        // NODE CLICK → ZOOM
        node.on("click", (event, d) => {
          event.stopPropagation();

          setActiveNode(d);

          // fade others
          node.transition().duration(300).attr("opacity", 0.2);
          link.transition().duration(300).attr("opacity", 0.05);

          // highlight selected
          d3.select(event.currentTarget)
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("r", 22)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 3);
        });

        svg.on("click", () => {
          setActiveNode(null);

          node.transition().duration(300)
            .attr("opacity", 1)
            .attr("r", 7)
            .attr("stroke", "#00FFF7")
            .attr("stroke-width", 2);

          link.transition().duration(300).attr("opacity", 0.25);
        });

        //ANIMATION LOOP

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
        console.error(err);
      });
  }, []);

  return (
    <AppLayout>
      <div className="relative w-full h-full bg-[#020617] overflow-hidden">

        {/* NO DATA UI */}
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center z-20">

            <div className="text-center max-w-md px-6">

              {/* ICON / VISUAL */}
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 rounded-full 
        bg-gradient-to-r from-cyan-500/20 to-purple-500/20 
        flex items-center justify-center
        shadow-[0_0_60px_#00FFF7]">

                  <span className="text-4xl">🧠</span>
                </div>
              </div>

              {/* TITLE */}
              <h2 className="text-2xl font-semibold text-cyan-400">
                Your brain is empty
              </h2>

              {/* SUBTEXT */}
              <p className="text-gray-400 mt-3 leading-relaxed">
                Start building your second brain by saving links, ideas, and content.
                We’ll automatically organize everything for you.
              </p>

              {/* CTA BUTTON */}
              <button
                onClick={() => window.location.href = "/"}
                className="mt-6 px-6 py-3 rounded-xl 
        bg-gradient-to-r from-cyan-400 to-purple-500 
        hover:scale-105 active:scale-95 transition
        shadow-lg shadow-cyan-500/30"
              >
                ➕ Add your first memory
              </button>

              {/* OPTIONAL SECOND ACTION */}
              <p className="text-gray-500 text-sm mt-4">
                or paste a link in dashboard
              </p>

            </div>
          </div>
        )}

        {/*  ONLY SHOW GRAPH IF DATA EXISTS */}
        {hasData && (
          <>
            <svg ref={svgRef} className="absolute inset-0 z-0" />

            <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
              <div className="brain-center">
                <BrainCore />
              </div>
            </div>
          </>
        )}

        {/* PANEL */}
        {activeNode && hasData && (
          <div
            className={`absolute right-0 top-0 h-full w-[380px] 
    bg-gradient-to-b from-black/80 to-black/60 
    backdrop-blur-3xl border-l border-white/10 
    p-6 z-[999]
    shadow-2xl shadow-cyan-500/10
    transition-all duration-500 ease-out
    ${activeNode ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
          >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-cyan-400">
                {activeNode.title}
              </h2>

              <button
                onClick={() => setActiveNode(null)}
                className="w-10 h-10 rounded-full 
        bg-gradient-to-r from-cyan-500/20 to-purple-500/20
        hover:scale-110 active:scale-95 transition
        flex items-center justify-center text-white"
              >
                ✕
              </button>
            </div>

            {/* CONTENT */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {activeNode.description || "No description available"}
            </p>

            {/* OPEN LINK BUTTON */}
            {activeNode.url && (
              <a
                href={activeNode.url}
                target="_blank"
                className="mt-6 inline-flex items-center gap-2 
        px-4 py-2 rounded-lg 
        bg-gradient-to-r from-cyan-400 to-purple-500 
        text-black font-medium 
        hover:scale-105 active:scale-95 transition"
              >
                🔗 Open Link
              </a>
            )}

          </div>
        )}

      </div>
    </AppLayout>
  );

}
