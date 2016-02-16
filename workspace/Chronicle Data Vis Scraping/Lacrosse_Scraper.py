'''
Created on Feb 11, 2016

@author: lucy Zhang
'''
import requests, bs4, pyperclip

res=requests.get('http://today.duke.edu/showcase/mmedia/features/lacrosse_incident/announce_archive.html')
res.raise_for_status

soup=bs4.BeautifulSoup(res.text,'html.parser')

# Get all news links from site
#lacrosseLinks=open('lacrosseDukeStatements.txt','w')
for i in soup.findAll('a',href=True):
    #lacrosseLinks.write(i.get('href')+'\n')  
    print i.get('href')
    
text=''

lines = [line.rstrip('\n') for line in open('lacrosseDukeStatements.txt')]
# Open each link 
for article in lines:
    #print article
    print article
    res=requests.get(article)
    res.raise_for_status
    soup=bs4.BeautifulSoup(res.text,'html.parser')
    for word in soup.find_all('div', attrs={'id': 'article'}):
        text=word.text+text

pyperclip.copy(text) # all of the text from all articles
