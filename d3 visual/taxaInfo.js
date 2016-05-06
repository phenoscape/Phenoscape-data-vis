var counts=[];
//request.open('GET', url);

//function that gets total
function get_total(url, callback){
	var urlBase='http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=';
	var url=urlBase+url;
	$.getJSON(url, function(json){
		var count=json.total;
		//console.log('Taxa total: ', count);
		//console.log(typeof(count));
		callback(count);
	});
}

//gets url from VTO.csv file
function get_url(nameOfTaxa,callback){
	//find VTO of taxa
	d3.csv("VTO.csv", function(data){
		for (var i=0; i<data.length; i++){
			var term=data[i].Term_label; 			
			if (term==nameOfTaxa){
				var aurl=data[i].TermIRI;
				//console.log(aurl);
				//console.log(typeof(aurl));
				callback(aurl);
			} 
			//j=j+1;
		}
		for (var i=0; i<data.length; i++){
			var termP=data[i].Parent_label;
			if (termP==nameOfTaxa){
				var aurl=data[i].ParentTermIRI;
				//console.log(aurl);
				callback(aurl);
			}
		}
	}); return;
}

//function gets all of the urls of the taxa within the rank of a specific super-taxon. Parameter VTO is of the super taxon.
function getTaxaInRank(VTO, callback){
	var allTaxainRank=[];
	var taxaUrl='http://kb.phenoscape.org/api/taxon/with_rank?rank=http://purl.obolibrary.org/obo/TAXRANK_0000003&in_taxon='+VTO
	$.getJSON(taxaUrl, function(json){
		taxa=json.results[1]['@id']; //how to get json element?!
		for (var i=0; i<json.results.length; i++){
			taxa=json.results[i]['@id'];
			allTaxainRank.push(taxa)
			//console.log('Taxa url rank: ', taxa);
		}
		callback(allTaxainRank);
	});
}
var taxaBaseNames=['Amniota', 'Tetrapoda', 'Hominoidea', 'Carnivora'];
var taxaData=[];
//test the functions
for (var i=0; i<taxaBaseNames.length; i++){
	get_url(taxaBaseNames[i],function(url) {
		// get array of all the taxa in the super-taxa
		getTaxaInRank(url,function(subTaxa){
			console.log(subTaxa);
		});
		get_total(url,function(total){
			//store total count into array
			taxaData[taxaBaseNames[i]]=total;
			console.log(total);
		}
			)
	}); //UNDEFINED

}

/**

console.log('Url: '+String(get_url('Amniota')));

// Graph 
var taxaBaseNames=['Amniota', 'Tetrapoda', 'Hominoidea', 'Carnivora'];
var taxaData=[];
var count;
var bardata=[];
var urls=[];
//var annotated_taxa_count='0034991';
var url='http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=http://purl.obolibrary.org/obo/VTO_';

//make array of VTO counts
for (var i=0; i<taxaBaseNames.length; i++){
	//bardata.push(get_total(get_url(taxaBaseNames[i]));
	var taxaCount=get_total(get_url(taxaBaseNames[i]));
	taxaData[taxaBaseNames[i]]=taxaCount;
	taxaUrls.push(get_url(taxaBaseNames[i]));
}
for (var i=1; i<10; i++){
    urls.push(url+'000000'+String(i));
}
//put in for loop, 
$.getJSON(urls[0], function(json){
    count=json.total; 
    bardata.push(parseInt(count));
    console.log('Taxa total: ', count);
    console.log("Here is the type: "+typeof(count));

console.log("Count: "+String(count));
bardata.push(50);
bardata.push(100);
console.log("Here: "+bardata[0]);
bardata.sort(function compareNumbers(a,b) {
    return a -b;
});

var margin = { top: 30, right: 30, bottom: 40, left:50 }

var height = 400 - margin.top - margin.bottom,
    width = 600 - margin.left - margin.right,
    barWidth = 50,
    barOffset = 5;

var tempColor;

var colors = d3.scale.linear()
.domain([0, bardata.length*.33, bardata.length*.66, bardata.length])
.range(['#B58929','#C61C6F', '#268BD2', '#85992C'])

var yScale = d3.scale.linear()
        .domain([0, d3.max(bardata)])
        .range([0, height]);

var xScale = d3.scale.ordinal()
        .domain(d3.range(0, bardata.length))
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
    .attr('transform', 'translate('+ margin.left +', '+ margin.top +')')
    .selectAll('rect').data(bardata)
    .enter().append('rect')
        .style('fill', function(d,i) {
            return colors(i);
        })
        .attr('width', xScale.rangeBand())
        .attr('x', function(d,i) {
            return xScale(i);
        })
        .attr('height', 0)
        .attr('y', height)

    .on('mouseover', function(d) {

        tooltip.transition()
            .style('opacity', .9)

        tooltip.html(d)
            .style('left', (d3.event.pageX - 35) + 'px')
            .style('top',  (d3.event.pageY - 30) + 'px')


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
    .domain([0, d3.max(bardata)])
    .range([height, 0])

var vAxis = d3.svg.axis()
    .scale(vGuideScale)
    .orient('left')
    .ticks(10)

var vGuide = d3.select('svg').append('g')
    vAxis(vGuide)
    vGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    vGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000"})
    vGuide.selectAll('line')
        .style({ stroke: "#000"})

var hAxis = d3.svg.axis()
    .scale(xScale)
    .orient('bottom')
    .tickValues(xScale.domain().filter(function(d, i) {
        return !(i % (bardata.length/5));
    }))

var hGuide = d3.select('svg').append('g')
    hAxis(hGuide)
    hGuide.attr('transform', 'translate(' + margin.left + ', ' + (height + margin.top) + ')')
    hGuide.selectAll('path')
        .style({ fill: 'none', stroke: "#000"})
    hGuide.selectAll('line')
        .style({ stroke: "#000"})
});

**/