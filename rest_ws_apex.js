const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const fetch = require("node-fetch");

async function rest_apex (datos){

try{
         //https://babilonia.maxapex.net/apex/alere_ams_desa/hr/employees/:id
    fetch('https://babilonia.maxapex.net/apex/alere_ams_desa/hr/employees/8890', {
        method: 'PUT',
        body: JSON.stringify({
             //id:7839
            //  "EMPNO": 8890             
             "ENAME": "JLC"
           ,  "JOB": "DEV"
        }),
        headers: {
            "Content-type": "application/json"
        }
       })
      .then(response => response.text())
      .then(text => console.log(text))
      }catch(err){
            console.log(text);
            return ('Fallo el Fetch');
      }
      console.log('Envio info a APEX');
      return('Envio info a APEX');
}

app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
module.exports = {
  rest_apex
}

//rest_ws_apex(null);