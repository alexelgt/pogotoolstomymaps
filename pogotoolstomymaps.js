/*==== Set data_global_json from input file ====*/
var data_global_json;
var data_global_geofences;
var output_filename;
var temp_output_filename;

var language_mode = "English";
var exported_file_mode = "kml";

//creates a new file reader object
const fr_inputfile = new FileReader();
const fr_geofencesfile = new FileReader();

function handleFileJSON (evt) {
    fr_inputfile.readAsText(evt.target.files[0]);

    temp_output_filename = evt.target.files[0].name.replace('.json', '');
    output_filename = temp_output_filename;

    fr_inputfile.onload = e => {
        data_global_json = JSON.parse(e.target.result);
    };
};

function handleFilegeofences (evt) {
    fr_geofencesfile.readAsText(evt.target.files[0]);

    output_filename = temp_output_filename + "_" + evt.target.files[0].name.replace('.json', '');

    fr_geofencesfile.onload = e => {
        data_global_geofences = JSON.parse(e.target.result);
    };
};

//event listener for file input
document.getElementById('inputfile').addEventListener('change', handleFileJSON, false);
document.getElementById('geofencesfile').addEventListener('change', handleFilegeofences, false);
/*== Set data_global_json from input file ==*/

/*==== Function called when the button is pressed ====*/
function pogotoolstomymaps() {

    correctEncodingInNames(data_global_json);
    
    //convert and write data into the output file
    if ( (exported_file_mode) == "kml" ) {
        convertFile_kml(data_global_json, data_global_geofences, output_filename);
    }
    else if ( (exported_file_mode) == "csv" ) {
        convertFile_csv(data_global_json, data_global_geofences, output_filename);
    }
    else if ( (exported_file_mode) == "csv (Detective Pikachu)" ) {
        convertFile_csv_detectivepikachu(data_global_json, data_global_geofences, output_filename);
    }

}
/*== Function called when the button is pressed ==*/

function convertFile_kml(data, data_geofences, output_filename) {
    var file_string;

    if ( (language_mode) == "English" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portals</name>\n";
    }
    else if ( (language_mode) == "Spanish" ) {
        file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portales</name>\n";
    }

    Object.keys(data['pokestops']).forEach(function (data_element) {

        if (data_geofences == undefined) {
            writeStringPokestops(data_element);
        }
        else {
            var ingeofence_pokestop_kml = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lng'], data['pokestops'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lat'], data['pokestops'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) ) ) {
                    ingeofence_pokestop_kml = true;
                }
            });
            if (ingeofence_pokestop_kml == true) {
                writeStringPokestops(data_element);
            }
        }
    });

    Object.keys(data['gyms']).forEach(function (data_element) {

        if (data_geofences == undefined) {
            writeStringGyms(data_element);
        }
        else {
            var ingeofence_gym_kml = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) ) ) {
                    ingeofence_gym_kml = true;
                }
            });
            if (ingeofence_gym_kml == true) {
                writeStringGyms(data_element);
            }
        }
    });

    file_string += "  </Document>\n</kml>";

    downloadOutputFile(file_string, "kml", output_filename);

    function writeStringPokestops(data_element) {
        file_string += "      <Placemark>\n        <name>" + data['pokestops'][data_element]['name'];
        if ((language_mode) == "English") {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Pokestop</value>";
        }
        else if ((language_mode) == "Spanish") {
            file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Poképarada</value>";
        }
        file_string += "\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q="
            + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng']
            + "</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            "
            + data['pokestops'][data_element]['lng'] + "," + data['pokestops'][data_element]['lat']
            + "\n          </coordinates>\n        </Point>\n      </Placemark>\n";
    }

    function writeStringGyms(data_element) {
        file_string += "      <Placemark>\n        <name>" + data['gyms'][data_element]['name'];
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>EX Gym</value>";
            }
            else if ((language_mode) == "Spanish") {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Gimnasio EX</value>";
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += "</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Gym</value>";
            }
            else if ((language_mode) == "Spanish") {
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

function convertFile_csv(data, data_geofences, output_filename) {
    var file_string;

    if ( (language_mode) == "English" ) {
        file_string = "Name,Pokémon GO status,Latitude,Longitude\n";
    }
    else if ( (language_mode) == "Spanish" ) {
        file_string = "Nombre,Estado Pokémon GO,Latitude,Longitude\n";
    }

    Object.keys(data['pokestops']).forEach(function (data_element) {

        if (data_geofences == undefined) {
            writeStringPokestops(data_element);
        }
        else {
            var ingeofence_pokestop_csv = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lng'], data['pokestops'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['pokestops'][data_element]['lat'], data['pokestops'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_pokestop_csv = true;
                }
            });
            if (ingeofence_pokestop_csv == true) {
                writeStringPokestops(data_element);
            }
        }
    });

    Object.keys(data['gyms']).forEach(function (data_element) {

        if (data_geofences == undefined) {
            writeStringGyms(data_element);
        }
        else {
            var ingeofence_gym_csv = false;
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    ingeofence_gym_csv = true;
                }
            });
            if (ingeofence_gym_csv == true) {
                writeStringGyms(data_element);
            }
        }
    });
    
    downloadOutputFile(file_string, "csv", output_filename);

    function writeStringPokestops(data_element) {
        if ((language_mode) == "English") {
            file_string += data['pokestops'][data_element]['name'] + ",Pokestop," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
        }
        else if ((language_mode) == "Spanish") {
            file_string += data['pokestops'][data_element]['name'] + ",Poképarada," + data['pokestops'][data_element]['lat'] + "," + data['pokestops'][data_element]['lng'] + "\n";
        }
    }

    function writeStringGyms(data_element) {
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + ",EX Gym," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + ",Gimnasio EX," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + ",Gym," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + ",Gimnasio," + data['gyms'][data_element]['lat'] + "," + data['gyms'][data_element]['lng'] + "\n";
            }
        }
    }
}

