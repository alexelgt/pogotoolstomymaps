# Pogo Tools to My Maps

This script converts a json file exported from Pogo Tools (IITC plugin) to a kml file that can be imported to Google My Maps.
## Structure of the json file
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
***
# Python script
## How to use
To run the code type ```python3 pogotoolstomymaps.py importportals.json language```

Where:
* importportals.json: file with the exported data from Pogo Tools.

* language: language for the output data in the kml file.
    * Accepted values: en (English), es (Spanish).

If the file is run with one input, language is set to English (en).

If the code is run without inputs, language is se to English (en) and the code will try to use the file _importportals.json_ as input.

If you type ```python3 pogotoolstomymaps.py -h``` the code will show how to use the script (but it will tell what's been explained before).


# Javascript script
## How to use

Go to [this page](https://pogotoolstomymaps.alexelgt.com), select a file and press the button **Convert**. After that the kml file will be automatically downloaded.