/*
	Functions to get parameters from url and do what must be done
*/

//VARIABLES
var ServerAddress="";
var zoomButton;
function onLoad() {

	//Get url parameters
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	

	//language -> define address of basemap. english by default
	const lang = urlParams.get('lang')
	ServerAddress = lang=="en" ? "lifemap-fr.univ-lyon1.fr" : "lifemap.univ-lyon1.fr"
	
	setmaplayer('http://'+ServerAddress+'/retina_tiles/{z}/{x}/{y}.png');

	//get taxid(s) (if any) 
	const tids = urlParams.get('tid')
	taxids = tids.split(",")

	//get zoom option. If true (the default) zoom to the taxids (if any)
	const zoom = urlParams.get('zoom') == "false" ? false : true;

	//get markers options. If true, (the default, markers are displayed
	const marks = urlParams.get('markers') == "false" ? false : true;

	//get tree option. If true (the default) the sub-tree with all taxa is displayed
	const tree = urlParams.get('tree') == "false" ? false : true;

	//get searchbar option. If true (the default), the searchbar is displayed
	const searchbar = urlParams.get('searchbar') == "false" ? false : true;

	//get font size for the jquery autocomplete widget, default is 11px
	let uifontsize = urlParams.get('uifontsize');
	try { uifontsize = parseInt(uifontsize, 10);} catch (e) {uifontsize = null}

	//get click on markers option. If true (the default) when the marker is clicked, information about taxon are displayed
	const clickableMarkers = urlParams.get('clickableMarkers') == "false" ? false : true;

	//get zoom button option. If true (the default), it displays zoom buttons
	zoomButton = urlParams.get('zoomButton') == "false" ? false : true;

	//get debug option. If true (false is the default), it displays all options configuration
	const debug = urlParams.get('debug') == "true" ? true : false;

	if (tids) DisplayTaxids(taxids, zoom, marks, tree, clickableMarkers);
	DisplayInfo(lang, searchbar, uifontsize, clickableMarkers);

	// Please, add new params here for the debug mode
	let param = {"debug": debug, 
		"lang": lang,
		"tids": tids,
		"zoom": zoom,
		"marks": marks,
		"tree": tree,
		"searchbar": searchbar,
		"uifontsize": uifontsize,
		"clickableMarkers": clickableMarkers,
		"zoomButton": zoomButton
	};

	debugDiv = document.getElementById("debug-mode");
	if (debug) {
		for (const [key, value] of Object.entries(param)) {
			debugDiv.innerHTML += 
			`
			${key + ": " + value} <br>
			`
		};	
	} else {debugDiv.parentNode.removeChild(debugDiv);}
}