const puppeteer = require('puppeteer');

const year = 10;
const ConOrJou_list = ['"Cell Biology International"','"Cell Biology Research Progress"','"Cell Biology International Reports"'];  // select.options[3] 是出版物名称

(async () => {
  const browser = await puppeteer.launch({headless: false});
  await Promise.all(
    ConOrJou_list.map(async(x) => {
      console.log(x)
      try {
        // const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        const year_index = 2021 - year;
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
        var total = 0;
        // await page.waitForSelector('[id="hitCount.top"]');
        await page.evaluate( () => {total_num = parseInt(document.querySelector('[id="hitCount.top"]').textContent.replace(',',''));return total_num;} ).then( (total_num) => {
          total = total_num;
        } ); 
        for (var start=0;start<total;start+=499){
          start++;
          if (start+499 < total){
            from = start;
            to = start + 499;
          }
          else{
            from = start;
            to = total;
          }
          // export file
          const searchExportButton = await page.$('#exportTypeName');
          if (searchExportButton){
            console.log(1);
            await page.click('#exportTypeName');
            await page.click('#saveToMenu > li:nth-child(3) > a');
          }
          else{
            console.log(2);
            await page.click('#page > div.EPAMdiv.main-container > div.NEWsummaryPage > div.NEWsummaryDataContainer > div > div > div > div.l-column-content > div.l-content > div:nth-child(6) > div.export_options > div.selectedExportOption > ul > li > button').then(() => console.log('success')).catch(() => console.log('fail'));
          }
          // await page.waitForSelector('#numberOfRecordsRange');
          // await page.waitForTimeout(2000);
          // deal the number
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
          await page.click('#exportButton');
          await page.waitForTimeout(5000);
        }
        await page.waitForTimeout(10000);
    } catch(error){
        console.log(error)
      }
    })
  );
  await browser.close();
})();