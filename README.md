# **Pogo Tools to My Maps**

This script converts a json file exported from Pogo Tools (IITC plugin) to a kml file that can be imported to Google My Maps.

# **Index**
* [Structure of the json file](#structure-of-the-json-file)
* [JavaScript script](#javascript-script)
* [Geofences file](#geofences-file)
* [Exported file formats](#exported-file-formats)
    * [kml](#kml)
    * [csv](#csv)
    * [csv (Detective Pikachu)](#csv-detective-pikachu)
* [Known issues](#known-issues)

# **Structure of the json file**
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

To get the latitude of an element you have to write:

     data['gyms'][guid_value]['lat']

When doing a for loop in data['gyms'],
in each iteration i is equal to guid_value. So to get the latitude of the element i
inside that loop you have to write:

    data['gyms'][i]['lat']
# **JavaScript script**
Go to [this page](https://pogotoolstomymaps.alexelgt.com), select a file and press the button **Convert**. After that the kml file will be automatically downloaded.

# **Geofences file**
If you want to filter your results by zones you can upload a geofences file with info about them. **This file is optional**.

The file called **geofences_example.json** shows a example of a valid geofences files but here is the structure:

    {"Zone1":
        {
            "enable": "yes",
            "format": "lnglat",
            "geofence": [
                [longitude1,latitude1],
                [longitude2,latitude2],
                ...
                [longitude1,latitude1]
            ]
        },
    "Zone2":
        {
            "enable": "yes",
            "format": "latlng",
            "geofence": [
                [latitude1,longitude1],
                [latitude2,longitude2],
                ...
                [latitude1,longitude1]
            ]
        }
    }

The first and last element of the geofence have to be the same.

There are 2 formats available:

1. lnglat: your data is in the format longitude,latitude.
2. latlng: your data is in the format latitude,longitude.

# **Exported file formats**

## **kml**
This format is the best one if you want to upload the file to My Maps.

## **csv**

This format can also be uploaded to My Maps but you have to select the latitude, longitude and name columns manually. Also this format does NOT include a google maps link to the coordinates of each portal.

### **Columns included:**

    Name,Pokémon GO status,Latitude,Longitude

## **csv (Detective Pikachu)**
This format is only intended to be used to automatically generate a file that can be imported to a spreadsheet compatible with the Telegram bot called **@detectivepikachubot**. It can also be updated to My Maps but it only contains gyms.

### **Columns included:**

    Name,Latitude,Longitude,Keywords,Tags,Zones

*Name and Keywords have the same value (name of the gym).*

If you include a geofences file, the column with zones will be filled in with the name of the geofence.

*Note: tab separation (instead of comma separation) is used for this file. This way multiple zones can be added to one gym.*

# Known issues

1. If you upload an empy file from Pogo Tools or none of your portals are inside any geofence the kml file won't upload to My Maps.
***
# **Python script**
This script won't be updated anymore. Use the webpage of the JavaScript script
## **How to use**
To run the code type ```python3 pogotoolstomymaps.py importportals.json language```

Where:
* importportals.json: file with the exported data from Pogo Tools.

* language: language for the output data in the kml file.
    * Accepted values: en (English), es (Spanish).

If the file is run with one input, language is set to English (en).

If the code is run without inputs, language is se to English (en) and the code will try to use the file _importportals.json_ as input.

If you type ```python3 pogotoolstomymaps.py -h``` the code will show how to use the script (but it will tell what's been explained before).