import re

def transfer():
    output_dict = dict()
    total_dict = dict()
    with open('input.txt','r') as f:
        line = f.readline()
        while(line != ''):
            # print(line.split(' '))
            slice_list = line.split(' ')
            name = ' '.join(slice_list[:-1]).strip().lower()
            # print(slice_list)
            pattern = re.compile('\d')
            year = pattern.findall(line)[-1]
            # year = int(slice_list[-1])
            # year = 6
            output_dict[f'"{name}"'] = year
            if name not in total_dict:
                total_dict[name] = 1
            else:
                total_dict[name] += 1
            # name_list.append(f'"{name}"')
            # year_lsit.append(year)
            line = f.readline()
    # print(total_dict)
    for n in total_dict:
        if total_dict[n] > 1:
            print(n,total_dict[n])
    print(len(output_dict))
    print(output_dict)
    # print(name_list)
    # print(year_lsit)
    return output_dict

if __name__ == "__main__":
    transfer()

