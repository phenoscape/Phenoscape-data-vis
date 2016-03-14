var count;
var counts=[];
var request = new XMLHttpRequest();
var annotated_taxa_count='0034991';
var url='http://kb.phenoscape.org/api/taxon/annotated_taxa_count?in_taxon=http://purl.obolibrary.org/obo/VTO_'+annotated_taxa_count;
/**request.open('GET', url);

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
  }
};

request.send();
**/
// works!

$.getJSON(url, function(json){
	count=json.total;
	counts.push(count);
	alert(count);
	console.log('Taxa total: ', count);
});

