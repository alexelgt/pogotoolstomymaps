/*==== Set data_global_json from input file ====*/
var data_global_json;
var data_global_geofences;
var output_filename;
var temp_output_filename;

//creates a new file reader object
const fr = new FileReader();
const fr2 = new FileReader();

function handleFileJSON (evt) {
    //function is called when input file is Selected
    //calls FileReader object with file
    fr.readAsText(evt.target.files[0]);

    temp_output_filename = evt.target.files[0].name.replace('.json', '');
    output_filename = temp_output_filename;

    fr.onload = e => {
        //fuction runs when file is fully loaded.
        data_global_json = JSON.parse(e.target.result);
    };
};

function handleFilegeofences (evt) {
    //function is called when input file is Selected
    //calls FileReader object with file
    fr2.readAsText(evt.target.files[0]);

    output_filename = temp_output_filename + "_" + evt.target.files[0].name.replace('.json', '');

    

    fr2.onload = e => {
        //fuction runs when file is fully loaded.
        data_global_geofences = JSON.parse(e.target.result);
    };
};

//event listener for file input
document.getElementById('inputfile').addEventListener('change', handleFileJSON, false);
document.getElementById('geofencesfile').addEventListener('change', handleFilegeofences, false);
/*== Set data_global_json from input file ==*/

/*==== Function called when the button is pressed ====*/
function pogotoolstomymaps() {

    //convert and write data into the output file
    if ( (document.getElementById("exportformat").value) == "kml" ) {
        convertFile_kml(data_global_json, data_global_geofences, output_filename);
    }
    else if ( (document.getElementById("exportformat").value) == "csv" ) {
        convertFile_csv(data_global_json, data_global_geofences, output_filename);
    }
    else if ( (document.getElementById("exportformat").value) == "csv (Detective Pikachu)" ) {
        convertFile_csv_detectivepikachu(data_global_json, data_global_geofences, output_filename);
    }

}
/*== Function called when the button is pressed ==*/

function convertFile_kml(data, data_geofences, output_filename) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portals</name>\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portales</name>\n";
    }

    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('èœ¥èœ´èˆ‡é’è›™', '蜥蜴與青蛙');

        if (data_geofences == undefined) {
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
        }
        else {
            var ingeofence_pokestop_kml = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lng'], data['pokestops'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lat'], data['pokestops'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_pokestop_kml = true;
                }
            });
            if (ingeofence_pokestop_kml == true) {
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
            }
        }
    });

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        if (data_geofences == undefined) {
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
        }
        else {
            var ingeofence_gym_kml = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_gym_kml = true;
                }
            });
            if (ingeofence_gym_kml == true) {
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
            }
        }
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

function convertFile_csv(data, data_geofences, output_filename) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "Name,Pokémon GO status,Latitude,Longitude\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "Nombre,Estado Pokémon GO,Latitude,Longitude\n";
    }

    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('èœ¥èœ´èˆ‡é’è›™', '蜥蜴與青蛙');

        if (data_geofences == undefined) {
            if ( (document.getElementById("language").value) == "English" ) {
                file_string += data['pokestops'][data_element]['name'] + ",Pokestop," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
            }
            else if ( (document.getElementById("language").value) == "Spanish" ) {
                file_string += data['pokestops'][data_element]['name'] + ",Poképarada," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
            }
        }
        else {
            var ingeofence_pokestop_csv = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lng'], data['pokestops'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lat'], data['pokestops'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_pokestop_csv = true;
                }
            });
            if (ingeofence_pokestop_csv == true) {
                if ( (document.getElementById("language").value) == "English" ) {
                    file_string += data['pokestops'][data_element]['name'] + ",Pokestop," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
                }
                else if ( (document.getElementById("language").value) == "Spanish" ) {
                    file_string += data['pokestops'][data_element]['name'] + ",Poképarada," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
                }
            }
        }

    });

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        if (data_geofences == undefined) {
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
        }
        else {
            var ingeofence_gym_csv = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_gym_csv = true;
                }
            });
            if (ingeofence_gym_csv == true) {
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

function convertFile_csv_detectivepikachu(data, data_geofences, output_filename) {
    var file_string;

    if ( (document.getElementById("language").value) == "English" ) {
        file_string = "Name	Latitude	Longitude	Keywords	Tags	Zones\n";
    }
    else if ( (document.getElementById("language").value) == "Spanish" ) {
        file_string = "Nombre	Latitud	Longitud	Palabras clave	Etiquetas	Zonas\n";
    }

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace('â€œ', '“').replace('â€', '”').replace('Âª', 'ª').replace('Â¡', '¡').replace('&', 'and').replace('Ã±', 'ñ').replace('Ã¡', 'á').replace('Ã©', 'é').replace('Ã­', 'í').replace('Ã³', 'ó').replace('Ãº', 'ú').replace('Ã', 'Á');

        if (data_geofences == undefined) {
            if ( data['gyms'][data_element]['isEx'] == true) {
                if ( (document.getElementById("language").value) == "English" ) {
                    file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n";
                }
                else if ( (document.getElementById("language").value) == "Spanish" ) {
                    file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n";
                }
            }
            else {
                if ( (document.getElementById("language").value) == "English" ) {
                    file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n";
                }
                else if ( (document.getElementById("language").value) == "Spanish" ) {
                    file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n";
                }
            }
        }
        else {
            var zone = "";
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    zone += data_geofences_element + ","
                }
            });
            if (zone != "") {
                if ( data['gyms'][data_element]['isEx'] == true) {
                    if ( (document.getElementById("language").value) == "English" ) {
                        file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n";
                    }
                    else if ( (document.getElementById("language").value) == "Spanish" ) {
                        file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n";
                    }
                }
                else {
                    if ( (document.getElementById("language").value) == "English" ) {
                        file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n";
                    }
                    else if ( (document.getElementById("language").value) == "Spanish" ) {
                        file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n";
                    }
                }
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

