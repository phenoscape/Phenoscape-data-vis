var request= new XMLHttpRequest();
var uberon=["0000033","0000032"];
var aname;
for (var i=0; i<uberon.length; i++){
	var url="http://kb.phenoscape.org/api/term?iri=http:%2F%2Fpurl.obolibrary.org%2Fobo%2FUBERON_"+uberon[i];
}
request.open('GET',url)
var names=[];

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    console.log('Status:', this.status);
    console.log('Headers:', this.getAllResponseHeaders());
    console.log('Body:', this.responseText);
    console.log("Label: ", this.label);
  }
};

// works!

$.getJSON(url, function(json){
	aname=json.label;
	names.push(name);
	alert(name);
	console.log('Anatomy: ', name);
});


request.send();