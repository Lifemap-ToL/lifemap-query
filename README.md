# Lifemap query
## Description
This version of Lifemap will allow users to integrate an annotated map to their website easily. 

The url can integrate parameters that will specify what to see on the map and in what way. Here, you can test using a minimal <b>svelte App</b>, so you can `cd svelte-app` and follow instruction to start a local server and install dependencies using <b>npm</b>.

## Options available
Default options are displayed in square brackets []:
* `debug=[false]true` Should options display for debug?
* `tid=x,y,z` NCBI taxonomy id (taxid) of taxa to highlight. If more than one, should be separated by commas.
* `lang=[en]fr` Language of the base map
* `marks=[true]false` Should markers be displayed at the taxids locations? 
* `tree=[true]false` Should tree with taxa be displayed?
* `zoom=[true]false` Should the view be set to fit all taxid locations ? 
* `searchbar=[true]false` should the searchbar be displayed?
* `uifontsize=[11]integer` modify font size in the searchbar menu
* `clickableMarkers=[true]false` Should markers show a pop-up with some information about taxon with a link towards <em>Wikipedia</em> taxon's page?
* `zoomButton=[true]false` Should zoom buttons from <em>Leaflet</em> be displayed?

## Example
Add to your `index.html` the following code:
```
<iframe src="lifemap.html?lang=fr&tid=9606,2,4646&zoom=false&markers=true&tree=true&searchbar=false&uifontsize=11&clickableMarkers=true" width="80%" height="60%"></iframe>
```



