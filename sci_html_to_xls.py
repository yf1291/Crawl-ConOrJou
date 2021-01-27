from bs4 import BeautifulSoup
import xlwt
import os

file_list = os.listdir('sci_download')
# init xls
workbook = xlwt.Workbook(encoding='utf-8')
worksheet = workbook.add_sheet('info')
worksheet.write(0,0,label='期刊/会议')
worksheet.write(0,1,label='作者')
worksheet.write(0,2,label='论文名称')

index = 1
for file_name in file_list:
    with open(f'sci_download/{file_name}','r',encoding='utf-8') as f:
        html_doc = f.read()

    soup = BeautifulSoup(html_doc, 'html.parser')

    authors = []
    title = ''
    ConOrJou = ''

    for table in soup.find_all('table'):
        if table.tr.td.text != 'PT ':
            continue
        for tr in table.find_all('tr'):
            if tr.td.text == 'AU ':
                authors = [x.strip() for x in tr.find_all('td')[1].get_text().split('\n')]
            elif tr.td.text == 'TI ':
                title = ''.join([x.strip() for x in tr.find_all('td')[1].text.split('\n')])
            elif tr.td.text == 'SO ':
                ConOrJou = tr.find_all('td')[1].text.lower()
        worksheet.write(index,0,label=ConOrJou)
        worksheet.write(index,1,label=authors)
        worksheet.write(index,2,label=title)
        authors = []
        title = ''
        ConOrJou = ''
        index += 1

workbook.save('sci_info.xls')