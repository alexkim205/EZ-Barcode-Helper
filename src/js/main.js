var $ = require("jquery")
var d3 = require("d3");

$(document).ready(function () {
    console.log("ready")

    var margin = {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100
        },
        width = 500,
        height = 500

    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)

    var num_rows = 12,
        num_cols = 8,
        row_labels = ["A", "B", "C", "D", "E", "F", "G", "H"],
        col_labels = [0, num_rows]

    var colScale = d3.scaleBand()
        .domain(col_labels)
        .rangeRound([0, width])

    var rowScale = d3.scaleBand()
        .domain(row_labels)
        .rangeRound([0, height])
    
    var colors = d3.schemeSet3()

    var cell = svg.selectAll("rect.cell")
        .data(col_labels)
        .enter()
        .append("rect")
            .attr("class", "cell")
            .style("fill", colors)
            .attr("x", function(d) {return colScale(d)})
            .attr("y", 50)
            .attr("width", colScale.rangeBand())
            .attr("height", 50)
            

    console.log()

})