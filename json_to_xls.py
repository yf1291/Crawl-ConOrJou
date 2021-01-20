import xlwt
import json

workbook = xlwt.Workbook(encoding='utf-8')
worksheet = workbook.add_sheet('info')

worksheet.write(0,0,label='期刊/会议')
worksheet.write(0,1,label='作者')
worksheet.write(0,2,label='论文名称')

with open('info.json','r') as f:
    info_dict = json.load(f)

for index,info in enumerate(info_dict):
    worksheet.write(index+1,0,label=info['ConOrJou'])
    worksheet.write(index+1,1,label=info['authors'])
    worksheet.write(index+1,2,label=info['title'])

workbook.save('info.xls')
