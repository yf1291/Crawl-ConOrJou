import scrapy
from Dblp.items import DblpItem
from input_dblp import start_urls,year 

headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'DNT': '1',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
    'Sec-Fetch-User': '?1',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
}

class DblpSpider(scrapy.Spider):
    name = 'dblp'
    allowed_domains = ['dblp.org']  # 限制爬虫的区域
    start_urls = start_urls # ["https://dblp.org/db/conf/sigsoft/index.html"]  # 要爬的dblp会议/期刊的主页


    def parse(self, response):
        # year = 3  # 最近多少年
        if 'journals' in response.url:
            print('journals')
            jou_name = response.xpath('//*[@id="headline"]/h1/text()').get()
            for jou in response.xpath('//*[@id="main"]/ul/li')[:year]:
                href = jou.css('a::attr(href)').get()
                # print(href)
                jou_title = jou.re_first(r'">(.+?)<')
                request = scrapy.Request(href, callback=self.parse_page_jou, cb_kwargs=dict(jou_title=jou_title,jou_name=jou_name),headers=headers)
                yield request
        else:
            con_name = response.xpath('//*[@id="headline"]/h1/text()').get()
            for con in response.xpath("//ul[@class='publ-list']")[:year]:
                for pub in con.xpath("li[@class='entry editor toc']"):
                    a_list = pub.xpath("nav/ul/li/div/a")
                    href = a_list[0].css('a::attr(href)').get()
                    con_title = pub.xpath("cite/span[@class='title']/text()").extract()[0]
                    request = scrapy.Request(href,callback=self.parse_page_con,cb_kwargs=dict(con_title=con_title,con_name=con_name),headers=headers)
                    yield request

    def parse_page_jou(self,response, jou_title, jou_name):
        # print(response.url)
        items = []
        for each in response.xpath('//*[@class="entry article"]'):
            item = DblpItem()
            authors = each.xpath('cite/span[@itemprop="author"]/a/span/text()').extract()
            title = each.xpath('cite/span[@itemprop="name"]/text()').get()
            #xpath返回的是包含一个元素的列表
            item['authors'] = authors
            item['ConOrJouName'] = jou_name
            item['title'] = title
            item['ConOrJou'] = jou_title
            item['category'] = 'Jou'
            items.append(item)

        return items

    def parse_page_con(self, response, con_title, con_name):
        items = []
        for each in response.xpath("//li[@class='entry inproceedings']"):

            item = DblpItem()
            #extract()方法返回的都是unicode字符串
            authors = each.xpath('cite/span[@itemprop="author"]/a/span/text()').extract()
            title = each.xpath('cite/span[@itemprop="name"]/text()').get()

            #xpath返回的是包含一个元素的列表
            item['authors'] = authors
            item['ConOrJouName'] = con_name
            item['title'] = title
            item['ConOrJou'] = con_title
            item['category'] = 'Conf'

            items.append(item)

        # 直接返回最后数据
        return items
