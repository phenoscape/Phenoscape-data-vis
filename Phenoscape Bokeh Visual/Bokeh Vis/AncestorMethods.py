'''
Created on Mar 1, 2016

@author: lucy
'''

import json
from urllib2 import urlopen
import requests

# Method gets everything the uberon is a superclass of
# string and textfile name as parameters
def superClassOf(uberon,ancestors):
    ancestor='http://kb.phenoscape.org/api/term/classification?iri=http://purl.obolibrary.org/obo/UBERON_'+uberon
    anc=json.loads(urlopen(ancestor).read())
    ancestorFile=open(ancestors,'w')
    ancestorFile.write(str(anc['superClassOf'][0]['label'])+'\n')
    print anc['superClassOf'][0]['label']
    return anc['superClassOf'][0]['label']

def subClassOf(uberon,ancestors):
    ancestor='http://kb.phenoscape.org/api/term/classification?iri=http://purl.obolibrary.org/obo/UBERON_'+uberon
    anc=json.loads(urlopen(ancestor).read())
    ancestorFile=open(ancestors,'w')
    ancestorFile.write(str(anc['subClassOf'][0]['label'])+'\n')
    print anc['subClassOf'][0]['label']
    return anc['subClassOf'][0]['label']
    
# Get all taxa with a given taxonomic rank within given superclass
def getTaxaInRank(VTO): #VTO is the purl url 
    allTaxainRank=[]
    taxaUrl='http://kb.phenoscape.org/api/taxon/with_rank?rank=http://purl.obolibrary.org/obo/TAXRANK_0000003&in_taxon='+VTO
    taxa=json.loads(urlopen(taxaUrl).read())
    #returns urls of new taxa
    for each in taxa['results']:
        allTaxainRank.append(each['@id'])
    return allTaxainRank
#superClassOf('0000033','stuff.txt')
#subClassOf('0000033','morestuff.txt')
print getTaxaInRank('http://purl.obolibrary.org/obo/VTO_0008067')
