var language_strings = {
    "layer_name": {
        "Spanish": "Portales",
        "English": "Portals"
    },
    "data_name": {
        "Spanish": "Estado del portal",
        "English": "Portal Status"
    },
    "latitude": {
        "Spanish": "Latitud",
        "English": "Latitude"
    },
    "longitude": {
        "Spanish": "Longitud",
        "English": "Longitude"
    }
}

var portal_strings = {
    "gyms": {
        "Spanish": "Gimnasio",
        "English": "Gym"
    },
    "pokestops": {
        "Spanish": "Poképarada",
        "English": "Pokestop"
    },
    "inns": {
        "Spanish": "Taberna",
        "English": "Inn"
    },
    "fortresses": {
        "Spanish": "Fortaleza",
        "English": "Fortress"
    },
    "greenhouses": {
        "Spanish": "Invernadero",
        "English": "Greenhouse"
    }
}

var translate_colors = {
    "Pink": "Rosa",
    "Blue": "Azul",
    "Green": "Verde",
    "Brown": "Marrón",
    "Purple": "Morada",
    "White": "Blanca"
}

/*==== Set data_global_json from input file ====*/
var data_global_json
var data_global_geofences
var output_filename
var temp_output_filename

var language_mode = "English"
var exported_file_mode = "kml"

//creates a new file reader object
const fr_inputfile = new FileReader()
const fr_geofencesfile = new FileReader()

function handleFileJSON (evt) {
    fr_inputfile.readAsText(evt.target.files[0])

    temp_output_filename = evt.target.files[0].name.replace('.json', '').replace('.txt', '')
    output_filename = temp_output_filename

    fr_inputfile.onload = e => {
        data_global_json = JSON.parse(e.target.result)
    }
}

function handleFilegeofences (evt) {
    fr_geofencesfile.readAsText(evt.target.files[0])

    output_filename = temp_output_filename + "_" + evt.target.files[0].name.replace('.json', '')

    fr_geofencesfile.onload = e => {
        data_global_geofences = JSON.parse(e.target.result)
    }
}

//event listener for file input
document.getElementById('inputfile').addEventListener('change', handleFileJSON, false)
document.getElementById('geofencesfile').addEventListener('change', handleFilegeofences, false)
/*== Set data_global_json from input file ==*/

/*==== Function called when the button is pressed ====*/
function pogotools_to_mymaps() {

    correctEncodingInNames(data_global_json)
    
    //convert and write data into the output file
    if ( (exported_file_mode) == "kml" ) {
        convertFile_kml(data_global_json, data_global_geofences, output_filename)
    }
    else if ( (exported_file_mode) == "csv" ) {
        convertFile_csv(data_global_json, data_global_geofences, output_filename)
    }
    else if ( (exported_file_mode) == "csv (Detective Pikachu)" ) {
        convertFile_csv_detectivepikachu(data_global_json, data_global_geofences, output_filename)
    }
}
/*== Function called when the button is pressed ==*/

function write_string_kml(data_element, data_name, data_value) {
    file_string = "      <Placemark>\n        <name>" + data_element['name']

    file_string += "</name>\n        <ExtendedData>\n          <Data name='"+ data_name + "'>\n            <value>" + data_value + "</value>"

    file_string += "\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q="
        + data_element['lat'] + "," + data_element['lng']
        + "</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            "
        + data_element['lng'] + "," + data_element['lat']
        + "\n          </coordinates>\n        </Point>\n      </Placemark>\n"

    return file_string
}

function write_string_csv(data_element, data_name, data_value) {
    return data_element['name'] + "," + data_value + "," + data_element['lat'] + "," + data_element['lng'] + "\n"
}

function write_string_core(data, data_geofences, write_string_function) {
    var file_string = ""
    Object.keys(data).forEach(function (data_key) {
        if (data_key != "nothpwu" && data_key != "notpogo" && data_key != "ignoredCellsExtraGyms" && data_key != "ignoredCellsMissingGyms") {
            Object.keys(data[data_key]).forEach(function (data_id) {
                data_element = data[data_key][data_id]

                if (data_key == "gyms") {
                    if ((language_mode) == "Spanish") {
                        data_value = portal_strings[data_key][language_mode] + " EX"
                    }
                    else {
                        data_value = "EX " + portal_strings[data_key][language_mode]
                    }
                }
                else if (data_key == "inns") {
                    if ((language_mode) == "Spanish") {
                        data_value = portal_strings[data_key][language_mode] + " " + translate_colors[data_element['color']]
                    }
                    else {
                        data_value = data_element['color'] + " " + portal_strings[data_key][language_mode]
                    }
                }
                else {
                    data_value = portal_strings[data_key][language_mode]
                }


                if (data_geofences == undefined) {
                    file_string += write_string_function(data_element, language_strings["data_name"][language_mode], data_value)
                }
                else {
                    var ingeofence_pokestop_kml = false
                    Object.keys(data_geofences).forEach(function (data_geofences_element) {
                        if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data_element['lng'], data_element['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data_element['lat'], data_element['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) ) ) ) {
                            ingeofence_pokestop_kml = true
                        }
                    })
                    if (ingeofence_pokestop_kml == true) {
                        file_string += write_string_function(data_element, language_strings["data_name"][language_mode], data_value)
                    }
                }
            })
        }
    })

    return file_string
}

