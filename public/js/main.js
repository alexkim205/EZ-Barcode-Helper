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

  var width = 600,
    height = 400,
    padding = {
      top: 100,
      right: 100,
      bottom: 100,
      left: 100
    }

  var file_data = chooseFile()

  /* 
   * Barcode Plate
   */

  var bc_num_rows = 6,
    bc_num_cols = 12

  var [
    bc_c_lab,
    bc_r_lab,
    bc_plate_data,
    cell_width_half
  ] = plateData(bc_num_rows, bc_num_cols, width, height)

  var svg_bc = d3.select("#svg_bc")
    .attr("width", width + padding.right + padding.left)
    .attr("height", height + padding.top + padding.bottom)

  // construct rows
  var bc_row = svg_bc.selectAll("g.row")
    .data(bc_plate_data)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")

  // construct columns
  var bc_cells = bc_row.selectAll("rect.cell")
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
    .on("mouseover", function (d) {
      $(bc_row).find("rect.cell").attr("fill", "#fff")
      $(this).css("fill", "#000")
    })
    .on("mouseout", function (d) {
      $(this).css("fill", "#fff")
    })

  // draw labels
  var x = d3.scalePoint()
    .domain(bc_c_lab)
    .range([0, (bc_num_cols-1)*cell_width_half * 2])

  var y = d3.scalePoint()
    .domain(bc_r_lab)
    .range([0, (bc_num_rows-1)*cell_width_half * 2])

  var xAxis = d3.axisTop()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)

  var bc_colnames = svg_bc.append("g")
    .attr("class", "colnames")
    .attr("transform", "translate(" + (padding.left + cell_width_half) + "," + padding.top + ")")
    .call(xAxis)

  var bc_rownames = svg_bc.append("g")
    .attr("class", "rownames")
    .attr("transform", "translate(" + (padding.left) + "," + (padding.top + cell_width_half) + ")")
    .call(yAxis)

  /* 
   * Plate
   */

  var num_rows = 8,
    num_cols = 12

  var plate_data = plateData(num_rows, num_cols, width, height)

  var svg_plate = d3.select("#svg_plate")
    .attr("width", width + padding.right + padding.left)
    .attr("height", height + padding.top + padding.bottom)

  // var colors = d3.scaleOrdinal(d3.schemeSet3)

  // construct rows
  var row = svg_plate.selectAll("g.row")
    .data(plate_data)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")

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
    .on("mouseover", function (d) {
      $(row).find("rect.cell").attr("fill", "#fff")
      $(this).css("fill", "#000")
    })
    .on("mouseout", function (d) {
      $(this).css("fill", "#fff")
    })

})