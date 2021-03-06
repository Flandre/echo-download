#-*-encoding:utf-8 -*-
import requests
import urllib
import json
import re
from bs4 import BeautifulSoup

session = requests.Session()

def getSkill(id):
    url = 'https://api.ffxiv.cn/ajax/Articles/Index/' + urllib.quote(id)
    req = session.get(url)
    reqFormat = req.text.replace('\\n', '').replace('\\r', '').replace('\\t', '').replace('\\"', '"')
    soup = BeautifulSoup(reqFormat)
    stepName = []
    allObj = {}
    for step in soup.ul.find_all('li'):
        stepName.append(step.a.string)
    for index, detail in enumerate(soup.find_all("div", "easytab_area")):
        strTmp = ''
        for str in detail.strings:
            strTmp = strTmp + str + '\n'
        strTmpArr = strTmp.strip('\n').split('\n')
        skillObj = {}
        isKey = True
        keyTmp = ''
        for arr in strTmpArr:
            if len(arr.strip()) == 0:
                isKey = True
            else:
                if isKey:
                    keyTmp = arr
                    isKey = False
                else:
                    if re.search('^BOSS\d', str) or re.search('^途中', str):
                        isKey = False
                        keyTmp = arr
                    else:
                        if skillObj.has_key(keyTmp):
                            skillObj[keyTmp] = skillObj[keyTmp] + '\\n' + arr
                        else:
                            skillObj[keyTmp] = arr
        allObj[stepName[index]] = skillObj
    print json.dumps(allObj, sort_keys=False, indent=4).decode("unicode-escape")
getSkill('301')