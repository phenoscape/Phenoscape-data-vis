'''
Created on Mar 11, 2016

@author: lucy
'''
from collections import OrderedDict
from bokeh.charts import Bar, output_file, show

# (dict, OrderedDict, lists, arrays and DataFrames are valid inputs)
xyvalues = OrderedDict()
xyvalues['python']=[-2, 5]
xyvalues['pypy']=[12, 40]
xyvalues['jython']=[22, 30]

cat = ['1st', '2nd']

bar = Bar(xyvalues, cat, title="Stacked bars",
        xlabel="category", ylabel="language")

output_file("stacked_bar.html")
show(bar)