# 爬虫小工具
## DBLP 爬虫说明
一个用于爬取dblp的信息的爬虫，主要利用python的scrapy来实现。
### 安装依赖
```
    pip install scrapy
```
由于scrapy需要用到Twisted，而安装Twisted需要安装Microsoft C++ Build Tools，所以如果没安装C++ Build Tools会出现安装错误。

### 使用说明
在dblp_crawl/input.py文件中，修改start_urls和year
```
    start_urls = []  # 需要搜索的期刊/会议的dblp主页
    year = n  # 最近的n届期刊/会议
```
设定好参数之后即可进行爬虫
```
    # -o 后面的是文件名，可以支持的格式有info.json, iofo.json1, info.csv, info.xml，启动命令在下方
    scrapy crawl dblp -o info.csv

    # 如果还出现乱码就使用以下方法（建议使用该方法），
    scrapy crawl dblp -o info.json # 会输出info.json文件，为源数据
    python json_to_xlsx.py # 会输出两个文件，dblp_list_info是清洗后的源数据，dblp_sort_info是统计后的数据
```

### 输出文件说明
输出的文件为dblp_info.xls
| 参数 | 含义 |
| - | - |
| ConOrJou | 会议/期刊 |
| authors | 作者列表 |
| title | 论文名字 |

## SCI 爬虫说明
一个用于爬取web of science的信息的爬虫，主要使用js的puppeteer实现。
### 安装依赖
```
    npm install puppeteer
```
注意，需要提前安装好node.js

### 使用说明
#### 按期刊名字搜索
在sci_crawl/input.txt中输入所需爬的 会议/期刊 年限，可以运行transfer.py转换成ConOrJou_dict
```
Cell 5
Science 5
```
在crawl_sci.js文件中，修改ConOrJou_dict
```
    ConOrJou_dict = {'"Cell"':5,'"Science"':5}
```
设定好参数之后即可进行爬虫
```
    # 爬取web of science网页信息，会下载到电脑的浏览器默认下载地址
    node .\crawl_sci.js

    # 将下载的文件复制到sci_download文件夹中，运行python脚本清洗数据，将会输出sci_sort_info.xlsx文件
    python .\sci_html_to_xlsx.py
```

#### 按人名搜索
在sci_crawl/input.txt中输入所需爬的 人名 年限，可以运行transfer.py转换成ConOrJou_dict
```
Lo, David 5
Xia, Xin 5
Yi Li 5
```
在crawl_sci.js文件中，修改ConOrJou_dict
```
    ConOrJou_dict = {'"lo, david"': '5', '"xia, xin"': '5', '"yi li"': '5'}
```
设定好参数之后即可进行爬虫
```
    # 爬取web of science网页信息，会下载到电脑的浏览器默认下载地址
    node .\crawl_sci_author.js

    # 将下载的文件复制到sci_download文件夹中，运行python脚本清洗数据，将会输出sci_sort_info_author.xlsx文件
    python .\sci_html_to_xlsx_author.py
```

### 输出文件说明
输出的文件为sci_info.xls
| 参数 | 含义 |
| - | - |
| ConOrJou | 会议/期刊 |
| authors | 作者列表 |
| title | 论文名字 |