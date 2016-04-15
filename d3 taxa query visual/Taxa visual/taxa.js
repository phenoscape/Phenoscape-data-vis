var counts = [];

var data = {
	'amphibia': 644,
	'Reptiliomorpha': 352,
	'Densignathus': 1,
	'Westlothiana': 1,
	'Whatcheeriidae': 4,
	'Elginerpeton': 1
};


drawGraph(data);
//request.open('GET', url);

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
var csv = new Promise(function(resolve, reject) {
	d3.csv("VTO.csv", function(data) {
		resolve(data);
	});
});

//gets url from VTO.csv file
function get_url(nameOfTaxa, callback) {
	//find VTO of taxa
	return csv.then(function(data) {
		for (var i = 0; i < data.length; i++) {
			var termP = data[i].Parent_label;
			if (termP.toUpperCase() == nameOfTaxa.toUpperCase()) {
				var aurl = data[i].ParentTermIRI;
				//console.log(aurl);
				callback(aurl);
			}
			var term = data[i].Term_label;
			if (term.toUpperCase() == nameOfTaxa.toUpperCase()) {
				var aurl = data[i].TermIRI;
				//console.log(aurl);
				//console.log(typeof(aurl));
				callback(aurl);
			}
			//j=j+1;
		}
		return aurl;
	})
}

/*//function gets all of the urls of the taxa within the rank of a specific super-taxon. Parameter VTO is the url of the super taxon.
//returns array of all the taxa
function getTaxaInRank(VTO, callback) {
	var allTaxainRank = [];
	var taxaUrl = 'http://kb.phenoscape.org/api/taxon/with_rank?rank=http://purl.obolibrary.org/obo/TAXRANK_0000003&in_taxon=' + VTO
	console.log("TaxaUrl: " + taxaUrl);
	$.getJSON(taxaUrl, function(json) {
		taxa = json.results[1]['@id']; //how to get json element?!
		if (json.results[1] !== undefined && taxa !== undefined) {
			for (var i = 0; i < json.results.length; i++) {
				taxa = json.results[i]['@id'];
				allTaxainRank.push(taxa)
					//console.log('Taxa url rank: ', taxa);
			}
		}
		callback(allTaxainRank);
	});

}
*/
//replacement function for getTaxaInRank using classification
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
/**
var taxaBaseNames = ['Amniota', 'Tetrapoda', 'Hominoidea', 'Carnivora'];
var taxaData = [];
//test the functions
for (var i = 0; i < taxaBaseNames.length; i++) {
	get_url(taxaBaseNames[i], function(url) {
		// get array of all the taxa in the super-taxa
		getTaxaInRank(url, function(subTaxa) {
			console.log(subTaxa);
		});
		get_total(url, function(total) {
			//store total count into array
			taxaData[taxaBaseNames[i]] = total;
			console.log(total);
		})
	}); //UNDEFINED

}
**/

//parameter: data is an associative array
function getMax(data) {
	//TODO
	var max = 0;
	for (var key in data) {
		if (data[key] > max) {
			max = data[key];
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

//Parameters: names-array of anatomy names
// totals: array of total counts
function populateData(names, totals) {
	var data = [];
	for (var i = 0; i < names.length; i++) {
		data[names[i]] = totals[i];
	}
	return data;
}


//to update graph every time
function drawGraph(data) {
	//TODO
	var margin = {
			top: 70,
			right: 20,
			bottom: 30,
			left: 60
		},
		width = 960 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

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
			return d.key + "<br/>" + "Annontated taxa count: " + d.value;
		})

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.call(tip);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("taxaCount");

	svg.selectAll(".bar")
		.data(d3.entries(data))
		.enter().append("rect")
		.attr("class", "bar")
		.attr("x", function(d) {
			return x(d.key);
		})
		.attr("width", x.rangeBand())
		.attr("y", function(d) {
			return y(d.value);
		})
		.attr("height", function(d) {
			return height - y(d.value);
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide)

	//update to get sub anatomies based on click
	.on('click', function(d, i) {
		//get new data
		//get descendants
		tip.hide()
		d3.selectAll("svg").remove();
		d3.selectAll("tip").remove();
		/**
		get_uberon(d.key, function(uberon){
		  getChild(uberon, function(d){
		    for (var i in d){
		      console.log("Desc: "+i);
		      get_total(getUberon(d[i]),function(total){
		        getName(d[i],function(name){
		          data[name]=total;
		          console.log(name+":"+total);
		          
		        })
		      });
		    }**/

		console.log("Clicked");
		var promise = new Promise(function(resolve, reject) {
			var data = [];
			console.log(d.key);
			get_url(d.key, function(VTOurl) { //get the VTO url from the taxa clicked
				console.log(VTOurl);
				getTaxaInRank(VTOurl, function(d) {
					//console.log(d);
					for (var i in d) { //iterate through array of subtaxa
						//console.log(i);
						//console.log("d!" + d);
						//console.log("subtaxa: " + i);
						get_total(d[i], function(i, total) {
							getName(d[i], function(name) {
								data[name] = total;
								//console.log(name + ": " + total);
								//console.log("data length: " + data.length);
								//console.log("d length: " + d.length);
								if (Object.keys(data).length == d.length) {
									resolve(data);
								}
							})
						}.bind(null, i));
					}
				})
			});
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
	//});
}