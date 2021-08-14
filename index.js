const express = require("express");
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const puppeteer = require('puppeteer');


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

async function scrapeProduct2 (url,datos,pasos){
   
  /*  var respuesta;
    if(datos=='GTIM SOFTWARE PROJECTS S DE RL DE CV')
        respuesta =  {'FOLIO': '12278','RAZON_SOCIAL':'GTIM SOFTWARE PROJECTS S DE RL DE CV', 'ENTIDAD':'Nuevo León / San Pedro Garza García', 'REGISTRO':'AR12003 / 2021-08-03'};
    else
        respuesta = {'ERROR':'NO HAY DATOS'};
     return respuesta;
*/

    const browser = await puppeteer.launch();
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
      //  page.waitForNavigation(20000);
        await page.waitForSelector('#res-accion > div > div > div:nth-child(2) > div > form');

        await page.$eval('#res-accion > div > div > div:nth-child(2) > div > form', form => form.submit());

        console.log(page.url());	

        //await page.screenshot({ path: 'screenshot4.png' });
    
        /*
        const [rsoc] = await page.$x('//*[@id="rsoc"]');
        
        console.log({rsoc});
        
        await page.screenshot({ path: 'screenshot5.png' });
        */
        await page.waitForSelector('#rsoc');
        await page.type('#rsoc', datos);
        
        //await page.screenshot({ path: 'screenshot5.png' });
        
        const [buscar] = await page.$x('//*[@id="bnt_busqueda"]');
        
        //console.log({buscar});
        if(buscar)
        {
            
            await buscar.click();
            
            //await page.screenshot({ path: 'screenshot6.png' });
            
            //page.waitForNavigation(20000);
            
            
            
            //console.log({no_data});
            
          
            try
            {   
                await page.waitForSelector('#tablaem > tbody > h2');
                const [ERROR] = await page.$x('//*[@id="tablaem"]/tbody/h2');

                //await page.screenshot({ path: 'screenshot7.png' });	
                return ({ERROR});

            }catch(err)
            {
                
                await page.waitForSelector('#tablaem > tbody > tr > td:nth-child(3) > form');

                await page.$eval('#tablaem > tbody > tr > td:nth-child(3) > form', form => form.submit());
                
                //page.waitForNavigation(10000);
                
                //await page.screenshot({ path: 'screenshot8.png' });
                await page.waitForSelector('body > div.content > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > div > p.highlightname');

                const[razon] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[1]/div/p[2]');
                const getMsgRazon = await page.evaluate(name => name.textContent, razon);
                //const [txt] = await razon.getProperty('textContent');
                
                const[municipio] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[2]/div/p[2]');
                const getMsgMunicipio = await page.evaluate(name => name.textContent, municipio);
                
                const[registro] = await page.$x('/html/body/div[3]/div[2]/div[1]/div/div[3]/div/p[2]');
                const getMsgRegistro = await page.evaluate(name => name.textContent, registro);

                const[folio] = await page.$x('/html/body/div[3]/div[1]/div[1]/div/h3[1]');
                const getMsgFolio = await page.evaluate(name => name.textContent, folio);

                //const[servicios] = await page.$x('/html/body/div[3]/div[2]/div[2]/div[1]/ul');
                 
                const getMsgServices = await page.evaluate(() =>
                Array.from(
                  document.querySelectorAll('body > div.content > div:nth-child(3) > div:nth-child(2) > div ul'),
                  (element) => element.textContent
                )
              )
              //console.log(services)

                //const getMsgServicios = await page.evaluate(name => name.textContent, services);

        
                console.log({ getMsgFolio, getMsgRazon, getMsgMunicipio, getMsgRegistro, getMsgServices });
                
                await browser.close();

                return ({ getMsgFolio, getMsgRazon, getMsgMunicipio, getMsgRegistro, getMsgServices });
                    
            } 
            
        }
        
    }
    }
    
    browser.close()
    
    
}


app.get('/', function(req, res) {
 respuesta = {
  error: true,
  codigo: 200,
  mensaje: 'Punto de inicio'
 };
 res.send(respuesta);
});
app.post('/scrape', async (req, res) =>{
    
   // const {rs} = req.params
    
    console.log(req.body);

    if (req.body.razonSocial) {

        
      //  rsocial.razonSocial=rs; //'GTIM SOFTWARE PROJECTS S DE RL DE CV',
       // rsocial.url=rs;
      // res.send(rs);
        const result = await scrapeProduct2(req.body.url, req.body.razonSocial, null) ;
        res.send(result);
        //(res.json(rsocial)
    } else {
        res.send('Fallo');
    }


});

 /*
 .post(function (req, res) {
  if(!req.body.rs || !req.body.url) {
   respuesta = {
    error: true,
    codigo: 502,
    mensaje: ' RS y URL son campos requeridos'
   };
  } else {

     rs = {
     razonSocial: req.body.rasonSocial,
     url: req.body.url
    };
    respuesta = {
     error: false,
     codigo: 200,
     mensaje: 'rs creado',
     respuesta: rs
    };
   }
   res.send(respuesta);
  }
);
*/


app.use(bodyParser.json())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});