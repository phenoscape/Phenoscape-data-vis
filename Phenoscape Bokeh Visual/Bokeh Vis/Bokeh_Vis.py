'''
Created on Mar 11, 2016

@author: lucy
'''
from Taxa_Counts import count
from bokeh.charts import Bar, output_file, show
from bokeh.models import HoverTool
from bokeh.plotting import output_file
#from bokeh.io import output_notebook, show # output notebool loads BokehJS
#from bokeh.plotting import figure, output_file, show

output_file("hover_callback.html")

# parameter: countDict, a dictionary of taxaCount and taxa name
def create_barChart(countDict):
    hover = HoverTool(
        tooltips=[
                  ("Count", "@height"),
                  ("Label","@label")]  )
    p=Bar(countDict, values='taxaCount',label='label', tools=[hover], title="Number of annotated taxa", xlabel="taxa", ylabel="count")
    output_file("bokeh_bar.html") # save file to html
    show(p)

create_barChart(count)




