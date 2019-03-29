'''
Structure of the data:

{
    "gyms":
        {
            "guid_value":{"guid":guid_value,"lat":latitude_value,"lng":longitude_value,"name":name_value,...},
            ...
        },

    "pokestops":
        {
            "guid_value":{"guid":guid_value,"lat":latitude_value,"lng":longitude_value,"name":name_value,...},
            ...
        }

}

When doing a for loop in data['gyms'] (for i in data['gyms']),
in each iteration i is equal to guid_value. So to get the latitude of the element i
inside that loop you have to write: data['gyms'][i]['lat']
'''

import json
import sys

# Deal with command line
if len(sys.argv) == 1:
    print("Code ran without input file and language\nimportportals.json will be assumed\nThe output file will be saved in English")
    file_name = "importportals.json"
    language = "en"
elif sys.argv[1] == "help" or sys.argv[1] == "-h":
    print("usage:",sys.argv[0],"importportals.json language")
    print(" * importportals.json: file with portal from Pogo Tools")
    print(" * language: language used for the output file (en or es)")
    quit()
elif len(sys.argv) == 2:
    print("Code ran without language\nThe output file will be saved in English")
    file_name = sys.argv[1]
    language = "en"
elif len(sys.argv) >= 3:
    file_name = sys.argv[1]
    if sys.argv[2] == "es" or sys.argv[2] == "en":
        language = sys.argv[2]
    else:
        print("Language not supported\nThe output file will be saved in English")
        language = "en"


# Import data from a json file (in this case the one that Pogo Tools gives you)
try:
    with open(file_name) as json_file:
        data = json.load(json_file)
except FileNotFoundError:
    print("File not found. Script will be stopped.")
    quit()

# Write data to external file
if language == "es":
    output_filename = "portales.kml"
elif language == "en":
    output_filename = "portals.kml"

file_importtomymaps = open(output_filename,'w')

if language == "es":
    file_importtomymaps.write("<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portales</name>\n")
elif language == "en":
    file_importtomymaps.write("<?xml version='1.0' encoding='utf-8' ?>\n<kml xmlns='http://www.opengis.net/kml/2.2'>\n  <Document>\n    <name>Portals</name>\n")

for i in data['gyms']:
    # This is mainly if the file from Pogo Tools has generated the file in another encode. Also Google My Maps doesn't like the character "&"
    data['gyms'][i]['name'] = data['gyms'][i]['name'].replace("â€œ", "“").replace("â€", "”").replace("Âª", "ª").replace("Â¡", "¡").replace("&", "and").replace("Ã±", "ñ").replace("Ã¡", "á").replace("Ã©", "é").replace("Ã­", "í").replace("Ã³", "ó").replace("Ãº", "ú").replace("Ã", "Á")

    file_importtomymaps.write("      <Placemark>\n        <name>")
    file_importtomymaps.write(str(data['gyms'][i]['name']))

    if language == "es":
        file_importtomymaps.write("</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Gimnasio</value>")
    elif language == "en":
        file_importtomymaps.write("</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Gim</value>")

    file_importtomymaps.write("\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q=")
    file_importtomymaps.write(str(data['gyms'][i]['lat']))
    file_importtomymaps.write(",")
    file_importtomymaps.write(str(data['gyms'][i]['lng']))
    file_importtomymaps.write("</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            ")
    file_importtomymaps.write(str(data['gyms'][i]['lng']))
    file_importtomymaps.write(",")
    file_importtomymaps.write(str(data['gyms'][i]['lat']))
    file_importtomymaps.write("\n          </coordinates>\n        </Point>\n      </Placemark>\n")


for i in data['pokestops']:
    data['pokestops'][i]['name'] = data['pokestops'][i]['name'].replace("â€œ", "“").replace("â€", "”").replace("Âª", "ª").replace("Â¡", "¡").replace("&", "and").replace("Ã±", "ñ").replace("Ã¡", "á").replace("Ã©", "é").replace("Ã­", "í").replace("Ã³", "ó").replace("Ãº", "ú").replace("Ã", "Á")

    data['pokestops'][i]['name'] = data['pokestops'][i]['name'].replace("èœ¥èœ´èˆ‡é’è›™", "蜥蜴與青蛙")

    file_importtomymaps.write("      <Placemark>\n        <name>")
    file_importtomymaps.write(str(data['pokestops'][i]['name']))

    if language == "es":
        file_importtomymaps.write("</name>\n        <ExtendedData>\n          <Data name='Estado Pokémon GO'>\n            <value>Poképarada</value>")
    elif language == "en":
        file_importtomymaps.write("</name>\n        <ExtendedData>\n          <Data name='Pokémon GO status'>\n            <value>Pokestop</value>")

    file_importtomymaps.write("\n          </Data>\n          <Data name='Google Maps'>\n            <value>https://maps.google.com/?q=")
    file_importtomymaps.write(str(data['pokestops'][i]['lat']))
    file_importtomymaps.write(",")
    file_importtomymaps.write(str(data['pokestops'][i]['lng']))
    file_importtomymaps.write("</value>\n          </Data>\n        </ExtendedData>\n        <Point>\n          <coordinates>\n            ")
    file_importtomymaps.write(str(data['pokestops'][i]['lng']))
    file_importtomymaps.write(",")
    file_importtomymaps.write(str(data['pokestops'][i]['lat']))
    file_importtomymaps.write("\n          </coordinates>\n        </Point>\n      </Placemark>\n")

file_importtomymaps.write("  </Document>\n</kml>")
file_importtomymaps.close()

print("Writing file called",output_filename)