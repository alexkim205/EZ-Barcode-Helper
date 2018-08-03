const $ = require("jquery")
var d3 = require("d3")

// require data

var fwd, rev

// lazy scoping -> TODO change later
var p_width,
  padding = {
    top: 50,
    right: 30,
    bottom: 50,
    left: 30
  }

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
    ypos = 1
  p_width = Math.round(width / num_cols)
  var p_height = p_width,
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
        Column: d[1],
        Barcode: d[2],
      }
    })
    data.shift() // remove columns

    renderTable(data, "well_table")
    renderBCPlate(data, "svg_bc", "svg_plate")
  }

  $("input#barcode_f")
    .on("change", function () {
      var file = this.files[0];
      reader.readAsText(file);
      // unbind all event listeners
      //// rows
      var bc_rows = $("#svg_bc").find("g.row"),
        plate_rows = $("#svg_plate").find("g.row")
      //// cells
      var plate_cells = plate_rows.find("rect.cell"),
        bc_cells = bc_rows.find("rect.cell")

      // unbind mouse events
      bc_rows.unbind()
      plate_rows.unbind()
      plate_cells.unbind()
      bc_cells.unbind()

      // remove barcode table
      $("#well_table").empty().append("<h3>Barcode Table</h3>")

    })

}

var renderTable = function (data, table_id) {

  var table = d3.select('#well_table').append('table')
  var thead = table.append('thead')
  var tbody = table.append('tbody');

  var columns = Object.keys(data[0])

  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .text(function (column) {
      return column;
    });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr');

  // create a cell in each row for each column
  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return {
          column: column,
          value: row[column]
        };
      });
    })
    .enter()
    .append('td')
    .text(function (d) {
      return d.value;
    });

  return table;


}

var renderBCPlate = function (data, bc_svg_id = "svg_bc", plate_svg_id = "svg_plate") {

  let populatePlateData = function (_plate_num_rows, _plate_num_cols) {

    var row_labels = charRange(0, _plate_num_rows),
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

    var _plate_data = new Array()

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

  // render row highlights
  $.each(plate_data, function (i, row) {
    let bcrow1 = bc_rows.eq(row[0].bc_row1),
      bcrow2 = bc_rows.eq(row[0].bc_row2),
      prow = plate_rows.eq(row[0].row_here)

    // render per cell
    var row_labels = charRange(0, plate_num_rows),
      col_labels = numRange(plate_num_cols, 1)

    var drawNumbers = function (_svg_id, id_name, row_number, _num_cols, offset, _row, hue) {

      // reset labels
      let _col_labels = numRange(_num_cols, 1)

      // create array with offsets
      let offset_col_labels = _col_labels.concat(_col_labels.splice(0, _num_cols - offset))

      // create axis
      let xAxis = d3.axisTop()
        .scale(
          d3.scalePoint()
          .domain(offset_col_labels)
          .range([0, (_num_cols - 1) * p_width])
        )
        .tickSize(0)

      // Highlight
      let colorScale = d3.scaleSequential(hue)
        .domain([-3, _num_cols])

      _row.children().each(function (i) {
        $(this).css("fill", colorScale(offset_col_labels[i]))
      })

      // draw
      d3.select("#" + _svg_id).append("g")
        .attr("id", id_name)
        .attr("class", "offset_colnames")
        .attr("transform",
          "translate(" + (padding.left + Math.round(p_width / 2)) + "," +
          (padding.top + (p_width * row_number) + Math.round(p_width * 3 / 4)) + ")")
        .call(xAxis)

    }

    prow.on("mouseover", function (d) {

      // bc2 display numbering with offset and highlights
      drawNumbers(bc_svg_id, "offset_bc1_colnames", row[0].bc_row1, bc_num_cols, 0,
        bcrow1, d3.interpolateBlues)
      drawNumbers(bc_svg_id, "offset_bc2_colnames", row[0].bc_row2, bc_num_cols, row[0].bc_offset2 - row[0].bc_offset1,
        bcrow2, d3.interpolateReds)
      drawNumbers(plate_svg_id, "offset_plate_colnames", row[0].row_here, plate_num_cols, 0,
        $(this), d3.interpolatePurples)

    })

    prow.on("mouseout", function (d) {
      // clear on mouseout
      $(this).children().css("fill", "#fff")
      $(bcrow1).children().css("fill", "#fff")
      $(bcrow2).children().css("fill", "#fff")
      $("g.offset_colnames").remove()
    })

    $.each(row, function (i, cell) {

      let cellToHover = prow.children().eq(cell.col_here)
      let $info = $("#well_info_table")

      cellToHover.on("mouseover", function (d) {
          // append appropriate info
          var table = d3.select('#well_info_table').append('table')
          var thead = table.append('thead')
          var tbody = table.append('tbody');

          var columns = ["Row", "Column", "Forward BC", "Reverse BC"]
          var row_data = [{
            "Row": row_labels[cell.row_here],
            "Column": col_labels[cell.col_here],
            "Forward BC": cell.bc1,
            "Reverse BC": cell.bc2
          }]
          console.log(row_data)
          // append the header row
          thead.append('tr')
            .selectAll('th')
            .data(columns).enter()
            .append('th')
            .text(function (column) {
              return column
            })

          // create a row for each object in the data
          var rows = tbody.selectAll('tr')
            .data(row_data)
            .enter()
            .append('tr');

          // create a cell in each row for each column
          var cells = rows.selectAll('td')
            .data(function (row) {
              return columns.map(function (column) {
                return {
                  column: column,
                  value: row[column]
                };
              });
            })
            .enter()
            .append('td')
            .text(function (d) {
              return d.value;
            });

        })
        .on("mouseout", function (d) {
          // clear
          $info.empty()
          $info.append("<h3>Well Information</h3>")
        })
    })

  })
}

module.exports = {
  makePlate: makePlate,
  chooseFile: chooseFile
}