'''
Created on Mar 1, 2016

@author: lucy
'''

import json
from urllib2 import urlopen

# string and textfile name as parameters
def getSubsumed(uberon,ancestors):
    ancestor='http://kb.phenoscape.org/api/term/classification?iri=http://purl.obolibrary.org/obo/UBERON_'+uberon
    anc=json.loads(urlopen(ancestor).read())
    ancestorFile=open(ancestors,'w')
    ancestorFile.write(str(anc['superClassOf'])+'\n')
    print anc['superClassOf']
    
getSubsumed('0000033','stuff.txt')
    