#-*-encoding:utf-8 -*-
import requests
from bs4 import BeautifulSoup
import urllib
import HTMLParser
import json
html_parser = HTMLParser.HTMLParser()
import os
import sys
import thread
import traceback
import time


session = requests.Session()

# 获取参数tid
c = 0
def getV(ship):
	global c
	while (c > 3):
		time.sleep(5)
		print('====waiting:===')
		print(ship)
	c = c + 1
	print("now threads:" + str(c))
	thread.start_new_thread(getVoice, (ship,))


def getVoice(ship):
	global c
	try:

		url = 'https://zh.moegirl.org/index.php?title=%E8%88%B0%E9%98%9FCollection:'+urllib.quote(ship)
		req = session.get(url)
		soup = BeautifulSoup(req.text,'html.parser')
		list = soup.find_all(name="div", attrs={"data-bind":True})
		print(list.__len__())
		if not os.path.isdir(ship):
			os.makedirs(ship)
		for l in list:
			datastr = l['data-bind']
			data = json.loads(datastr)
			component = data['component']
			params = component['params']
			playlist = params['playlist']
			for p in playlist:
				audiourl = p['audioFileUrl']
				fileName = p['navigationUrl']
				n = fileName.index(':')
				fn = fileName[n+1:]
				print(fn)
				path = ship.decode("utf8")+"/"+fn
				print(path)
				urllib.urlretrieve(audiourl, path)
	except Exception, e:
		print 'str(Exception):\t', str(Exception)
		print 'str(e):\t\t', str(e)
		print 'repr(e):\t', repr(e)
		print 'e.message:\t', e.message
		print 'traceback.print_exc():';
		traceback.print_exc()
		print 'traceback.format_exc():\n%s' % traceback.format_exc()
	c = c-1


def run():
	KanNames = ["金刚","比睿","榛名","雾岛","扶桑","山城","伊势","日向","长门","陆奥","大和","武藏","俾斯麦","利托里奥","罗马","衣阿华","厌战","甘古特","黎塞留","纳尔逊","赤城","加贺","苍龙","飞龙","翔鹤","瑞鹤","云龙","天城","葛城","大凤","齐柏林伯爵","天鹰","萨拉托加","无畏","皇家方舟","凤翔","龙骧","龙凤","大鲸","祥凤","瑞凤","飞鹰","隼鹰","千岁","千代田","铃谷","熊野","春日丸","神鹰","甘比尔湾","千岁","千代田","秋津洲","瑞穗","神威","特斯特长官","古鹰","加古","青叶","衣笠","妙高","那智","足柄","羽黑","高雄","爱宕","摩耶","鸟海","最上","三隈","铃谷","熊野","利根","筑摩","欧根亲王","扎拉","波拉","天龙","龙田","球磨","多摩","北上","大井","木曾","长良","五十铃","名取","由良","鬼怒","阿武隈","川内","神通","那珂","夕张","阿贺野","能代","矢矧","酒匂","大淀","哥特兰","香取","鹿岛","神风","朝风","春风","松风","旗风","睦月","如月","弥生","卯月","皋月","水无月","文月","长月","菊月","三日月","望月","吹雪","白雪","初雪","深雪","丛云","矶波","浦波","绫波","敷波","天雾","狭雾","胧","曙","涟","潮","晓","响","Верный","雷","电","初春","子日","若叶","初霜","白露","时雨","村雨","夕立","春雨","五月雨","海风","山风","江风","凉风","朝潮","大潮","满潮","荒潮","朝云","山云","霞","霰","阳炎","不知火","黑潮","亲潮","初风","雪风","天津风","时津风","浦风","矶风","滨风","谷风","野分","岚","萩风","舞风","秋云","夕云","卷云","风云","长波","高波","藤波","滨波","岸波","冲波","朝霜","早霜","清霜","岛风","秋月","照月","凉月","初月","Z1","Z3","西北风","西南风","杰维斯","塔什干","塞缪尔·B·罗伯茨","伊168","伊58","伊19","伊8","伊400","伊401","伊26","伊13","伊14","まるゆ","吕500","Luigi_Torelli","占守","国后","择捉","松轮","佐渡","对马","福江","日振","大东","秋津丸","明石","大鲸","龙凤","速吸","神威"]
	for ship in KanNames:
		getV(ship)

run()