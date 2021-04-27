const { time } = require('console');
const puppeteer = require('puppeteer');

input_object =  {'"ieee transactions on computer-aided design of integrated circuits and systems"': 20}

// const year = 20;
const ConOrJou_list = Object.keys(input_object);  // select.options[3] 是出版物名称
var count = 0;
// NeuroImage
async function run(){
for(let index = 0;index < ConOrJou_list.length; index += 1){
  console.log(ConOrJou_list.slice(index,index+1));
  await test(index,1);
  // await sleep(10000);
}}

console.log(ConOrJou_list.length)
run();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function test(index,length) {
    return new Promise(async (resolve, reject) =>{
      const browser = await puppeteer.launch({headless: false});
      await Promise.all(
        ConOrJou_list.slice(index,index+length).map(async(x) => {
          console.log(x)
          try {
            // const browser = await puppeteer.launch({headless: false});
            const page = await browser.newPage();
            const year_index = 2021 - input_object[x];
            await page.goto('http://apps.webofknowledge.com/UA_GeneralSearch_input.do?product=UA&search_mode=GeneralSearch&SID=D5iRE4rRiXBxpvZfRCN&preferencesSaved=',{timeout:60000});
            await page.click('#clearIcon1');
            // input ConOrJou
            await page.type('[id="value(input1)"]',x);
            await page.select('#select1','SO');
            // choose year
            await page.select('#timespan > div:nth-child(2) > div > select','CUSTOM');
            await page.select('#timespan > div:nth-child(3) > div > select.j-custom-select-yeardropdown.startyear.select2-hidden-accessible',year_index.toString())
            await Promise.all([
              page.waitForNavigation(),
              page.click('span.searchButton > button')
            ]);
            // await page.waitForSelector('[id="hitCount.top"]');
            await page.waitForTimeout(5000);
            await page.evaluate( () => {total_num = parseInt(document.querySelector('[id="hitCount.top"]').textContent.replace(',',''));return total_num;} ).then( (total_num) => {
              console.log(parseInt(total_num/500) + 1)
              count += parseInt(total_num/500) + 1;
              input_object[x] = total_num;
            } ); 
            console.log(x,input_object[x])
            for (let start=0;start<input_object[x];start+=499){
              start++;
              let from = 0;
              let to = 0;
              if (start+499 < input_object[x]){
                from = start;
                to = start + 499;
              }
              else{
                from = start;
                to = input_object[x];
              }
              // export file
              // const searchExportButton = await page.$('#exportTypeName');
              await page.waitForTimeout(1000);
              try {
                // console.log(1);
                await page.click('#exportTypeName');
                await page.click('#saveToMenu > li:nth-child(3) > a');
              }
              catch(error){
                // console.log(error);
                await page.waitForSelector('#page > div.EPAMdiv.main-container > div.NEWsummaryPage > div.NEWsummaryDataContainer > div > div > div > div.l-column-content > div.l-content > div:nth-child(6) > div.export_options > div.selectedExportOption > ul > li > button');
                await page.click('#page > div.EPAMdiv.main-container > div.NEWsummaryPage > div.NEWsummaryDataContainer > div > div > div > div.l-column-content > div.l-content > div:nth-child(6) > div.export_options > div.selectedExportOption > ul > li > button').then(() => console.log('success')).catch((error) => console.log(error,x));
              }
              // await page.waitForSelector('#numberOfRecordsRange');
              await page.waitForTimeout(1000);
              // deal the number
              // await page.waitForSelector('#numberOfRecordsRange');
              await page.click('#numberOfRecordsRange');
              await page.evaluate( (from) => {document.querySelector('#markFrom').value = from;}, from);
              await page.evaluate( (to) => {document.querySelector('#markTo').value = to;}, to);
  
              // choose HTML format
              await page.select('#saveOptions','html');
              // await page.evaluateHandle(() => document.querySelector('#saveOptions').options[1].selected = true);
              // await page._client.send('Page.setDownloadBehavior', {
              //   behavior: 'allow',
              //   downloadPath: 'sci_download',
              // });
              await page.waitForTimeout(1000);
              await page.click('#exportButton');
              await page.waitForTimeout(5000);
            }
            // await page.waitForTimeout(10000); # 用于等待下载，如果不关浏览器则无需等待
        } catch(error){
            console.log(error)
          }
        })
      ).then( () => {
        console.log(count);
        resolve();
      });
      // await browser.close();  
    })
}

