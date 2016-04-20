//base case data
var data = {
	'Amphibia': [644, 'http://purl.obolibrary.org/obo/VTO_0001466'],
	'Reptiliomorpha': [352, 'http://purl.obolibrary.org/obo/VTO_9000177'],
	'Densignathus': [1, 'http://purl.obolibrary.org/obo/VTO_9022020'],
	'Westlothiana': [1, 'http://purl.obolibrary.org/obo/VTO_9031046'],
	'Whatcheeriidae': [4, 'http://purl.obolibrary.org/obo/VTO_9031049'],
	'Elginerpeton': [1, 'http://purl.obolibrary.org/obo/VTO_9032382']
};

var phenoBlue = d3.rgb(66, 139, 202);

var margin = {
		top: 70,
		right: 20,
		bottom: 80,
		left: 60
	},
	width = 960 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

//call the function
drawGraph(data);

//function that gets total annotated taxa count
function get_total(url, callback) {
	var urlBase = 'http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=';
	var url = urlBase + url;
	$.getJSON(url, function(json) {
		var count = json.total;
		callback(count);
	});
}

//function for getTaxaInRank using classification
//@parameter VTO is the url 
function getTaxaInRank(VTO, callback) {
	var allTaxa = [];
	var urlBase = 'http://kb.phenoscape.org/api/term/classification?iri=' + VTO
	$.getJSON(urlBase, function(json) {
		for (var i = 0; i < json.superClassOf.length; i++) {
			var child = json.superClassOf[i]['@id'];
			allTaxa.push(child);
		}
		callback(allTaxa);
	});
}

//get name of taxa using the VTO URL
function getName(VTOurl, callback) {
	var url = 'http://kb.phenoscape.org/api/term?iri=' + VTOurl
	$.getJSON(url, function(json) {
		callback(json.label);
	});
}

//@data is an object
function getMax(data) {
	var max = 0;
	for (var key in data) {
		if (data[key][0] > max) {
			max = data[key][0];
		}
	}
	return max;

}

//to update graph every time
function drawGraph(data) {

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1)
		.domain(d3.entries(data).map(function(d) {
			return d.key
		}));

	var y = d3.scale.linear()
		.domain([0, getMax(data)])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(10);

	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(d) {
			return d.key + "<br/>" + "Annontated taxa count: " + d3.values(d)[1][0];
		})

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	//x axis label
	svg.append("text")
		.attr("class", "x label")
		.attr("text-anchor", "end")
		.attr("x", width / 2)
		.attr("y", height + 30)
		//.text("Taxa")

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis); //Creates x axis label

	svg.selectAll("text")
		.call(wrap, x.rangeBand())
		.attr("y", 0)
		.attr("x", 50)
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");

	var yLine = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -40)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Annotated Taxa Count");

	var bars = svg.selectAll(".bar")
		.data(d3.entries(data))
		.enter().append("rect")
		.attr("fill", phenoBlue)
		.attr("class", "bar")
		.attr("x", function(d) {
			return x(d.key);
		})
		.attr("width", x.rangeBand())
		.attr("y", function(d) {
			return y(d3.values(d)[1][0]);
		})
		.attr("height", function(d) {
			return height - y(d3.values(d)[1][0]);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)

	//update to get sub anatomies based on click
	.on('click', function(d, i) {
		var promise = new Promise(function(resolve, reject) {
			var dataset = [];
			VTOurl = d3.values(d)[1][1];
			getTaxaInRank(VTOurl, function(d) {
				for (var i in d) { //iterate through array of subtaxa
					get_total(d[i], function(i, total) {
						getName(d[i], function(name) {
							dataset[name] = [total, d[i]];
							if (Object.keys(dataset).length == d.length) {
								resolve(dataset); //new data to graph
							}
						})
					}.bind(null, i));
				}
			})
			setTimeout(reject.bind(null, data), 10000);
		});

		promise.then(function(result) {
			removeEverything(tip);
			console.log(result);
			drawGraph(result);
		}, function(err) {
			alert("No more descending possible")
			removeEverything(tip);
			drawGraph(data);
			console.log("No more descending possible", err);
		})

	});

}

/**
Removes all elements of graph
@tip: tooltip object
**/
function removeEverything(tip) {
	tip.hide()
	d3.select("svg").remove();
	d3.selectAll("tip").remove();
}

function wrap(text, width) {
	text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

var insertLinebreaks = function (t, d, width) {
    var el = d3.select(t);
    var p = d3.select(t.parentNode);
    p.append("foreignObject")
        .attr('x', -width/2)
        .attr("width", width)
        .attr("height", 200)
      .append("xhtml:p")
        .attr('style','word-wrap: break-word; text-align:center;')
        .html(d);    

    el.remove();

};