"use strict";
  // require importing modules
  const scrapeIt = require("scrape-it");
  const fs = require("fs");
  const json2csv = require('json2csv');

  // global variables
  const url1 = 'http://shirts4mike.com/';
  const accessUrl = "http://www.shirts4mike.com/shirts.php";
  let date = new Date();
  let links = [];
  let page = [];
  let csv = [];
  let pageData = [];
  let counter = 0;

  // Check to see if there is a folder named data use the File System Node Js

  if (!fs.existsSync('./data')) {
    console.log('Made a data folder.');
    fs.mkdirSync('./data');
  }

// scrape to grab the links to all the shirts

  scrapeIt(accessUrl, {
    pages: {
      listItem: ".products li"
      ,data: {
      url: {
        selector: "a",
        attr: "href"
        }
      }
    }
  }).then(url => {

    // Start to build the page array to scrape each induvidual page.

  url.pages.forEach(function(element) {
			page.push(element.url);
        })

// build up each individual page array and put it into an array

    let page1 = `${url1}${page[0]}`,
        page2 = `${url1}${page[1]}`,
        page3 = `${url1}${page[2]}`,
        page4 = `${url1}${page[3]}`,
        page5 = `${url1}${page[4]}`,
        page6 = `${url1}${page[5]}`,
        page7 = `${url1}${page[6]}`,
        page8 = `${url1}${page[7]}`;

links.push(page1, page2, page3, page4, page5, page6, page7, page8);

// create the time Object

let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

let min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

let time = `${hour}:${min}`;

// scrape the links for product title, price, image, and url.

links.forEach(function(element) {
    scrapeIt(element, {
      title: {
        selector: 'title'
      },
      price: {
        selector: '.price'
      },
      imageURL: {
        selector: 'img',
        attr: 'src'
      },
  }).then(data => {
    let pageInfo = data;
    pageInfo.url = element;
    pageInfo.time = time;
    pageData.push(pageInfo);

// get a new date and put it into the correct format to create the csv file

 let date1 = new Date();
 date1 = date1.toISOString().slice(0,10);

// building the folder with the info in the correct Order

const fields = ["title", "price", "imageURL", "url", "time"];

let csv = json2csv({ data: pageData, fields: fields });

fs.writeFile(`data/${date1}.csv`, csv, function(err) {
  if (err) throw err;
  counter += 1;
  if (counter === 1) {
    console.log(`${counter} page scraped and saved into data folder.`);
  }else{
    console.log(`${counter} pages scraped and saved into data folder.`);
     }

    }); // end of write
   }); // end of then
  }); // end of for each

    }).catch(function () {
        let log = `${date.toString()} Sorry we could not connect to ${accessUrl} please check your connection and try agian.\n`;
        let errorFile = 'scraper-error.log';
        console.error(log);
        if (!errorFile) {
          fs.writeFile(errorFile, log);
        }else {
          fs.appendFile(errorFile, log);

        } // end of catch
 });   // End of scrapeIt
