function get_total(uberon, callback){
	var urlBase='http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_'
        +uberon+'%3E&total=true';
	$.getJSON(urlBase, function(json){
		var count=json.total;
		//console.log('Taxa total: ', count);
		//console.log(typeof(count));
		callback(count);
	});
}

//gets uberon number from VTO.csv file
function get_uberon(anatomy,callback){
	//find VTO of taxa
	d3.csv("UBERON.csv", function(data){
		for (var i=0; i<data.length; i++){
			var term=data[i].Term_label; 			
			if (term==anatomy){
				var uberon=data[i].UberonNum;
				console.log(uberon);
				callback(uberon);
			} 
			//j=j+1;
		}
		for (var i=0; i<data.length; i++){
			var termP=data[i].Parent_term_label;
			if (termP==anatomy){
				var uberon=data[i].UberonNumParent;
				//console.log(aurl);
				callback(uberon);
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
var uberonBaseNames=['integumental system', 'dermatocranium', 'neurocranium', 'jaw region','ventral hyoid arch skeleton','post-cranial axial skeletal system','forelimb skeleton','hindlimb skeleton','fin skeleton','pectoral girdle skeleton','pelvic girdle skeleton']; //no 0005886
var uberonData=[];
//test the functions
for (var i=0; i<uberonBaseNames.length; i++){
	get_uberon(uberonBaseNames[i],function(url) {
		// get array of all the taxa in the super-taxa
		//getTaxaInRank(url,function(subTaxa){
		//	console.log(subTaxa);
		//});
		get_total(url,function(total){
			//store total count into array
			uberonData[uberonBaseNames[i]]=total;
			console.log(total);
		}
			)
	}); //UNDEFINED

}