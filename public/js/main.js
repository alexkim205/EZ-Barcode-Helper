// dependencies
const $ = require("jquery")
const d3 = require("d3")
require("d3-scale-chromatic")

// require functions
var {
  makePlate,
  chooseFile
} = require("./functions")
// require data
var {
  fwd,
  rev
} = require("./data")

$(document).ready(function () {

  console.log("ready")

  chooseFile()
  // console.log(file_data)

  var width = 500,
    height = 300,
    padding = {
      top: 50,
      right: 30,
      bottom: 50,
      left: 30
    }

  /* Barcode Plate */

  var bc_num_rows = 6,
    bc_num_cols = 12

  var bc_svg = makePlate("svg_bc", bc_num_rows, bc_num_cols,
    width, padding)

  /* Prep Plate */

  var plate_num_rows = 8,
    plate_num_cols = 12

  var plate_svg = makePlate("svg_plate", plate_num_rows, plate_num_cols,
    width, padding)

  // connecting logic



})