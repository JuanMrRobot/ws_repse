const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const fetch = require("node-fetch");

const res_ws = require('./rest_ws_apex');
const scrape = require('./scrapeProduct2');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const puppeteer = require('puppeteer');
const { Router } = require("express");
const { text } = require("body-parser");


let rsocial = {
 razonSocial:'',
 url: ''
};

let respuesta = {
 error: false,
 codigo: 200,
 mensaje: ''
};


let resscrap= {
    error: false,
    codigo: 200,
    mensaje: ''
   };
   
/*
function valida_repse(url, datos, pasos) {
    var respuesta;
        if(razonSocial=='GTIM SOFTWARE PROJECTS S DE RL DE CV')
            respuesta =  {'FOLIO': '12278','RAZON_SOCIAL':'GTIM SOFTWARE PROJECTS S DE RL DE CV', 'ENTIDAD':'Nuevo León / San Pedro Garza García', 'REGISTRO':'AR12003 / 2021-08-03'};
        else
            respuesta = {'ERROR':'NO HAY DATOS'};

    return respuesta;
}
*/


app.get ('/', async (req, res ) =>{
 
  console.log(req.body.razonSocial);
 
 if (req.body.razonSocial) {

//Scraper REPSE
     const result = await scrape.scrapeP(req.body.razonSocial, null) ;
//APEX RESTful     
     const rest = await res_ws.rest_apex(null) ;
  
    res.send(result);

 } else {
  return res.send('Fallo GET');
 }
});

app.post('/', async (req, res) =>{

  console.log(req.body.razonSocial);
 
  if (req.body.razonSocial) {
 
 //Scraper REPSE
      const result = await scrape.scrapeP(req.body.razonSocial, null) ;
 //APEX RESTful     
      const rest = await res_ws.rest_apex(null) ;
   
     res.send(result);
 
  } else {
   return res.send('Fallo POST');
  }
 });

app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});
