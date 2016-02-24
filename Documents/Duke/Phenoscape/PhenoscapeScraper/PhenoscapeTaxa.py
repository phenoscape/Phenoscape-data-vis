'''
Created on Feb 21, 2016

@author: lucy
'''
from urllib2 import urlopen
import urllib2
import json

#Get uberon numbers
#text=open('uberons.txt','w')
#for x in range(1,9999999):
#    text.write(str(x).zfill(7)+'\n')
#    print str(x).zfill(7)

newtext=open('uberons.txt','r')
uberonFile=newtext.read().splitlines()
print json.loads(urlopen('http://kb.phenoscape.org/api/term?iri=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_0000033').read())

for uberon in uberonFile:
    try:
        phenoTotal=('http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'
        +uberon+'%3E&total=true')
        name='http://kb.phenoscape.org/api/term?iri=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'+uberon
        if ('total' in urlopen(phenoTotal).read() and 'label' in urlopen(name).read()):
            num = json.loads(urlopen(phenoTotal).read())
            response_name = json.loads(urlopen(name).read())
            print response_name['label']
            print num['total']
    except urllib2.HTTPError,e:
        print 'not this site'