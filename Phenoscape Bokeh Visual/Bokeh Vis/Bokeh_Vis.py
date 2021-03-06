'''
Created on Mar 11, 2016

@author: lucy
'''
from Taxa_Counts import *
from bokeh.charts import Bar, output_file, show
from bokeh.models import HoverTool
from bokeh.plotting import output_file
from bokeh.io import push_notebook, output_notebook, push
#from bokeh.io import output_notebook, show # output notebool loads BokehJS
#from bokeh.plotting import figure, output_file, show

output_file("hover_callback.html")

# create dictionary of taxa names and taxa counts
count={}
labels=[]
taxaCount=[]
first_layer_taxa=['Amniota', 'Tetrapoda', 'Carnivora']
for taxa in first_layer_taxa:
    labels.append(taxa)
    taxaCount.append(get_taxa_count(taxa))

count['label']=labels
count['taxaCount']=taxaCount
print count
# parameter: countDict, a dictionary of taxaCount and taxa name
def create_barChart(countDict):
    hover = HoverTool(
        tooltips=[
                  ("Count", "@height"),
                  ("Label","@label")]  )
    p=Bar(countDict, values='taxaCount',label='label', tools=[hover], title="Number of annotated taxa", xlabel="taxa", ylabel="count")
    output_file("bokeh_bar.html") # save file to html
    #show(p)
    return p

taxaPlot=create_barChart(count)
show(taxaPlot)





