import json
from collections import OrderedDict

exif_tags = OrderedDict()

f = open("./exif-tags.txt", "r")
lines = f.readlines()

for line in lines:
    splitted = line.split('\t')
    exif_tags[splitted[0]] = { 'Tag(dec)': splitted[1], 'IFD': splitted[2], 'Key': splitted[3], 'Type': splitted[4], 'Tag description': splitted[5].rstrip('\n')}

with open('exif-tags.json', 'w', encoding="utf-8") as make_file:
    json.dump(exif_tags, make_file, ensure_ascii=False, indent="\t")
