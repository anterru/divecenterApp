
import requests
import json
from helper import *
import logging
import re
import sys

default_staffs = {
    'staff1': {
        "languages": [
            "English",
            "Spanish"
        ],
        "title": [
            {
                "agency": "SSI",
                "level": "DM"
            },
            {
                "agency": "PADI",
                "level": "Instructor"
            },
            {
                "agency": "SSI",
                "level": "Instructor"
            }
        ],
        "equipment": [
            {
                "fins": "White SEAC L with black boots",
                "ws": "Black seac",
                "bcd": "mares travellight 2.0 blue",
                "comment": "Thank you"
            }
        ],
        "name": "toni",
        "morning_food": "chicken sandwich",
        "afternoon_food": "Massaman chicken"
    }
}

##########################
#          STAFF
##########################

def postStaff(currentStaff):
    response = requests.post(url+staff+"addStaff", json=currentStaff)
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200, response.json()['_id']

@staffs
def postStaffDecorator():
    return postStaff(default_staffs['staff1'])

def putStaff(id):
    #Get the item
    data = requests.get(url+staff+id)
    if (len(data.json()) == 0):
        logging.error("Staff with ID " + id + " not found. Expected to find it")
        return ("Staff with ID " + id + " not found"), " to find it"
    #Change values
    json_result = data.json()[0]
    json_result['name'] = 'Roger'
    json_result['title'][0]['agency'] = 'TDI'
    #Update values
    response = requests.put(url+staff+"update/"+id, json=json_result)
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@staffs
def putStaffDecorator(id):
    return putStaff(id)

def getStaff(id):
    response = requests.get(url+staff+id)
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@staffs
def getStaffDecorator(id):
    return getStaff(id)

def deleteStaff(id):
    response = requests.delete(url+staff+"delete/"+id)
    return response.status_code, 200

@staffs
def deleteStaffDecorator(id):
    return deleteStaff(id)
