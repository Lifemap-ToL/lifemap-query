/*
searchbar: if true it display the searchbar
uifontsize: when the searchbar is displayed it allows to modify font size of suggestions 
*/

var mainFunction = function(lang, searchbar=false, uifontsize) {
	if (uifontsize!=null) {
		var s = document.styleSheets[1];
		adjustCSSRules(".ui-autocomplete.ui-widget", "font-size: "+uifontsize+"px", s);
	}
	if (searchbar) {
		searchDiv = document.getElementById("rightblock");

		searchDiv.innerHTML += `
		<!--RESIZE BUTTON-->
		<div class=" text-right"><i id="reducerightblock" class="glyphicon glyphicon-minus-sign" style="padding:5px; color:#b4c3e0; cursor: pointer;"></i>
		</div>	
		<!--IMAGE ON TOP-->
		<div id="logo" class="img.center">
			<img class="center" src = "img/LMicon1.png" width="50%">
		</div>
		<!--SIMPLE SEARCH DIV-->
		<div id="mainsearch" class="container-fluid" style="margin: 10px 10px 0px 10px; padding:0px; z-index:10;">
			<div class="btn-group" style="width:100%;">
				<span id="route" class="fa fa-level-up" title="Search routes between taxa or clades"></span>
				<input id="searchinput" type="search" class="form-control" style="width:100%; height:40px;" placeholder="Search species, clade, ...">
				
			</div>
		</div>
		`

		jQuery.ui.autocomplete.prototype._resizeMenu = function () {
			var ul = this.menu.element;
			ul.outerWidth(this.element.outerWidth());
		};
		let SPfocus;
		$(function() {
			var str;
			var URL_PREFIX = lang=="fr" ? "http://lifemap-fr.univ-lyon1.fr/solr/taxo/suggesthandler?suggest.q=" : "http://lifemap.univ-lyon1.fr/solr/taxo/suggesthandler?suggest.q=";
			var URL_PREFIX_FINAL = lang=="fr" ? "http://lifemap-fr.univ-lyon1.fr/solr/taxo/select?q=taxid:" : "http://lifemap.univ-lyon1.fr/solr/taxo/select?q=taxid:";
			var URL_SUFFIX = "&wt=json";

			$("#searchinput").autocomplete({
				source : function(request, response) {
					var URL = URL_PREFIX + $("#searchinput").val() + URL_SUFFIX;
					$.ajax({
						url : URL,
						success : function(data) {
							var step1=data.suggest.mySuggester[$("#searchinput").val()];
							try {var docs = JSON.stringify(step1.suggestions);} catch(e) {};
							var jsonData = JSON.parse(docs);
							jsonData.sort(function(a,b) {
								a1 = a.term.split("|")[0].replace(/<b>/g,"").replace(/<\/b>/g,"");
								b1 = b.term.split("|")[0].replace(/<b>/g,"").replace(/<\/b>/g,"");
								return(a1.length-b1.length);
							});
							response($.map(jsonData, function(value, key) {
								str = value.term;
								str=str.split("|");
								var issp = str[2];
								issp = issp.replace(/<b>/g,"");
								issp = issp.replace(/<\/b>/g,"");
								issp = issp.replace(" ","");
								issp = issp.replace(/[\x00-\x2f\x3a-\x40]/g,"");
								var taxid = str[3];
								taxid = taxid.replace(/<b>/g,"");
								taxid = taxid.replace(/<\/b>/g,"");
								taxid = taxid.replace(" ","");
								taxid = taxid.replace(/[\x00-\x2f\x3a-\x40]/g,"");
								var spname = str[0];
								spname=spname.replace(/<b>/g,"");
								spname=spname.replace(/<\/b>/g,"");
								var commonname = str[1];
								commonname=commonname.replace(/<b>/g,"");
								commonname=commonname.replace(/<\/b>/g,"");
								var renderval = spname + commonname;

								if ((issp==="species")||(issp==="subspecies")) {
									labOK = "<div style='padding: 20px;'><span class=\"scinameItalic\">" + str[0] + "</span><span class=\"commonname\">" + str[1] + "</span><br><span class=\"rank\" >" + str[2] + "</span></div>";			
								}
								else {
									labOK = "<div style='padding: 20px;'><span class=\"sciname\">" + str[0] + "</span><span class=\"commonname\">" + str[1] + "</span><br><span class=\"rank\">" + str[2] + "</span></div>";
								};
								return {
									label : labOK,
									value : renderval,
									taxidfinal: taxid,
									spname: spname,
									commonname: commonname,
									rank:issp	
								}
							}));
						},
						dataType : 'jsonp',
						jsonp : 'json.wrf'
					});
				},

				minLength : '1',
				autoFocus: true,
				html: true,
				focus: function() {
						// prevent value inserted on focus
						return false;
				},
				select: function(e, ui) {
					var taxidok = ui.item.taxidfinal;
					$("#searchinput").blur();						
					var URL = URL_PREFIX_FINAL + taxidok + URL_SUFFIX;

					$.ajax({
						url : URL,
						success : function(data) {
							var docs = JSON.stringify(data.response.docs);
							var jsonData = JSON.parse(docs);
							map.setView(jsonData[0].coordinates, jsonData[0].zoom[0]-8);
							latlong = new L.LatLng(jsonData[0].lat[0], jsonData[0].lon[0]);
							SPfocus = L.marker(latlong,{icon: pin1, opacity:1});
							// TODO
							// SPfocus.on("click", function() {
							// 	markofun(taxidok, spnameok,commonnameok,rankok);
							// })
							SPfocus.addTo(map);
						},
						dataType : 'jsonp',
						jsonp : 'json.wrf'
					});	    
				}
			})
		});

	}
}


function adjustCSSRules(selector, props, sheets){
    // get stylesheet(s)
    if (!sheets) sheets = [...document.styleSheets];
    else if (sheets.sup){    // sheets is a string
        let absoluteURL = new URL(sheets, document.baseURI).href;
        sheets = [...document.styleSheets].filter(i => i.href == absoluteURL);
        }
    else sheets = [sheets];  // sheets is a stylesheet

    // CSS (& HTML) reduce spaces in selector to one.
    selector = selector.replace(/\s+/g, ' ');
    const findRule = s => [...s.cssRules].reverse().find(i => i.selectorText == selector)
    let rule = sheets.map(findRule).filter(i=>i).pop()

    const propsArr = props.sup
        ? props.split(/\s*;\s*/).map(i => i.split(/\s*:\s*/)) // from string
        : Object.entries(props);                              // from Object

    if (rule) for (let [prop, val] of propsArr){
        // rule.style[prop] = val; is against the spec, and does not support !important.
        rule.style.setProperty(prop, ...val.split(/ *!(?=important)/));
        }
    else {
        sheet = sheets.pop();
        if (!props.sup) props = propsArr.reduce((str, [k, v]) => `${str}; ${k}: ${v}`, '');
        sheet.insertRule(`${selector} { ${props} }`, sheet.cssRules.length);
        }
    }