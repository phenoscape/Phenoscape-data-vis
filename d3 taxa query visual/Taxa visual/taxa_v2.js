//base case data
var data = {
	'Amphibia': [644,'http://purl.obolibrary.org/obo/VTO_0001466'],
	'Reptiliomorpha': [352,'http://purl.obolibrary.org/obo/VTO_9000177'],
	'Densignathus': [1,'http://purl.obolibrary.org/obo/VTO_9022020'],
	'Westlothiana': [1,'http://purl.obolibrary.org/obo/VTO_9031046'],
	'Whatcheeriidae': [4,'http://purl.obolibrary.org/obo/VTO_9031049'],
	'Elginerpeton': [1,'http://purl.obolibrary.org/obo/VTO_9032382']
};

var margin = {
		top: 70,
		right: 20,
		bottom: 30,
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
		//console.log('Taxa total: ', count);
		//console.log(typeof(count));
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
			//if (child.length > 5 && child.length < 100) {
			allTaxa.push(child);
			console.log('Child: ' + child);
			//}
		}

		callback(allTaxa);
	});
}

//get name of taxa using the VTO URL
function getName(VTOurl, callback) {
	var url = 'http://kb.phenoscape.org/api/term?iri=' + VTOurl
	$.getJSON(url, function(json) {
		//console.log(json.label);
		callback(json.label);
	});
}


//parameter: data is an associative array
function getMax(data) {
	//TODO
	var max = 0;
	for (var key in data) {
		if (data[key][0] > max) {
			max = data[key][0];
		}
	}
	return max;

}

//function populates names and totals array
//Parameter: descArray is array of descendants
function populateArrays(descArray, callback) {
	var names = [];
	var totals = [];
	for (var i = 0; i < descArray.length; i++) {
		getName(descArray[i], function(name) {
			names[i] = name;
		});
		get_total(getUberon(descArray[i]), function(total) {
			totals[i] = total;
		});
	}
	callback(names, totals);
}

//Parameters: names-array of anatomy names, array of taxa-in-rank urls
// totals: array of total counts
function populateData(names, totals, allTaxa) {
	var data = [];
	for (var i = 0; i < names.length; i++) {
		data[names[i]] = [totals[i], allTaxa[i]];
	}
	return data;
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

	svg.append("line")
		.attr("x1", margin.left)
		.attr("y1", height + margin.top)
		.attr("x2", width + margin.left)
		.attr("y2", height + margin.top)
		.attr("stroke-width", 50)
		.attr("stroke", "black");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		//.call(xAxis); //Creates x axis label

	var yLine = svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Annotated Taxa Count");

	var bars = svg.selectAll(".bar")
		.data(d3.entries(data))
		.enter().append("rect")
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
		//get new data
		//get descendants
		tip.hide()
		yLine.remove();
		svg.selectAll(".bar").remove();
		d3.select("svg").remove();
		d3.selectAll("tip").remove();

		var promise = new Promise(function(resolve, reject) {
			var data = [];
			VTOurl=d3.values(d)[1][1]; //HERE
				getTaxaInRank(VTOurl, function(d) {
					//console.log(d);
					for (var i in d) { //iterate through array of subtaxa
						get_total(d[i], function(i, total) {
							getName(d[i], function(name) {
								data[name] = [total,d[i]];
								if (Object.keys(data).length == d.length) {
									resolve(data);
								}
							})
						}.bind(null, i));
					}
				})
			//});
			setTimeout(reject.bind(null, data), 10000);
			//
		});

		promise.then(function(result) {
			console.log(result);
			drawGraph(result);
		}, function(err) {
			drawGraph(err);
			console.log("Failed!", err);
		})

	});
	
	/*svg.transition()
		.attr('height',function(d){
			return y(d);
		})
		.attr('y',function(d){
			return height - y(d);
		})
		.delay(function(d,i){
			return i*20;
		})
		.duration(1000)
		.ease("elastic")*/
}