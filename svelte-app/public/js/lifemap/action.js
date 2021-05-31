/*
	Functions to get parameters from url and do what must be done
*/

//VARIABLES
var ServerAddress="";

function onLoad() {

	//Get url parameters
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	//language -> define address of basemap. english by default
	const lang = urlParams.get('lang')
	ServerAddress = lang=="fr" ? "lifemap-fr.univ-lyon1.fr" : "lifemap.univ-lyon1.fr"
	setmaplayer('http://'+ServerAddress+'/retina_tiles/{z}/{x}/{y}.png');

	//get taxid(s) (if any) 
	const tids = urlParams.get('tid')
	console.log(tids)
	taxids = tids.split(",")

	//get zoom option. If true (the default) zoom to the taxids (if any)
	const zoom = urlParams.get('zoom') == "false" ? false : true;
	//get markers options. If true, (the default, markers are displayed
	const marks = urlParams.get('markers') == "false" ? false : true;
	//get tree option. If true (the default) the sub-tree with all taxa is display
	const tree = urlParams.get('tree') == "false" ? false : true;

	if (tids) DisplayTaxids(taxids, zoom, marks, tree);


}