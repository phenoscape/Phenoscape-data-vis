function get_total(uberon, callback) {
	var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_' + uberon + '%3E&total=true';
	$.getJSON(urlBase, function(json) {
		var count = json.total;
		//console.log('Taxa total: ', count);
		//console.log(typeof(count));
		callback(count);
	});
}

//gets uberon number from VTO.csv file
function get_uberon(anatomy, callback) {
	//find VTO of taxa
	d3.csv("UBERON.csv", function(data) {
		for (var i = 0; i < data.length; i++) {
			var term = data[i].Term_label;
			if (term == anatomy) {
				var uberon = data[i].UberonNum;
				console.log(uberon);
				callback(uberon);
			}
			//j=j+1;
		}
		for (var i = 0; i < data.length; i++) {
			var termP = data[i].Parent_term_label;
			if (termP == anatomy) {
				var uberon = data[i].UberonNumParent;
				//console.log(aurl);
				callback(uberon);
			}
		}
	});
	return;
}

//function gets all of the urls of the taxa within the rank of a specific super-taxon. Parameter VTO is of the super taxon.
function getDescendants(uberon, callback) {
	var descendants = [];
	var descUrl = 'http://kb.phenoscape.org/api/term/all_descendants?iri=http://purl.obolibrary.org/obo/UBERON_' + uberon;
	$.getJSON(descUrl, function(json) {
		for (var i = 0; i < json.results.length; i++) {
			uberon = json.results[i]['@id'];
			descendants.push(uberon)
				//console.log('Taxa url rank: ', taxa);
		}
		callback(descendants);
	});
}
// base cases to graph
var uberonBaseNames = ['integumental system', 'dermatocranium', 'neurocranium', 'jaw region', 'ventral hyoid arch skeleton', 'post-cranial axial skeletal system', 'forelimb skeleton', 'hindlimb skeleton', 'fin skeleton', 'pectoral girdle skeleton', 'pelvic girdle skeleton']; //no 0005886
var uberonData = []; //associative array
var uberonTot = [];
var uberonLabel = [];

for (var i = 0; i < uberonBaseNames.length; i++) {
	console.log(uberonBaseNames[i]);
	get_uberon(uberonBaseNames[i], function(url) {
		// get array of all the taxa in the super-taxa
		getDescendants(url, function(uberon) {
			console.log(uberon);
		});
		get_total(url, function(total) {
			//store total count into array
			uberonData[uberonBaseNames[i]] = total;
			uberonTot.push(total);
			uberonLabel.push(uberonBaseNames[i]);
			console.log('Total:' + total);
			if (uberonTot.length==uberonBaseNames.length){
				drawBarChart(uberonTot);
			}
			console.log('length'+uberonBaseNames.length);
			//graphing part
			//drawBarChart(uberonLabel);
		});

	})

}

//function that draws the bar chart
//parameter dataSet is an associative array
function drawBarChart(uberonTot) {
	var margin = {
				top: 30,
				right: 30,
				bottom: 40,
				left: 50
			}

			var height = 400 - margin.top - margin.bottom,
				width = 600 - margin.left - margin.right,
				barWidth = 50,
				barOffset = 5;

			var tempColor;

			var colors = d3.scale.linear()
				.domain([0, uberonTot.length * .33, uberonTot.length * .66, uberonTot.length])
				.range(['#B58929', '#C61C6F', '#268BD2', '#85992C'])

			var yScale = d3.scale.linear()
				.domain([0, d3.max(uberonTot)])
				.range([0, height]);

			var xScale = d3.scale.ordinal()
				.domain(d3.range(0, uberonTot.length))
				.rangeBands([0, width], 0.2)

			var tooltip = d3.select('body').append('div')
				.style('position', 'absolute')
				.style('padding', '0 10px')
				.style('background', 'white')
				.style('opacity', 0)

			var myChart = d3.select('#chart').append('svg')
				.style('background', '#E7E0CB')
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
				.selectAll('rect').data(uberonTot)
				.enter().append('rect')
				.style('fill', function(d, i) {
					return colors(i);
				})
				.attr('width', xScale.rangeBand())
				.attr('x', function(d, i) {
					return xScale(i);
				})
				.attr('height', 0)
				.attr('y', height)

			.on('mouseover', function(d) {

				tooltip.transition()
					.style('opacity', .9)

				tooltip.html(d)
					.style('left', (d3.event.pageX - 35) + 'px')
					.style('top', (d3.event.pageY - 30) + 'px')

				tempColor = this.style.fill;
				d3.select(this)
					.style('opacity', .5)
					.style('fill', 'yellow')
			})

			.on('mouseout', function(d) {
				d3.select(this)
					.style('opacity', 1)
					.style('fill', tempColor)
			})

			myChart.transition()
				.attr('height', function(d) {
					return yScale(d);
				})
				.attr('y', function(d) {
					return height - yScale(d);
				})
				.delay(function(d, i) {
					return i * 20;
				})
				.duration(1000)
				.ease('elastic')

			var vGuideScale = d3.scale.linear()
				.domain([0, d3.max(uberonTot)])
				.range([height, 0])

			var vAxis = d3.svg.axis()
				.scale(vGuideScale)
				.orient('left')
				.ticks(10)

			var vGuide = d3.select('svg').append('g')
			vAxis(vGuide)
			vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
			vGuide.selectAll('path')
				.style({
					fill: 'none',
					stroke: "#000"
				})
			vGuide.selectAll('line')
				.style({
					stroke: "#000"
				})

			var hAxis = d3.svg.axis()
				.scale(xScale)
				.orient('bottom')
				.tickValues(xScale.domain().filter(function(d, i) {
					return !(i % (uberonTot.length / 5));
				}))

			var hGuide = d3.select('svg').append('g')
			hAxis(hGuide)
			hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
			hGuide.selectAll('path')
				.style({
					fill: 'none',
					stroke: "#000"
				})
			hGuide.selectAll('line')
				.style({
					stroke: "#000"
				})
}