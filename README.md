# EZ Barcode Helper

Alex Kim
8/03/2018

Make plate preparation for ScreenSeq more intuitive.

## Background

This tool was created as a visual aid for preparing barcode plates for ScreenSeq. Creating barcode plates from master barcode maps can be tedious and error prone, because each map adheres to a different _rule_ (e.g., offset second row by one and combine with first row). This tool takes out the mental exercise of figuring out which barcode rows must be combined into which plate row.

## Usage

Getting the app up and running is simple. If you don't have `Node.JS`, install it [here](https://www.npmjs.com/get-npm).

Run the following commands to install the npm dependencies and serve the local files on a server.

```{bash}
git clone https://github.com/alexkim205/EZ-Barcode-Helper.git
cd EZ-Barcode-Helper
npm install
npm run server
```

Go to [http://127.0.0.1:8080/html/main.html](http://127.0.0.1:8080/html/main.html) on a web browser of your choice.

Choose your barcode map file. This must be a tsv file in the below format. Example barcode maps can be found in the [data/barcodes/](https://github.com/alexkim205/EZ-Barcode-Helper/tree/master/data/barcodes) folder. 

| Row   | Column | Barcode       |
| :---: | :----: | ------------: |
| A     | 1      | AGTCAA_GTGAAA |
| A     | 2      | AGTCAA_GTGAAA |
| A     | 3      | ATGTCA_GTTTCG |

Once your barcode map is uploaded, a table of your tsv file will be displayed and you should be ready to play. Hover over the Plate Preparation plate to explore the interactive features of the app. 

## Features

1. Per Well Information is displayed on the left sidebar as you hover over each well in the plate. 

![well_info](img/well_info.png)

2. Highlighting a row in the plate to prep will highlight the two corresponding rows to pipette from in the barcode master plate.
3. The offset of the second barcode row (highlighted in red) is automatically detected from the barcode map file. Each highlighted well is numbered and shaded accordingly so that you can easily determine which wells must line up with each other. 