function convertFile_kml(data, data_geofences, output_filename) {
    var file_string = "<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>" + language_strings["layer_name"][language_mode] + "</name>\n"

    file_string += write_string_core(data, data_geofences, write_string_kml)
    file_string += "  </Document>\n</kml>"

    downloadOutputFile(file_string, "kml", output_filename)
}

function convertFile_csv(data, data_geofences, output_filename) {
    var file_string = "Name," + language_strings["data_name"][language_mode] + "," + language_strings["latitude"][language_mode] + "," + language_strings["longitude"][language_mode] + "\n"

    file_string += write_string_core(data, data_geofences, write_string_csv)

    downloadOutputFile(file_string, "csv", output_filename)
}

function convertFile_csv_detectivepikachu(data, data_geofences, output_filename) {
    var file_string

    if ( (language_mode) == "English" ) {
        file_string = "Name	Latitude	Longitude	Keywords	Tags	Zones\n"
    }
    else if ( (language_mode) == "Spanish" ) {
        file_string = "Nombre	Latitud	Longitud	Palabras clave	Etiquetas	Zonas\n"
    }

    if ("gyms" in data) {
        Object.keys(data['gyms']).forEach(function (data_element) {

            if (data_geofences == undefined) {
                writeStringGyms(data_element)
            }
            else {
                var zone = ""
                Object.keys(data_geofences).forEach(function (data_geofences_element) {
                    if ( data_geofences[data_geofences_element]['enable'] == "yes" && ( (data_geofences[data_geofences_element]['format'] == "lnglat" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lng'], data['gyms'][data_element]['lat']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) || (data_geofences[data_geofences_element]['format'] == "latlng" && turf.booleanPointInPolygon(turf.point([data['gyms'][data_element]['lat'], data['gyms'][data_element]['lng']]), turf.polygon([data_geofences[data_geofences_element]['geofence']])) == true) ) ) {
                        zone += data_geofences_element + ","
                    }
                })
                zone = zone.replace(/,\s*$/, "")
                if (zone != "") {
                    writeStringGymsGeofences(data_element, zone)
                }
            }
    
        })
    }
    
    downloadOutputFile(file_string, "csv", output_filename)

    function writeStringGyms(data_element) {
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n"
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	\n"
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n"
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		\n"
            }
        }
    }

    function writeStringGymsGeofences(data_element, zone) {
        if (data['gyms'][data_element]['isEx'] == true) {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n"
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "	ex	" + zone + "\n"
            }
        }
        else {
            if ((language_mode) == "English") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n"
            }
            else if ((language_mode) == "Spanish") {
                file_string += data['gyms'][data_element]['name'] + "	" + data['gyms'][data_element]['lat'] + "	" + data['gyms'][data_element]['lng'] + "	" + data['gyms'][data_element]['name'] + "		" + zone + "\n"
            }
        }
    }
}

function setMode(mode,pressed_div) {

    var parentClass = pressed_div.parentNode.className

    if (parentClass != "") {
        parentClass = "." + parentClass.replace(/ /g, '.')
    }

    /*==== Remove class "selected" from all elements ====*/
    var elems = document.querySelectorAll("#button_structure" + parentClass + " > div");

    [].forEach.call(elems, function(el) {
        el.classList.remove("selected")
    })
    /*== Remove class "selected" from all elements ==*/

    /*=== Add class "selected" to element who triggered the function ===*/
    pressed_div.classList.add("selected")

    changeModeVar(mode,parentClass)

    function changeModeVar(mode,parentClass) {
        if (parentClass == ".language") {
            language_mode = mode
        }
        else if (parentClass == ".exported_file") {
            exported_file_mode = mode
        }
    }
}

function downloadOutputFile(string, format, output_filename) {
    let file_data = "data:text/"+ format + ";charset=utf-8," + string
    file_data = file_data.replace(/[\r]+/g, '').trim()
    var encodedUri = encodeURI(file_data)
    var link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", output_filename + "." + format)
    document.body.appendChild(link)
    link.click()
}

function correctEncodingInNames(data) {

    Object.keys(data).forEach(function (data_key) {
        if (data_key != "nothpwu" && data_key != "notpogo" && data_key != "ignoredCellsExtraGyms" && data_key != "ignoredCellsMissingGyms") {
            Object.keys(data[data_key]).forEach(function (data_id) {
                data_element = data[data_key][data_id]

                data_element['name'] = data_element['name'].replace(/â€œ/g, '“').replace(/â€/g, '”').replace(/Âª/g, 'ª').replace(/Â¡/g, '¡').replace(/&/g, 'and').replace(/Ã±/g, 'ñ').replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã­/g, 'í').replace(/Ã³/g, 'ó').replace(/Ãº/g, 'ú').replace(/Ã/g, 'Á').replace(/Ã¼/g, 'ü')
            })
        }
    })
}