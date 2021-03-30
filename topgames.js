
NUM_EXAMPLES = 10
// the top 10 video games of all time
let svg = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width +margin.left)
    .attr("height", graph_1_height+ margin.top*2)
    .append("g")
    .attr("transform", `translate(${margin.left/2 + margin.left/2 + 20},${margin.top})`);
let countRef = svg.append("g");
let y_axis_label = svg.append("g");

let title = svg.append("text")
    .attr("transform", `translate(${(graph_1_width/2- margin.left)}, ${-20})`)
    .style("text-anchor", "middle")
    .style("font-size", 20)
    .style("font-family", "Helvetica") 
    .text("Top 10 Video Games of All Time");


let y_axis_text = svg.append("text")
    .attr("transform", `translate(${(- graph_1_width /6)}, ${graph_1_height})`)
    .style("text-anchor", "middle");

d3.csv(filename).then(function(data) {

    data = cleanData(data, function(a,b){return parseFloat(b.Global_Sales) - parseFloat(a.Global_Sales)}, 10);
    let x = d3.scaleLinear()
        .domain([0, Math.min(graph_1_height, d3.max(data,function(d){return parseFloat(d.Global_Sales);})*1.2)])
        .range([0,graph_1_width-margin.left]);

    let y = d3.scaleBand()
        .domain(data.map(function(a){return a.Name;}))
        .range([0, graph_1_height-margin.top/4])
        .padding(0.1);

    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickPadding(10));
    let bars = svg.selectAll("rect").data(data);
    let color = d3.scaleOrdinal()
        .domain(data.map(function(d) { return d["Name"] }))
        .range(d3.schemePastel1, NUM_EXAMPLES);

    bars.enter()
        .append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d['Name']) }) 
        .attr("x", x(0)+1 )
        .attr("y", function(a){return y(a.Name);})
        .attr("width", function(a){return x(parseFloat(a.Global_Sales));})
        .attr("height",  y.bandwidth());

    let counts = countRef.selectAll("text").data(data);

    counts.enter()
        .append("text")
        .merge(counts)
        .attr("x", function(d) { return x(parseFloat(d.Global_Sales))+8 ; })
        .attr("y", function(d) { return y(d.Name)+15 ; })    
        .style("text-anchor", "start")
        .text(function(d) { return parseFloat(d.Global_Sales)});

    svg.append("text")
        .attr("transform", `translate(${(graph_1_width ) / 4}, ${(graph_1_height + 20) })`)    
        .style("text-anchor", "middle")
        .text("Sales (in millions)");
    svg.append("text")
        .attr("transform", `translate(${(-margin.left/2-75)}, ${graph_1_height/2}) rotate(-90)`)  
        .style("text-anchor", "middle")
        .text("Video Game Title");

});
function cleanData(data, comparator, numExamples) {
    return data.sort(comparator).slice(0, numExamples);
}
