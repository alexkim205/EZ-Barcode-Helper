const $ = require("jquery")
var d3 = require("d3")

// require data

var fwd,
  rev

$.getJSON("../js/data.json", function (data) {
    console.log("success");
    fwd = rev = data
    console.log(data)
  })
  .fail(function () {
    console.log("error");
  })
  .always(function () {
    console.log("complete");
  })

// Create row and col array formulas
// https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
var numRange = function (size, startAt = 0) {
  return [...Array(size).keys()].map(i => i + startAt);
}
// https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-alphabet-in-jquery
var charRange = function (c1 = 0, c2 = 25) {
  let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  return (a.slice(c1, c2))
}

var makePlate = function (svg_id, num_rows = 8, num_cols = 12,
  width = 600, padding = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  }) {

  var row_labels = charRange(0, num_rows),
    col_labels = numRange(num_cols, 1)

  var data = new Array(),
    xpos = 1,
    ypos = 1,
    p_width = Math.round(width / num_cols),
    p_height = p_width,
    height = p_width * num_rows

  // populate cell data
  for (let row = 0; row < num_rows; row++) {
    data.push(new Array())

    for (let col = 0; col < num_cols; col++) {
      data[row].push({
        x: xpos,
        y: ypos,
        width: p_width,
        height: p_height,
        col_i: col_labels[col],
        row_i: row_labels[row]
      })
      xpos += p_width
    }
    xpos = 1
    ypos += p_height
  }

  var svg = d3.select("#" + svg_id)
    .attr("width", width + padding.right + padding.left)
    .attr("height", height + padding.top + padding.bottom)

  // construct rows
  var rows = svg.selectAll("g.row")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "row")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")

  // construct columns
  var cells = rows.selectAll("rect.cell")
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

  // draw labels
  var x = d3.scalePoint()
    .domain(col_labels)
    .range([0, (num_cols - 1) * p_width])

  var y = d3.scalePoint()
    .domain(row_labels)
    .range([0, (num_rows - 1) * p_width])

  var xAxis = d3.axisTop()
    .scale(x)

  var yAxis = d3.axisLeft()
    .scale(y)

  var colnames = svg.append("g")
    .attr("class", "colnames")
    .attr("transform", "translate(" + (padding.left + Math.round(p_width / 2)) + "," + padding.top + ")")
    .call(xAxis)

  var rownames = svg.append("g")
    .attr("class", "rownames")
    .attr("transform", "translate(" + (padding.left) + "," + (padding.top + Math.round(p_width / 2)) + ")")
    .call(yAxis)

  return svg
}

var chooseFile = function () {

  var reader = new FileReader();

  reader.onload = function (e) {
    var contents = e.target.result
    var data = d3.tsvParseRows(contents, function (d, i) {
      return {
        Row: d[0],
        Column: +d[1],
        Barcode: d[2],
      }
    })
    data.shift() // remove columns
    console.log(data)
    renderBCPlate(data, "svg_bc", "svg_plate")
  }

  $("input#barcode_f")
    .on("change", function () {
      var file = this.files[0];
      reader.readAsText(file);
    })

}

var renderBCPlate = function (data, bc_svg_id = "svg_bc", plate_svg_id = "svg_plate") {

  let populatePlateData = function (_plate_num_rows, _plate_num_cols) {

    var _plate_data = new Array(),
      row_labels = charRange(0, _plate_num_rows),
      col_labels = numRange(_plate_num_cols, 1)

    Array.prototype.getIndexByRow = function (bcToMatch) {
      for (let i = 0; i < this.length; i++) {
        const bc_row = this[i].row,
          index = $.inArray(bcToMatch, bc_row)
        if (index != -1) {
          return [i, index]
        }
      }
      return [-1, -1]
    }

    // populate cell data
    for (let row = 0; row < _plate_num_rows; row++) {
      _plate_data.push(new Array())

      for (let col = 0; col < _plate_num_cols; col++) {

        let bc_row = row_labels[row]
        let bc_col = col_labels[col]

        let cell_bc = data.find(e => (e.Row == bc_row && e.Column == bc_col)).Barcode.split("_")
        let bc1 = cell_bc[0]
        let bc2 = cell_bc[1]

        _plate_data[row].push({
          row_here: row,
          col_here: col,
          bc1: bc1,
          bc2: bc2,
          bc_row1: fwd.getIndexByRow(bc1)[0],
          bc_row2: rev.getIndexByRow(bc2)[0] + 3, // add 3 b/c rev bc's come after fwd bc's
          bc_offset1: fwd.getIndexByRow(bc1)[1],
          bc_offset2: rev.getIndexByRow(bc2)[1]
        })
      }
    }

    return _plate_data

  }

  // DOMs
  //// svgs
  var bc_svg = $("#" + bc_svg_id),
    plate_svg = $("#" + plate_svg_id)
  //// rows
  var bc_rows = bc_svg.find("g.row"),
    plate_rows = plate_svg.find("g.row")
  //// cells
  var plate_cells = plate_rows.find("rect.cell"),
    bc_cells = bc_rows.find("rect.cell")
  //// counts
  var bc_num_rows = bc_rows.length,
    bc_num_cols = bc_rows.first().children().length,
    plate_num_rows = plate_rows.length,
    plate_num_cols = plate_rows.first().children().length

  var plate_data = populatePlateData(plate_num_rows, plate_num_cols)

  $.each(plate_data, function(i, v) {
    let bcrow1 = bc_rows.eq(v[0].bc_row1),
      bcrow2 = bc_rows.eq(v[0].bc_row2),
      prow = plate_rows.eq(v[0].row_here)
    
    prow.on("mouseover", function(d) {
      // highlight plate row
      $(this).children().css("fill","#000")
      // highlight two barcode rows
      $(bcrow1).children().css("fill", "#add")
      $(bcrow2).children().css("fill", "#daa")
    })
    .on("mouseout", function(d) {
      // clear on mouseout
      $(this).children().css("fill","#fff")
      $(bcrow1).children().css("fill", "#fff")
      $(bcrow2).children().css("fill", "#fff")
    })
  })

  console.log(plate_data)
}

module.exports = {
  makePlate: makePlate,
  chooseFile: chooseFile
}