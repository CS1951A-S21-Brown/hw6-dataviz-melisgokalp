
// The Most Popular Genres per Region
let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width+margin.left*2 )
    .attr("height",graph_3_height+ margin.top*2)
    .append("g")
    .attr("transform", `translate(${(margin.left/2+5) },${margin.top+10})`);

let title_3 = svg3.append("text")
    .attr("transform", `translate(${(graph_3_width/2 -margin.left/2)}, ${-20})`)  
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("font-family", "Helvetica")  
    .text("Top Publisher per Video Game Genre");


d3.csv(filename).then(function(data) {
    var genres = [...new Set(data.map(d => d.Genre))];
    var top_publishers = [];
    for (i = 0; i < genres.length; i++) { 
        top_publisher = d3.nest()
            .key(function(d) { return d.Publisher})
            .rollup(function(d) {return d3.sum(d, function(g) {return g.Global_Sales; });
            })
            .entries(data.filter(a => a.Genre === genres[i]));
        top_publisher= top_publisher.sort(function(a,b){return parseFloat(b.value) - parseFloat(a.value)}).slice(0, 1);
        top_publisher.forEach(function (d) {
            d.genre = genres[i];
        })
        top_publishers = top_publishers.concat(top_publisher);
    }
    data = top_publishers.sort(function(a,b){return parseFloat(b.value) - parseFloat(a.value)});
    var color3 = d3.scaleOrdinal()
        .domain(function (d) { return d.key; })
        .range(d3.schemePastel2);
////////////////////////////////////////////////

    var x = d3.scaleLinear()
        .domain([0,d3.max(data,function(d){return parseFloat(d.value);})])
        .range([ 0,  graph_3_width-margin.left]);
    svg3.append("g")
        .attr("transform", "translate(0," + graph_3_height + ")")
        .call(d3.axisBottom(x));
    let y = d3.scaleBand()
        .domain(data.map(function(a){return a.genre;}))
        .range([ 0,  graph_3_height])
        .padding(0.1);
    svg3.append("g")
        .call(d3.axisLeft(y));


    let bars = svg3.selectAll("rect").data(data);    


    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .attr("x", x(0)+1)
        .attr("width",function(a){return x(a.value);})
        .attr("y", function(a){return y(a.genre);})  
        .attr("height",  y.bandwidth())
        .attr("fill", function(d) { return color3(d.key) });

    let counts = svg3.append("g").selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(0) + 10; })
        .attr("y", function(d) { return y(d.genre) + 30; })
        .style("text-anchor", "start")
        .text(function(a) { return a.key});
    svg3.append("text")
        .attr("transform", `translate(${(graph_3_width/2 -margin.left/2)}, ${(graph_3_height + 35) })`)    
        .style("text-anchor", "middle")
        .text("Sales (in millions)");
    svg3.append("text")
        .attr("transform", `translate(${(-margin.left/4-12)}, ${graph_3_height/2}) rotate(-90)`)  
        .style("text-anchor", "middle")
        .text("Genre");
});
