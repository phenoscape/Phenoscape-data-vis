console.log("URL decoded: "+encodeURI('http://purl.org/phenoscape/subclassof?value=%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_0002416%3E+and+%28%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FBFO_0000050%3E+some+%0A++++%28%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FBSPO_0000084%3E+and+%28%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FBFO_0000050%3E+some+%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_0008195%3E%29%29%29'))

function get_uberon(anatomy, callback) {
    //find VTO of taxa
    d3.csv("UBERON.csv", function(data) {
        for (var i = 0; i < data.length; i++) {
            var term = data[i].Term_label;
            if (term == anatomy) {
                var uberon = data[i].UberonNum;
                //console.log(uberon);
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

//Get uberon number using the url
function getUberon(purlUrl){
  uberon=purlUrl.substr(purlUrl.length-7);
  return uberon;
}

//function gets all of the purl urls of the taxa within the rank of a specific super-taxon. 
//parameter uberon: uberon number
function getDescendants(uberon, callback) {
    var descendants = [];
    var descUrl = 'http://kb.phenoscape.org/api/term/all_descendants?iri=http://purl.obolibrary.org/obo/UBERON_' + uberon;
    $.getJSON(descUrl, function(json) {
        for (var i = 0; i < json.results.length; i++) {
            uberon = json.results[i]['@id'];
            descendants.push(uberon)
                console.log('Descendant uberon: '+ uberon);
        }
        callback(descendants);
    });
}

//get name of anatomy using the purl URL
function getName(purlURL,callback){
  var url='http://kb.phenoscape.org/api/term?iri='+purlURL
  $.getJSON(url, function(json) {
        //console.log(json.label);
        callback(json.label);
      });
}

//parameter: data is an associative array
function getMax(data){
  //TODO
  var max=0;
  for (var key in data){
    if (data[key]>max){
      max=data[key];
    }
  }
  return max;

}

var names=[];
  var totals=[];
//function populates names and totals array
//Parameter: descArray is array of descendants
function populateArrays(descArray, callback){

  for (var i=0; i<descArray.length; i++){
    getName(descArray[i], function(name){
      names[i]=name;
    });
    get_total(getUberon(descArray[i]), function(total){
      totals[i]=total;
    });
  }
  callback(names,totals);
}

//Parameters: names-array of anatomy names
// totals: array of total counts
function populateData(names,totals){
  var data=[];
  for (var i=0; i<names.length; i++){
    data[names[i]]=totals[i];
  }
  return data;
}

function get_total(uberon, callback) {
    var urlBase = 'http://kb.phenoscape.org/api/taxon/with_phenotype?entity=%3Chttp:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_' + uberon + '%3E&total=true';
    $.getJSON(urlBase, function(json) {
        var count = json.total;
        //console.log('Taxa total: ', count);
        //console.log(typeof(count));
        callback(count);
    });
}

//gets children
//Parameter: uberon number
//returns urls of the children
function getChild(uberon,callback){
	children=[];
	var urlBase='http://kb.phenoscape.org/api/term/classification?iri=http://purl.obolibrary.org/obo/UBERON_'+uberon
	$.getJSON(urlBase, function(json) {
		for (var i= 0; i<json.superClassOf.length; i++){
			var child = json.superClassOf[i]['@id'];
			children.push(child);
			console.log('Child: '+child);
		}
        
        callback(count);
    });
}
/**
var name=getName("0011618");
console.log("Name: "+name);
getUberon("http://purl.obolibrary.org/obo/UBERON_0011618");
console.log(getUberon("http://purl.obolibrary.org/obo/UBERON_0011618"));
var data={'integumental system': 277, 'neurocranium': 1653, 'hindlimb skeleton': 0, 'jaw region': 0, 'hyoid arch skeleton': 528, 'forelimb skeleton': 0, 'fin skeleton': 313, 'dermatocranium': 574, 'pectoral girdle skeleton': 1108, 'pelvic girdle skeleton': 426, 'ventral hyoid arch skeleton': 0, 'post-cranial axial skeletal system': 0};
**/
//get_uberon(name, function(uberonNum){
	getChild('0011618',function(d){
		console.log(d);
	})
          getDescendants('0011618', function(descArray){
          	console.log("descArray: "+descArray);
            populateArrays(descArray, function(names,totals){
              data=populateData(names,totals);
              console.log("names:"+names);
              d3.selectAll('svg').remove();
              d3.selectAll('tip').remove();
              //drawGraph(data);
              alert("redraw time");

            });

        });

     // });