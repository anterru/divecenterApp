import requests
import json
from helper import *
import logging
import re
import sys

default_divers = {
    'diver1': {
        "name": "Pepe",
        "country": "India",
        "dateSignUp": ["2020-03-27T17:43:19.013Z"],
        "dateOfBirth": ["1990-03-27T17:43:19.013Z"],
        "equipment": {
            "fins": "New blue",
            "ws": "M",
            "bcd": "M",
            "mask": "blue",
            "comment": ""
        },
        "numOfDives": 30,
        "languages": ["English", "Hindi"],
        "license": {
            "level": "OW",
            "agency": "PADI",
            "checker":  "5e7fd25068507c525a8cf33d"
        },
        "lastDive": "3 months"
    }
}

##########################
#          DIVERS
##########################

def postDiver(currentdiver):
    response = requests.post(url+diver+"addDiver", json=currentdiver)
    currentId = response.json()['_id']
    return response.status_code, 200, response.json()['_id']

@divers
def postDiverDecorator():
    return postDiver(default_divers['diver1'])

def putDiver(id):
    #Get the item
    data = requests.get(url+diver+id)
    #Change values
    json_result = data.json()[0]
    json_result['name'] = 'Toni'
    json_result['country'] = 'France'
    #Update values
    response = requests.put(url+diver+"update/"+id, json=json_result)
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@divers
def putDiverDecorator(id):
    return putDiver(id)

def getDiver(id):
    response = requests.get(url+diver+id)
    #logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@divers
def getDiverDecorator(id):
    return getDiver(id)

def deleteDiver(id):
    response = requests.delete(url+diver+"delete/"+id)
    return response.status_code, 200

@divers
def deleteDiverDecorator(id):
    return deleteDiver(id)

