# EZ Barcode Helper

Alex Kim
8/03/2018

Make plate preparation for ScreenSeq more intuitive.

## Background

This tool was created as a visual aid for preparing barcode plates for ScreenSeq. Creating barcode plates from master barcode maps can be tedious and error prone, because each map adheres to a different _rule_ (e.g., offset second row by one and combine with first row). This tool takes out the mental exercise of figuring out which barcode rows must be combined into which plate row.

## Usage

Getting the app up and running is simple. If you don't have `Node.JS` installed, install it here [https://www.npmjs.com/get-npm]

You will just need to serve these files on a local server.

```{bash}
git clone https://github.com/alexkim205/EZ-Barcode-Helper.git
cd EZ-Barcode-Helper
npm install
npm run server
```
