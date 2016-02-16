'''
Counting number of words used in all of Duke's statements issued about the lacrosse scandal
Created on Feb 11, 2016
@author: lucy Zhang
'''

wordFreq={}

# Get word frequencies
# Parameter: all of the text   
def getFrequency(words):
    for word in words:
        if word in wordFreq.keys():
            wordFreq[word]=wordFreq[word]+1
        else:
            wordFreq[word]=1;
    return wordFreq

text=open('DukeStatementsAllText.txt')
allText=text.read().replace(',','').replace('(','').replace('.','')
textArray=allText.split()
getFrequency(allText.split())
print wordFreq

# Write data to text file
wordFrequency=open('LacrosseWordFrequencyWords.txt','w')
for key in wordFreq.keys():
    wordFrequency.write(key+'\n')
    
numFrequency=open('LacrosseWordFrequencyNums.txt','w')
for key in wordFreq.keys():
    numFrequency.write(str(wordFreq.get(key))+'\n')




    