//function fullscreen(){var a=document.getElementsByTagName("a");for(var i=0;i<a.length;i++){if(a[i].className.match("noeffect")){}else{a[i].onclick=function(){window.location=this.getAttribute("href");return false}}}}

function pogotoolstomymaps() {
    var input;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    input = document.getElementById('fileinput');
    if (!input) {
        alert("File not found.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Convert'");
        return;
    }
    else {
        var data = {};
        $.ajax({
            url: input.files[0].name,
            dataType: 'json',
            async: false,
            success: function(json) {
                //console.log(json);
                data = json;
            }
        });

        file_string = convertFile(data);

        var output_filename;
        if ( (document.getElementById("language").value) == "English" ) {
            output_filename = "portals.kml";
        }
        else if ( (document.getElementById("language").value) == "Spanish" ) {
            output_filename = "portales.kml";
        }

        writeFile(file_string, output_filename);
    }
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
    let file_data = "data:text/csv;charset=utf-8,";
    file_data += file_string;
    var encodedUri = encodeURI(file_data);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", output_filename);
    document.body.appendChild(link); // Required for FF
    link.click();
}

