var uberon;

function getName(purlURL){
  var url='http://kb.phenoscape.org/api/term?iri=http://purl.obolibrary.org/obo/UBERON_'+purlURL
  $.getJSON(url, function(json) {
        console.log(json.label);
        return json.label;
      });
}

function getUberon(purlUrl){
  console.log("Uberon: " +purlUrl.substr(purlUrl.length-7));
  uberon=purlUrl.substr(purlUrl.length-7);
  return uberon;
}

//console.log("Here:"+getName("http://purl.obolibrary.org/obo/UBERON_0011618"));
//getUberon("http://purl.obolibrary.org/obo/UBERON_0011618");

var name=getName("0011618");
console.log("Name: "+name);
getUberon("http://purl.obolibrary.org/obo/UBERON_0011618");
console.log(getUberon("http://purl.obolibrary.org/obo/UBERON_0011618"));