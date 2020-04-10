import requests
import json
from helper import *
import logging
import re
import sys
import urllib3

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
    expected = 200
    try:
        response = requests.post(url+diver+"addDiver", json=currentdiver)
        print("POST " +str(response))
        currentId = response.json()['_id']
        return response.status_code, expected, response.json()['_id']
    except requests.exceptions.ConnectionError:
        return 0, expected, "skip"

@divers
def postDiverDecorator():
    return postDiver(default_divers['diver1'])

def putDiver(id):
    expected = 200
    try:
        #Get the item
        data = requests.get(url+diver+id)
        print("PUT " + str(data.status_code) + " " +str(data))
        #Change values
        if (data.status_code != 200):
            json_result = data.json()[0]
            json_result['name'] = 'Toni'
            json_result['country'] = 'France'
            #Update values
            response = requests.put(url+diver+"update/"+id, json=json_result)
            logging.debug(jsonPrettify(response.content))
            return response.status_code, expected
        
        return data.status_code, 200
        
    except requests.exceptions.ConnectionError:
        return 0, expected, "skip"

@divers
def putDiverDecorator(id):
    return putDiver(id)

def getDiver(id):
    expected = 200
    try:
        response = requests.get(url+diver+id)
        print("GET " +str(response))
        return response.status_code, expected
    except requests.exceptions.ConnectionError:
        return 0, expected, "skip"

@divers
def getDiverDecorator(id):
    return getDiver(id)

def deleteDiver(id):
    expected = 200
    try:
        response = requests.delete(url+diver+"delete/"+id)
        print("DELETE " +str(response))
        return response.status_code, expected
    except requests.exceptions.ConnectionError:
        return 0, expected, "skip"

@divers
def deleteDiverDecorator(id):
    return deleteDiver(id)

