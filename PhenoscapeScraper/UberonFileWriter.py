'''
Created on Feb 24, 2016

@author: lucy
'''
#Get uberon numbers
'''
text=open('uberons2.txt','w')
for x in range(12295,9999999):
    text.write(str(x).zfill(7)+'\n')
    print str(x).zfill(7)
'''

# parse through uberonNums text file and split every 7th character
uberonNumsParsed=open('uberonNumsParsed.txt','w')
text=open('uberonNums.txt','r')
numsText=text.read()
r=range(len(numsText))
n=7
for x in [numsText[i:i+n] for i in range(0, len(numsText), n)]:
    uberonNumsParsed.write(str(x)+'\n')
    