'''
Created on Feb 21, 2016
Get data from Phenoscape Knowledgebase and write to text files
@author: lucy Zhang
'''
from urllib2 import urlopen
import urllib2
import json
#import openpyxl

newtext=open('uberons.txt','r')
#uberonTot=open('uberonTot2.txt','w') # phenotype total count
#uberonNames=open('uberonNames2.txt','w') # names
#uberonNums=open('uberonNums2.txt','w') # uberon number
uberonPres=open('uberonPres_1.txt','w') #starts at 0010254 uberon

uberonFile=newtext.read().splitlines()
#print json.loads(urlopen('http://kb.phenoscape.org/api/term?iri=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_0000033').read())
#phenoData = openpyxl.load_workbook('phenoData.xlsx')

for uberon in uberonFile:
    print uberon
    try:
        phenoTotal=('http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'
        +uberon+'%3E&total=true')
        name='http://kb.phenoscape.org/api/term?iri=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'+uberon
        presence='http://kb.phenoscape.org/api/entity/presence?entity=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'+uberon+'&total=true'
        if ('total' in urlopen(phenoTotal).read() and 'label' in urlopen(name).read()):
            #num = json.loads(urlopen(phenoTotal).read())
            #response_name = json.loads(urlopen(name).read())
            pres=json.loads(urlopen(presence).read())
            # write data to files
            #uberonTot.write(str(num['total'])+'\n')
            #uberonNames.write(str(response_name['label'])+'\n')
            #uberonNums.write(str(uberon)+'\n')
            #print response_name['label']
            uberonPres.write(str(pres['total'])+'\n')
            print pres['total']
            if str(uberon)=='0032584':
                break
    except urllib2.HTTPError,e:
        print 'not this site'