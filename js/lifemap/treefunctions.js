/*
	All the functions for computing and displaying stuff on the basemap
*/


/*
	this DisplayTaxids() function is the main one. It will display the taxids required,
	and add markers (if marks=true), draw the tree (if tree=true), zoom to the taxids (if zoom=true), etc. 
*/

var DisplayTaxids = function(taxids, zoom, marks=false, tree=false) {

	taxid = "(" + taxids.map(el => el.trim()).join(" ") + ")"
	console.log(taxid)
	markers = new L.FeatureGroup();
	var url = 'http://'+ServerAddress+'/solr/taxo/select?q=taxid:'+taxid+'&wt=json';
	$.ajax({
		url : url,
		success : function(data) {
			var docs = JSON.stringify(data.response.docs);
			var ok = JSON.parse(docs);
			console.log(ok)
			$.each(ok, function( index, value ) {
				console.log(index)
				var latlong = new L.LatLng(ok[index].lat[0], ok[index].lon[0]);
				var marker = L.marker(latlong,{icon: pin1, opacity:1});
				markers.addLayer(marker);
			});
			//take options into account
			if (zoom) {
				if (ok.length==1) {
					console.log(ok)
					map.setView(ok[0].coordinates, ok[0].zoom)
				}
				else {
					map.fitBounds(markers.getBounds());
				}
			}
			if (marks) {
				map.addLayer(markers)
			}
			if (tree) {
				//TODO
			}
		},
		dataType : 'jsonp',
		jsonp : 'json.wrf'
	});	    
};

