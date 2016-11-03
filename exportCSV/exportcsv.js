const fs = require('fs');
const json2csv = require('json2csv');
const fetch = require( "node-fetch" );
const access = require("./access.json");

const title = [
   "DataSet","period","orgUnitid","orgUnitname","value"
]

const createAuthenticationHeader = (username, password) => {
  return "Basic " + new Buffer( username + ":" + password ).toString( "base64" );
};


fetch(
  "http://dhis.academy/lao_25/api/25/analytics.json?dimension=dx:Q21U47uf0xo.REPORTING_RATE;Fpl26CKBEqZ.REPORTING_RATE;xm6LbvmURdm.REPORTING_RATE;eDXUmwx0yw8.REPORTING_RATE&dimension=pe:LAST_3_MONTHS&dimension=ou:IWp9dQGM0bS;OU_GROUP-jblbYwuvO33;OU_GROUP-gHfSdwPrC83&displayProperty=SHORTNAME&outputIdScheme=UID",
  {
    headers: {
      Authorization: createAuthenticationHeader( access.username, access.password )
    }
  }
)
  .then( result => result.json() )
  .then (data => makeCSVformat(data))

const makeCSVformat = data => {
     ExportCSVFile( data.rows.map( feature => {
         return {
           DataSet:data.metaData.names[feature[0]],
           period:feature[1],
           orgUnitid:feature[2],
           orgUnitname:data.metaData.names[feature[2]],
           value:feature[3],
         };
       } ) )
};

const ExportCSVFile = result => {
   json2csv({ data: result, fields: title }, function(err, csv) {
     if (err) console.log(err);
      fs.writeFile("./dataCSV.csv", csv);
      console.log("success");
   });
}