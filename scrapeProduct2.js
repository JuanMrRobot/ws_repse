const puppeteer = require('puppeteer');

async function scrapeProduct2 (datos){
   
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
			//page.waitForNavigation(20000);
	
			await page.$eval('#res-accion > div > div > div:nth-child(2) > div > form', form => form.submit());

			console.log(page.url());	
	
			//await page.screenshot({ path: 'screenshot4.png' });
		
			/*
			const [rsoc] = await page.$x('//*[@id="rsoc"]');
			
			console.log({rsoc});
			
			await page.screenshot({ path: 'screenshot5.png' });
			*/
			
			await page.type('#rsoc', datos);
			
			//await page.screenshot({ path: 'screenshot5.png' });
			
			const [buscar] = await page.$x('//*[@id="bnt_busqueda"]');
			
			//console.log({buscar});
			if(buscar)
			{
				
				await buscar.click();
				
				//await page.screenshot({ path: 'screenshot6.png' });
				
				//page.waitForNavigation(20000);
				
				const [no_data] = await page.$x('//*[@id="tablaem"]/tbody/h2');
				
				//console.log({no_data});
				
				if(no_data)
				{
					
					//await page.screenshot({ path: 'screenshot7.png' });	
					return ('no hay datos');

				}
				else
				{
					
					
					await page.$eval('#tablaem > tbody > tr > td:nth-child(3) > form', form => form.submit());
					
					//page.waitForNavigation(10000);
					
					//await page.screenshot({ path: 'screenshot8.png' });
					
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

//scrapeProduct('https://repse.stps.gob.mx/app/');
