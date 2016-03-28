function getName(purlURL){
  var url='http://kb.phenoscape.org/api/term?iri='+purlURL
  $.getJSON(url, function(json) {
        console.log(json.label);
        return json.label;
      });
}

function getUberon(purlURL){
  console.log(purlUrl.substr(purlURL.length-7));
}

//console.log("Here:"+getName("http://purl.obolibrary.org/obo/UBERON_0011618"));
//getUberon("http://purl.obolibrary.org/obo/UBERON_0011618");

var name=getName("http://purl.obolibrary.org/obo/UBERON_0011618");
console.log("Name: "+name);