// (async () => {
//   const browser = await puppeteer.launch({headless: false});
//   await Promise.all(
//     ConOrJou_list.slice(index,index+5).map(async(x) => {
//       console.log(x)
//       try {
//         // const browser = await puppeteer.launch({headless: false});
//         const page = await browser.newPage();
//         const year_index = 2021 - input_object[x];
//         await page.goto('http://apps.webofknowledge.com/UA_GeneralSearch_input.do?product=UA&search_mode=GeneralSearch&SID=D5iRE4rRiXBxpvZfRCN&preferencesSaved=',{timeout:60000});
//         await page.click('#clearIcon1');
//         // input ConOrJou
//         await page.type('[id="value(input1)"]',x);
//         await page.select('#select1','SO');
//         // choose year
//         await page.select('#timespan > div:nth-child(2) > div > select','CUSTOM');
//         await page.select('#timespan > div:nth-child(3) > div > select.j-custom-select-yeardropdown.startyear.select2-hidden-accessible',year_index.toString())
//         await Promise.all([
//           page.waitForNavigation(),
//           page.click('span.searchButton > button')
//         ]);
//         // await page.waitForSelector('[id="hitCount.top"]');
//         await page.waitForTimeout(5000);
//         await page.evaluate( () => {total_num = parseInt(document.querySelector('[id="hitCount.top"]').textContent.replace(',',''));return total_num;} ).then( (total_num) => {
//           console.log(total_num)
//           count += parseInt(total_num/500) + 1;
//           input_object[x] = total_num;
//         } ); 
//         console.log(x,input_object[x])
//         for (let start=0;start<input_object[x];start+=499){
//           start++;
//           let from = 0;
//           let to = 0;
//           if (start+499 < input_object[x]){
//             from = start;
//             to = start + 499;
//           }
//           else{
//             from = start;
//             to = input_object[x];
//           }
//           // export file
//           // const searchExportButton = await page.$('#exportTypeName');
//           await page.waitForTimeout(1000);
//           try {
//             // console.log(1);
//             await page.click('#exportTypeName');
//             await page.click('#saveToMenu > li:nth-child(3) > a');
//           }
//           catch(error){
//             // console.log(error);
//             await page.click('#page > div.EPAMdiv.main-container > div.NEWsummaryPage > div.NEWsummaryDataContainer > div > div > div > div.l-column-content > div.l-content > div:nth-child(6) > div.export_options > div.selectedExportOption > ul > li > button').then(() => console.log('success',count)).catch(() => console.log('fail'));
//           }
//           // await page.waitForSelector('#numberOfRecordsRange');
//           await page.waitForTimeout(1000);
//           // deal the number
//           await page.click('#numberOfRecordsRange');
//           await page.evaluate( (from) => {document.querySelector('#markFrom').value = from;}, from);
//           await page.evaluate( (to) => {document.querySelector('#markTo').value = to;}, to);

//           // choose HTML format
//           await page.select('#saveOptions','html');
//           // await page.evaluateHandle(() => document.querySelector('#saveOptions').options[1].selected = true);
//           // await page._client.send('Page.setDownloadBehavior', {
//           //   behavior: 'allow',
//           //   downloadPath: 'sci_download',
//           // });
//           await page.waitForTimeout(1000);
//           await page.click('#exportButton');
//           await page.waitForTimeout(5000);
//         }
//         await page.waitForTimeout(10000);
//     } catch(error){
//         console.log(error)
//       }
//     })
//   ).then( () => {console.log(count)});
//   // await browser.close();
// })();