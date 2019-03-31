/*==== Set data_global from input file ====*/
var data_global;

//stores the output of a parsed JSON file
const parsed = jsonText => JSON.parse(jsonText);
//creates a new file reader object
const fr = new FileReader();

function handleFileSelect (evt) {
  //function is called when input file is Selected
  //calls FileReader object with file
  fr.readAsText(evt.target.files[0])
};

fr.onload = e => {
  //fuction runs when file is fully loaded
  //parses file then makes a call to writeInfo to display info on page
  data_global = parsed(e.target.result);
};

//event listener for file input
document.getElementById('inputfile').addEventListener('change', handleFileSelect, false);
/*== Set data_global from input file ==*/

function pogotoolstomymaps() { 
    file_string = convertFile(data_global);
    var output_filename;
    
    if ( (document.getElementById("language").value) == "English" ) {
        output_filename = "portals.kml";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        output_filename = "portales.kml";
    }
    
    writeFile(file_string, output_filename);
}

function convertFile(data) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portals</name>\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portales</name>\n";
    }

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');
        file_string += "      <Placemark>\n        <name>" + data['gyms'][data_element]['name'];

        if ( (document.getElementById("language").value) == "English" ) {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Gim</value>";
        }
        else if ( (document.getElementById("language").value) == "Spanish" ) {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Gimnasio</value>";
        }
        file_string += "\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q="
                    + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng']
                    + "</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            "
                    + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['lat']
                    + "\n          </coordinates>\n        </Point>\n      </Placemark>\n";
    });

    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        file_string += "      <Placemark>\n        <name>" + data['pokestops'][data_element]['name'];
        if ( (document.getElementById("language").value) == "English" ) {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Pokestop</value>";
        }
        else if ( (document.getElementById("language").value) == "Spanish" ) {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Poképarada</value>";
        }
        file_string += "\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q="
                    + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng']
                    + "</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            "
                    + data['pokestops'][data_element]['lng'] + "," + data['pokestops'][data_element]['lat']
                    + "\n          </coordinates>\n        </Point>\n      </Placemark>\n";
    });

    file_string += "  </Document>\n</kml>";

    return file_string;
}

function writeFile(file_string, output_filename) {
    let file_data = "data:text/json;charset=utf-8,";
    file_data += file_string;
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename);
    document.body.appendChild(link); // Required for FF
    link.click();
}

