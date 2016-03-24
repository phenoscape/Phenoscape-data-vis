var counts=[];
//request.open('GET', url);

//function that gets total
function get_total(url){
	var urlBase='http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=';
	var url=urlBase+url;
	$.getJSON(url, function(json){
		var count=json.total;
		console.log('Taxa total: ', count);
		//console.log(typeof(count));
		return count;
	});
}

//gets url from VTO.csv file
function get_url(nameOfTaxa){
	//find VTO count of taxa
	d3.csv("VTO.csv", function(data){
		//var blah=data[0].Term_label;
		//console.log(blah);
		//var j=0;
		for (var i=0; i<data.length; i++){
			var term=data[i].Term_label; //NOT DEFINED FOR SOME REASON			
			if (term==nameOfTaxa){
				var aurl=data[i].TermIRI;
				console.log(aurl);
				console.log(typeof(aurl));
				return aurl;
			} 
			//j=j+1;
		}
		for (var i=0; i<data.length; i++){
			var termP=data[i].Parent_label;
			if (termP==nameOfTaxa){
				var aurl=data[i].ParentTermIRI;
				console.log(aurl);
				return aurl;
			}
		}
	}); return;
}

//function gets all of the urls of the taxa within the rank of a specific super-taxon. Parameter VTO is of the super taxon.
function getTaxaInRank(VTO){
	var allTaxainRank=[];
	var taxaUrl='http://kb.phenoscape.org/api/taxon/with_rank?rank=http://purl.obolibrary.org/obo/TAXRANK_0000003&in_taxon='+VTO
	$.getJSON(taxaUrl, function(json){
		taxa=json.results[1]['@id']; //how to get json element?!
		for (var i=0; i<json.results.length; i++){
			taxa=json.results[i]['@id'];
			allTaxainRank.push(taxa)
			//console.log('Taxa url rank: ', taxa);
		}
		return allTaxainRank;
	});
}

//test the functions
getTaxaInRank('http://purl.obolibrary.org/obo/VTO_0033666');
get_total(get_url('Amniota'));
console.log('Url: '+String(get_url('Amniota')));