function convertFile_csv_detectivepikachu(data, data_geofences, output_filename) {
    var file_string;

    if ( (language_mode) == "English" ) {
        file_string = "Name	Latitude	Longitude	Keywords	Tags	Zones\n";
    }
    else if ( (language_mode) == "Spanish" ) {
        file_string = "Nombre	Latitud	Longitud	Palabras clave	Etiquetas	Zonas\n";
    }

    Object.keys(data['gyms']).forEach(function (data_element) {

        if (data_geofences == undefined) {
            writeStringGyms(data_element);
        }
        else {
            var zone = "";
            Object.keys(data_geofences).forEach(function (data_geofences_element) {
                if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                    zone += data_geofences_element + ","
                }
            });
            if (zone != "") {
                writeStringGymsGeofences(data_element, zone);
            }
        }

    });
    
    downloadOutputFile(file_string, "csv", output_filename);

    function writeStringGyms(data_element) {
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n";
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n";
            }
        }
    }

    function writeStringGymsGeofences(data_element, zone) {
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n";
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n";
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n";
            }
        }
    }
}

function setMode(mode,pressed_div) {

    var parentClass = pressed_div.parentNode.className;

    if (parentClass != "") {
        parentClass = "." + parentClass.replace(/ /g, '.');
    }

    /*==== Remove class "selected" from all elements ====*/
    var elems = document.querySelectorAll("#button_structure" + parentClass + " > div");

    [].forEach.call(elems, function(el) {
        el.classList.remove("selected");
    });
    /*== Remove class "selected" from all elements ==*/

    /*=== Add class "selected" to element who triggered the function ===*/
    pressed_div.classList.add("selected");

    changeModeVar(mode,parentClass);

    function changeModeVar(mode,parentClass) {
        if (parentClass == ".language") {
            language_mode = mode;
        }
        else if (parentClass == ".exported_file") {
            exported_file_mode = mode;
        }
    }
}

function downloadOutputFile(string, format, output_filename) {
    let file_data = "data:text/"+ format + ";charset=utf-8," + string;
    file_data = file_data.replace(/[\r]+/g, '').trim();
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename + "." + format);
    document.body.appendChild(link);
    link.click();
}

function correctEncodingInNames(data) {
    Object.keys(data['pokestops']).forEach(function (data_element) {

        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace(/â€œ/g, '“').replace(/â€/g, '”').replace(/Âª/g, 'ª').replace(/Â¡/g, '¡').replace(/&/g, 'and').replace(/Ã±/g, 'ñ').replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í').replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã/g, 'Á');
        
        data['pokestops'][data_element]['name'] = data['pokestops'][data_element]['name'].replace('èœ¥èœ´èˆ‡é’è›™', '蜥蜴與青蛙');
    });

    Object.keys(data['gyms']).forEach(function (data_element) {
        
        data['gyms'][data_element]['name'] = data['gyms'][data_element]['name'].replace(/â€œ/g, '“').replace(/â€/g, '”').replace(/Âª/g, 'ª').replace(/Â¡/g, '¡').replace(/&/g, 'and').replace(/Ã±/g, 'ñ').replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í').replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã/g, 'Á');
    });
}