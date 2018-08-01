var d3 = require("d3")

var makePlate = function (svg_id, num_rows = 8, num_cols = 12, width = 600, height = 500) {
  
}

var plateData = function (num_rows = 8, num_cols = 12, width = 600, height = 500) {

  // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
  function numRange(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
  // https://stackoverflow.com/questions/24597634/how-to-generate-an-array-of-alphabet-in-jquery
  function charRange(c1 = 0, c2 = 25) {
    let a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return (a.slice(c1, c2));
  }

  var row_labels = charRange(0, num_rows),
    col_labels = numRange(num_cols, 1)

  var data = new Array(),
    xpos = 1,
    ypos = 1,
    p_width = Math.round(width/num_cols),
    p_height = p_width

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

  return [col_labels, row_labels, data, Math.round(p_width/2)]
}

var chooseFile = function () {

  d3.select("body")
    .append("input")
    .attr("type", "file")
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
            return data
          })
        }
        reader.readAsDataURL(file)
      }
    })

}

module.exports = {
  plateData: plateData,
  chooseFile: chooseFile
}