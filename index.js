const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();

const fetch = require("node-fetch");

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

async function scrapeProduct2 (datos,pasos){
   
  /*  var respuesta;
    if(datos=='GTIM SOFTWARE PROJECTS S DE RL DE CV')
        respuesta =  {'FOLIO': '12278','RAZON_SOCIAL':'GTIM SOFTWARE PROJECTS S DE RL DE CV', 'ENTIDAD':'Nuevo León / San Pedro Garza García', 'REGISTRO':'AR12003 / 2021-08-03'};
    else
        respuesta = {'ERROR':'NO HAY DATOS'};
     return respuesta;
*/

    const browser = await puppeteer.launch(
      { headless: true,
        args:[
           "--disable-gpu",
           "--disable-dev-shm-usage",
           "--disable-setuid-sandbox",
           "--no--sandbox",	
        ]
       }
    );
    const page = await browser.newPage();
        
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });
    
    await page.goto('https://repse.stps.gob.mx/app/', {waitUntil: 'load'});
    
    const [video] = await page.$x('//*[@id="fancybox-1"]/div[2]/div/div/div/div/button');
    
    if(video){
        await video.click();
        
        //await page.screenshot({ path: 'screenshot1.png' });

        const [consulta] = await page.$x('//*[@id="act-consulta"]'); 
        
        
        if(consulta){
        
        //await page.screenshot({ path: 'screenshot2.png' });			
        
        await consulta.click();
        
        //await page.screenshot({ path: 'screenshot3.png' });
        await page.waitForSelector('#res-accion > div > div > div:nth-child(2) > div > form');

        await page.$eval('#res-accion > div > div > div:nth-child(2) > div > form', form => form.submit());

        console.log(page.url());	

        //await page.screenshot({ path: 'screenshot4.png' });

        await page.waitForSelector('#rsoc');
        await page.type('#rsoc', datos);
        
        //await page.screenshot({ path: 'screenshot5.png' });
        
        const [buscar] = await page.$x('//*[@id="bnt_busqueda"]');

        if(buscar)
        {
            
            await buscar.click();
            
         
          
            try
            {   
                await page.waitForSelector('#tablaem > tbody > h2');
                const [ERROR] = await page.$x('//*[@id="tablaem"]/tbody/h2');

                //await page.screenshot({ path: 'screenshot7.png' });	
                return ('NO HAY DATOS');

            }catch(err)
            {
                
                await page.waitForSelector('#tablaem > tbody > tr > td:nth-child(3) > form');

                await page.$eval('#tablaem > tbody > tr > td:nth-child(3) > form', form => form.submit());
                
                //await page.screenshot({ path: 'screenshot8.png' });
                await page.waitForSelector('body > div.content > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > div > p.highlightname');

                const[razon] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[1]/div/p[2]');
                const getMsgRazon = await page.evaluate(name => name.textContent, razon);
                
                const[municipio] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[2]/div/p[2]');
                const getMsgMunicipio = await page.evaluate(name => name.textContent, municipio);
                
                const[registro] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[3]/div/p[2]');
                const getMsgRegistro = await page.evaluate(name => name.textContent, registro);

                const[folio] = await page.$x('/html/body/div[3]/div[1]/div[1]/div/h3[1]');
                const getMsgFolio = await page.evaluate(name => name.textContent, folio);
               
                const getMsgServices = await page.evaluate(() =>
                Array.from(
                  document.querySelectorAll('body > div.content > div:nth-child(3) > div:nth-child(2) > div ul'),
                  (element) => element.textContent
                )
              )
        
                console.log({ getMsgFolio, getMsgRazon, getMsgMunicipio, getMsgRegistro, getMsgServices });
                
                await browser.close();

                return ({ getMsgFolio, getMsgRazon, getMsgMunicipio, getMsgRegistro, getMsgServices });
                
                    
            } 
            
        }
        
    }
    }
    
    browser.close()
    
    
}

app.get ('/', async (req, res ) =>{
 console.log(req.body);
 
 if (req.body.razonSocial) {
     const result = await scrapeProduct2(req.body.razonSocial, null) ;

  try{
         //https://babilonia.maxapex.net/apex/alere_ams_desa/hr/employees/:id
    fetch('https://babilonia.maxapex.net/apex/alere_ams_desa/hr/employees/8890', {
        method: 'PUT',
        body: JSON.stringify({
             //id:7839
            //  "EMPNO": 8890             
             "ENAME": "JOHN"
           ,  "JOB": "DEV"
        }),
        headers: {
            "Content-type": "application/json"
        }
       })
      .then(response => response.text())
      .then(text => console.log(text))
          }catch(err){
            return res.send('Fallo el Fetch');
          }

    res.send(result);

 } else {
  return res.send('Fallo GET');
 }
});

app.post('/', async (req, res) =>{

    console.log(req.body);
    
    if (req.body.razonSocial) {
        const result = await scrapeProduct2(req.body.razonSocial, null) ;
        res.send(result);
    } else {
      return res.send('Fallo POST',req.url, req.razonSocial);

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
