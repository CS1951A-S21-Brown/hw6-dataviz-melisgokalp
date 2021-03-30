
// Most Popular Genres per Region
let svg1 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width+margin.left)
    .attr("height", graph_2_height+ margin.top*2)
    .append("g")
    .attr("transform", `translate(${(margin.left/2) + margin.left/2 + 20},${margin.top+10})`);

let title_2 = svg1.append("text")
    .attr("transform", `translate(${(graph_2_width/2- margin.left)}, ${-20})`)  
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("font-family", "Helvetica")  
    .text("Most Popular Video Game Genres per Region");

d3.csv(filename).then(function(data) {
    regions = ["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"];
    regions_name = ["N. America", "Europe", "Japan", "Other"];
    //sum global sales for each region in each genre
    newdata = []
    for (i = 0; i < regions.length; i++) {
        regional_genres = d3.nest()
            .key(function(d) { return d.Genre + i})
            .rollup(function(d) {return d3.sum(d, function(g) {return g[regions[i]]; });
            })
            .entries(data);
        regional_genres.forEach(function (d) {
            d.region = regions_name[i];
        })
        newdata = newdata.concat(regional_genres);
    }
    data = newdata;

    var color = d3.scaleOrdinal()
        .domain(regions_name)
        .range(d3.schemePastel2);
 
    var Tooltip = d3.select("#graph2")
        .append("div")
        .attr("class", "tooltip")
        .style("background-color", "#D1F0E9")
        .style("padding", "5px")
        .style("opacity", 0);

    // Functions to decide mouse hover behavior: change opacity 0-1
    var mouseover = function(d) {
        Tooltip
        .style("opacity", 0.9)
    }
    var mousemove = function(d) {
        Tooltip
        .html('<u>' + d.key.slice(0, -1) + ' Game Sales '+ '</u>' + '<br> ' + d.region +': '  + d.value.toFixed(1) + 'm')
        .style("left", `${(d3.event.pageX) - size(Math.round(d.value))}px`)
        .style("top", `${(d3.event.pageY) - 130}px`)
    }
    var mouseleave = function(d) {
        Tooltip
        .style("opacity", 0)
    } 

    var size = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){return parseFloat(d.value);})])
        .range([7,50])

    var node = svg1.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d){ return size(Math.round(d.value))})
        .style("fill", function(d){ return color(d.region)})
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .call(d3.drag() 
            .on("start", dragstart)
            .on("drag", drag)
            .on("end", dragend));

    // Labels for region on each node
    var label = svg1.append("g")
        .selectAll(".mytext")
        .data(data)
        .enter()
        .append("text")
        .text(function (d) { return d.key.slice(0,-1);})
        .style("text-anchor", "middle")
        .style("font-family", "Helvetica")
        .style("font-size", function(d){ return size(d.value)*3.8/d.key.length});
    let k = graph_2_width/2-(margin.left*2);
    var x = d3.scaleOrdinal()
    .domain(function (d) { return d.region; })
    .range([0, k*0.25, k*0.5,k]);
    svg1.append("text")
        .attr("transform", `translate(${(graph_2_width - margin.left *2 ) / 2}, ${(graph_2_height) + margin.bottom/2 })`)    
        .style("text-anchor", "middle")
        .text("Sales (in millions)");
    var y = d3.scaleOrdinal()
    .domain(function (d) { return d.value; })
    .range([ graph_2_height/2-margin.top, graph_2_height/2-margin.top/2 ]);
 
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.4).x( function(d){ return x(d.region) } ))
        .force("y", d3.forceY().strength(0.8).y( function(d){ return y(d.region)+60 } ))
        .force("center", d3.forceCenter().x(graph_2_width/2-margin.left-10).y(graph_2_height/2-margin.top/2))
        .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return (size(d.value)+3) }).iterations(1));
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; });
            label
                .attr("x", function(d){ return d.x; })
                .attr("y", function (d) {return d.y +3; });

        });
    

    
    //  Add legend for each region
    for (i = 0; i < regions.length; i++) {
        svg1.append("circle").attr("cx",graph_2_width/2 + 50).attr("cy",130 + i*30).attr("r", 6).style("fill", color(regions_name[i]));
        svg1.append("text").attr("x", graph_2_width/2 + 60  ).attr("y", 130 + i*30).text(regions_name[i]).style("font-size", "15px").attr("alignment-baseline","middle");
    }
    function dragstart(d) {
        if (!d3.event.active) simulation.alphaTarget(.04).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function drag(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }
    function dragend(d) {
        if (!d3.event.active) simulation.alphaTarget(.04);
        d.fx = null;
        d.fy = null;
    }
});

