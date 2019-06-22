This site package will draw a map and populate it with earthquake 
geodata from the United States Geological Survey.

Requirements:
You must obtain an API KEY from Mapbox and insert it into the 
text of the file "config.js" (in the "static/js" subfolder) 
or the map tiles will not render.  

A browser with Javascript enabled and compliant with Javascript
ES7 is required, along with an internet connection.  

Required file organization (this should be the way the files 
are configured in the repository, so you can clone directly)
the web page is "quake_map.html" 
Within the same folder as the web page, a "static" folder, with 
sub-folders "css" (containing "style.css") and "js" containing
"config.js" and "logic.js" is expected by the script.  

Note that without the correct "style.css" file the map may not be
displayed at all.

Design:
The map uses circles with a color and radius that depend on magnitude.
Within a fixed set of size bounds (3 - 40 pixels), the area of the
circle is proportional to the energy released in the earthquake.  The
circle size does not depend on the map scale, so the circles are clickable
at any zoom level.  Clicking the circles will activate a pop-up showing
the time, place description, and magnitude of the earthquake.  The 
earthquake data is for all quakes of magnitude > 1.0 (with some
smaller ones as well) within the past 30 days.  The USGS data is updated
once per minute.

