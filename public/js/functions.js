const $ = require("jquery")
var d3 = require("d3")

var makePlate = function (svg_id, num_rows = 8, num_cols = 12,
  width = 600, padding = {
    top: 100,
    right: 100,
    bottom: 100,
    left: 100
  }) {

  // Create row and col array formulas
  // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
  function numRange(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  // https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-alphabet-in-jquery
  function charRange(c1 = 0, c2 = 25) {
    let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    return (a.slice(c1, c2))
  }

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
    .on("mouseover", function (d) {
      $(rows).find("rect.cell").attr("fill", "#fff")
      $(this).siblings().css("fill", "#000")

    })
    .on("mouseout", function (d) {
      $(this).siblings().css("fill", "#fff")
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

  d3.select("input#barcode_f")
    .attr("accept", ".tsv")
    .style("margin", "5px")
    .on("change", function () {
      var file = d3.event.target.files[0]
      if (file) {
        var reader = new FileReader()
        reader.onloadend = function (evt) {
          var dataUrl = evt.target.result
          // The following call results in an "Access denied" error in IE.
          d3.tsv(dataUrl, function (error, data) {
            if (error) throw error
            data.forEach(function (d) {
              console.log(d)
            })
          })
        }
        reader.readAsDataURL(file)
      }
    })

}

module.exports = {
  makePlate: makePlate,
  chooseFile: chooseFile
}