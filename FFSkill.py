#-*-encoding:utf-8 -*-
import requests
import urllib
from bs4 import BeautifulSoup

session = requests.Session()

def getSkill(id):
    url = 'https://api.ffxiv.cn/ajax/Articles/Index/' + urllib.quote(id)
    req = session.get(url)
    soup = BeautifulSoup(req.text)
    stepName = []
    for step in soup.ul.find_all('li'):
        stepName.append(step.a.string)
    for detail in soup.find_all("div"):
        print '===='
        print detail
        for div in detail.div:
            print div.string






getSkill('301')
