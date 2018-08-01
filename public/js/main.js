// dependencies
const $ = require("jquery")
const d3 = require("d3")
require("d3-scale-chromatic")

// require functions
var {
  plateData,
  chooseFile
} = require("./functions")
// require data
var {
  fwd,
  rev
} = require("./data")

$(document).ready(function () {

  console.log("ready")

  var file_data = chooseFile()
  var plate_data = plateData(8, 12)

  var width = 800,
    height = 500

  /* 
   * Barcode Plate
   */

  var svg_bc = d3.select("#svg_bc")
    .attr("width", width)
    .attr("height", height)

  /* 
   * Plate
   */

  var svg_plate = d3.select("#svg_plate")
    .attr("width", width)
    .attr("height", height)

  var colors = d3.scaleOrdinal(d3.schemeSet3)

  // construct rows
  var row = svg_plate.selectAll("g.row")
    .data(plate_data)
    .enter()
    .append("g")
    .attr("class", "row")

  // construct columns
  row.selectAll("rect.cell")
    .data(function (d) {
      return d
    })
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("width", function (d) {
      return d.width
    })
    .attr("height", function (d) {
      return d.height
    })
    .attr("x", function (d) {
      return d.x
    })
    .attr("y", function (d) {
      return d.y
    })
    .style("fill", "#fff")
    .style("stroke", "rgba(0,0,0,0.6)")

})