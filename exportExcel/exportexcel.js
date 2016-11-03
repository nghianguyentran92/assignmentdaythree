const fs = require('fs');
const fetch = require( "node-fetch" );
const access = require("./access.json");
const excelbuilder = require('msexcel-builder');
const workbook = excelbuilder.createWorkbook('./', 'sample.xlsx')
const createAuthenticationHeader = (username, password) => {
  return "Basic " + new Buffer( username + ":" + password ).toString( "base64" );
};


fetch(
  "https://play.dhis2.org/demo/api/25/dataElements.json?fields:owner&paging=false",
  {
    headers: {
      Authorization: createAuthenticationHeader( access.username, access.password )
    }
  }
)
  .then( result => result.json() )
  .then( data => transformExcel( data ) );

const transformExcel = data => {

    // Create a new worksheet with 10 columns and 12 rows
    let sheet1 = workbook.createSheet('sheet1',data.dataElements.length,data.dataElements.length);

    // Fill some data
    let count = 1;
    let countsecond = 2;

    data.dataElements.forEach( result => {
          sheet1.set(1,count,result.id);
          sheet1.set(2,count,result.displayName);
          count++;
    });

    // Save it
    workbook.save(function(ok){
      if (!ok)
        workbook.cancel();
      else
        console.log('congratulations, your workbook created');
    });
};
