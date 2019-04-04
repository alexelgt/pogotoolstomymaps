/*==== Set data_global from input file ====*/
var data_global;
var output_filename;

//creates a new file reader object
const fr = new FileReader();

function handleFileSelect (evt) {
    //function is called when input file is Selected
    //calls FileReader object with file
    fr.readAsText(evt.target.files[0]);

    output_filename = evt.target.files[0].name.replace('.json', '');
};

fr.onload = e => {
    //fuction runs when file is fully loaded.
    data_global = JSON.parse(e.target.result);
};

//event listener for file input
document.getElementById('inputfile').addEventListener('change', handleFileSelect, false);
/*== Set data_global from input file ==*/

/*==== Function called when the button is pressed ====*/
function pogotoolstomymaps() { 

    //convert and write data into the output file
    if ( (document.getElementById("exportformat").value) == "kml" ) {
        convertFile_kml(data_global, output_filename);
    }
    else if ( (document.getElementById("exportformat").value) == "csv" ) {
        convertFile_csv(data_global, output_filename);
    }
    else if ( (document.getElementById("exportformat").value) == "csv (Detective Pikachu)" ) {
        convertFile_csv_detectivepikachu(data_global, output_filename);
    }

}
/*== Function called when the button is pressed ==*/

function convertFile_kml(data, output_filename) {
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

        if ( data['gyms'][data_element]['isEx'] == true) {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>EX Gym</value>";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Gimnasio EX</value>";
            }
        }
        else {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Gym</value>";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Gimnasio</value>";
            }
        }
        
        file_string += "\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q="
                    + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng']
                    + "</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            "
                    + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['lat']
                    + "\n          </coordinates>\n        </Point>\n      </Placemark>\n";
    });

    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('èœ¥èœ´èˆ‡é’è›™', '蜥蜴與青蛙');

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

    let file_data = "data:text/json;charset=utf-8,";
    file_data += file_string;
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename + ".kml");
    document.body.appendChild(link);
    link.click();
}

function convertFile_csv(data, output_filename) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "Name,Pokémon GO status,Latitude,Longitude\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "Nombre,Estado Pokémon GO,Latitude,Longitude\n";
    }

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        if ( data['gyms'][data_element]['isEx'] == true) {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += data['gyms'][data_element]['name'] + ",EX Gym," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += data['gyms'][data_element]['name'] + ",Gimnasio EX," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
        }
        else {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += data['gyms'][data_element]['name'] + ",Gym," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += data['gyms'][data_element]['name'] + ",Gimnasio," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
        }
 
    });

    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('èœ¥èœ´èˆ‡é’è›™', '蜥蜴與青蛙');

        if ( (document.getElementById("language").value) == "English" ) {
            file_string += data['pokestops'][data_element]['name'] + ",Pokestop," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
        }
        else if ( (document.getElementById("language").value) == "Spanish" ) {
            file_string += data['pokestops'][data_element]['name'] + ",Poképarada," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
        }

    });
    
    let file_data = "data:text/csv;charset=utf-8,";
    file_data += file_string;
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename + ".csv");
    document.body.appendChild(link);
    link.click();
}

function convertFile_csv_detectivepikachu(data, output_filename) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "Name,Latitude,Longitude,Keywords,Tags,Zones\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "Nombre,Latitud,Longitud,Palabras clave,Etiquetas,Zonas\n";
    }

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        if ( data['gyms'][data_element]['isEx'] == true) {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += data['gyms'][data_element]['name'] + "," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['name'] + ",ex,\n";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += data['gyms'][data_element]['name'] + "," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['name'] + ",ex,\n";
            }
        }
        else {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += data['gyms'][data_element]['name'] + "," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['name'] + ",,\n";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += data['gyms'][data_element]['name'] + "," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "," + data['gyms'][data_element]['name'] + ",,\n";
            }
        }
 
    });
    
    let file_data = "data:text/csv;charset=utf-8,";
    file_data += file_string;
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename + ".csv");
    document.body.appendChild(link);
    link.click();
}
