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
   api.get("/memory/graph")
      .then((res) => {
        const nodes = res.data.nodes || [];

        if (!nodes.length) {
          setHasData(false);
          return;
        }

        setHasData(true);

        const parent = svgRef.current.parentElement;
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

        //  DEFINITIONS (GLOW + IMAGE PATTERNS)
        const defs = svg.append("defs");

        const filter = defs.append("filter").attr("id", "glow");
        filter.append("feGaussianBlur").attr("stdDeviation", "3");
        const feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        //  IMAGE PATTERNS (THUMBNAILS)
        nodes.forEach((d) => {
          if (d.thumbnail) {
            const pattern = defs.append("pattern")
              .attr("id", `img-${d._id}`)
              .attr("patternUnits", "objectBoundingBox")
              .attr("width", 1)
              .attr("height", 1);

            pattern.append("image")
              .attr("href", d.thumbnail)
              .attr("width", 80)
              .attr("height", 80)
              .attr("preserveAspectRatio", "xMidYMid slice");
          }
        });

        //  STARS
        svg
          .append("g")
          .selectAll("circle")
          .data(d3.range(120))
          .enter()
          .append("circle")
          .attr("cx", () => Math.random() * width)
          .attr("cy", () => Math.random() * height)
          .attr("r", () => Math.random() * 1.5)
          .attr("fill", "#fff")
          .attr("opacity", () => Math.random());

        //  ORBIT SYSTEM
        const radiusStep = 140;
        const nodesPerRing = 6;

        nodes.forEach((node, i) => {
          const ring = Math.floor(i / nodesPerRing);
          const pos = i % nodesPerRing;

          node.radius = radiusStep * (ring + 1);
          node.angle = (pos / nodesPerRing) * Math.PI * 2;

          node.speed = 0.0001 + ring * 0.00003; // 🐢 slow
        });

        // ORBIT RINGS
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

        // LINKS
        const link = svg
          .append("g")
          .selectAll("line")
          .data(nodes)
          .enter()
          .append("line")
          .attr("stroke", "#00FFF7")
          .attr("stroke-opacity", 0.25)
          .attr("filter", "url(#glow)");

        //  NODES (PROFILE STYLE)
        const node = svg.append("g")
          .selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 12)
          .attr("fill", (d) =>
            d.thumbnail ? `url(#img-${d._id})` : "#00E19E"
          )
          .attr("stroke", "#00FFF7")
          .attr("stroke-width", 2)
          .style("cursor", "pointer");

        //  LABELS
        const label = svg
          .append("g")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .text((d) => d.title?.slice(0, 18))
          .attr("font-size", 10)
          .attr("fill", "#ffffff");

        //  HOVER
        node
          .on("mouseover", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 18)
              .attr("stroke", "#ffffff")
              .attr("stroke-width", 3);
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 12)
              .attr("stroke", "#00FFF7")
              .attr("stroke-width", 2);
          });

        //  CLICK
        node.on("click", (event, d) => {
          event.stopPropagation();

          setActiveNode(d);

          node.attr("opacity", 0.3);
          link.attr("opacity", 0.1);

          d3.select(event.currentTarget)
            .attr("opacity", 1)
            .attr("r", 20)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 3);
        });

        //  ANIMATION
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
      });
  }, []);

  return (
    <AppLayout>
      <div className="relative w-full h-full bg-[#020617] overflow-hidden">

        {/* GRAPH */}
        {hasData && (
          <>
            <svg ref={svgRef} className="absolute inset-0 z-0" />

            {/* CENTER */}
            <div className="absolute inset-0 flex justify-center items-center z-10 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-cyan-400/20 animate-pulse rounded-full" />
                <BrainCore />
              </div>
            </div>
          </>
        )}

        {/*  SIDEBAR */}
        <div
          className={`absolute right-0 top-0 h-full w-[360px] 
  bg-black/90 backdrop-blur-2xl border-l border-white/10 p-6 z-[999]
  transition-transform duration-500
  ${activeNode ? "translate-x-0" : "translate-x-full"}`}
        >
          {activeNode && (
            <>
              {/* HEADER */}
              <div className="flex justify-between items-start gap-4">

                <h2 className="text-lg text-cyan-400 font-semibold leading-snug pr-6">
                  {activeNode.title}
                </h2>

                {/* PROPER CLOSE BUTTON */}
                <button
                  onClick={() => setActiveNode(null)}
                  className="flex-shrink-0 w-9 h-9 rounded-full 
          bg-white/10 hover:bg-white/20 
          flex items-center justify-center text-white"
                >
                  ✕
                </button>

              </div>

              {/* THUMBNAIL */}
              {activeNode.thumbnail && (
                <img
                  src={activeNode.thumbnail}
                  className="w-full h-44 object-cover rounded-xl mt-5"
                />
              )}

              {/* DESC */}
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                {activeNode.description}
              </p>

              {/* LINK */}
              <a
                href={activeNode.url}
                target="_blank"
                className="inline-block mt-6 text-cyan-300 hover:text-cyan-200"
              >
                Open →
              </a>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}