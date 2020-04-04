import requests
import json
from helper import *
import logging
import re
import sys
from .unit_divers import *
from .unit_staff import *

default_lists = {
    "boat_list": {
        "description": {
            "place": "big boat",
            "comment": "Do not play reggaeton"
        },
        "date": {
            "year": 2020,
            "month": 3,
            "day": 20,
            "time": "morning"
        },
        "activities":[
            {
                "staff": [
                    {
                        "name": "5e80da6ef479f256688af0f1",
                        "food": "Massaman chicken"
                    },
                    {
                        "name": "5e80d9ec43c6c8563755c3c6",
                        "food": "Massaman chicken"
                    }
                ],
                "divers": [
                    {
                        "name": "5e8240d0f29c305f3f89d652",
                        "activity": "OW",
                        "price": 3400,
                        "paid": 1000,
                        "food": "Massaman chicken",
                        "comment": "",
                        "soldBy": [
                            {"staff": "5e8240d0f29c305f3f89d652"},
                            {"staff": "5e8242b5ccd2b85feb4ad63d"}
                        ]
                    },
                    {
                        "name": "5e8242b5ccd2b85feb4ad63d",
                        "activity": "OW",
                        "price": 3400,
                        "paid": 1000,
                        "food": "Massaman chicken",
                        "comment": "",
                        "soldBy": [
                            {"staff": "5e8240d0f29c305f3f89d652"},
                            {"staff": "5e8242b5ccd2b85feb4ad63d"}
                        ]
                    }
                ],
                "briefing": "5e8240d0f29c305f3f89d652"
            }
        ],
        "briefing": "5e8240d0f29c305f3f89d652",
        "packing": [
            {
                "name": "5e8240d0f29c305f3f89d652"
                
            },
            {
                "name": "5e8242b5ccd2b85feb4ad63d"
                
            }
        ]
    }
}

##########################
#          LISTS
##########################

def postList():
    #Send new list
    response = requests.post(url+boatlist+"addList", json=default_lists['boat_list'])
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200, response.json()['_id']

@lists
def postListDecorator():
    return postList()

def putLists(id):
    expected = 200
    #Declare staffs
    expected, res, staffid1 = postStaff(default_staffs['staff1'])
    if ( expected != res ):
        return "Could not post staff1 ", " to be able", 0

    expected, res, staffid2 = postStaff(default_staffs['staff1'])
    if ( expected != res ):
        return "Could not post staff2 ", " to be able", 0

    expected, res = putStaff(staffid2)
    if ( expected != res ):
        return "Could not change staff2 ", " to be able", 0

    #Declare divers
    expected, res, diverid1 = postDiver(default_divers['diver1'])
    if ( expected != res ):
        return "Could not post diver1 ", " to be able", 0

    expected, res, diverid2 = postDiver(default_divers['diver1'])
    if ( expected != res ):
        return "Could not post diver2 ", " to be able", 0

    expected, res = putDiver(diverid2)
    if ( expected != res ):
        return "Could not change diver2 ", " to be able", 0
    
    #Get the item
    data = requests.get(url+boatlist+id, headers={'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg4NmVkZTRlNzhhYzk2ZjRlZmY1MTQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTg2MDE3MDk3fQ.BEanHHAd0tOBjeempT0Z29MtVF9qjHDZXk2PXpOjXGE'})
    if(data.status_code != expected):
        logging.error(data.content)
        return data.status_code, expected
    if (len(data.json()) == 0):
        logging.error("List with ID " + id + " not found. Expected to find it")
        return ("List with ID " + id + " not found"), " to find it"
    #Change values
    json_result = data.json()[0]
    json_result['activities'][0]['staff'][0]['name'] = staffid1
    json_result['activities'][0]['staff'][1]['name'] = staffid2
    json_result['activities'][0]['divers'][0]['name'] = diverid1
    json_result['activities'][0]['divers'][1]['name'] = diverid2

    #Update values
    response = requests.put(url+boatlist+"update/"+id, json=json_result)
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@lists
def putListsDecorator(id):
    return putLists(id)

@lists
def getListWithToken(listid):
    expected = 200
    #Get list

    #response = requests.get(url+boatlist+id)
    response = requests.get(url+boatlist+listid, headers={'x-auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZTg4NmVkZTRlNzhhYzk2ZjRlZmY1MTQiLCJpc0FkbWluIjpmYWxzZSwiaWF0IjoxNTg2MDE3MDk3fQ.BEanHHAd0tOBjeempT0Z29MtVF9qjHDZXk2PXpOjXGE'})
    if (response.status_code != expected):
        logging.error(response.content)
    else:
        if (len(response.json()) == 0):
            logging.error("List with ID " + id + " not found. Expected to find it")
            return ("List with ID " + id + " not found"), " to find it"
        logging.debug(jsonPrettify(response.content))

        #Analyze it
        json_result = response.json()[0]
        if (not re.search(r"/^[a-z][a-z\s]*$/", json_result['activities'][0]['staff'][0]['name'])):
            return "Staff 1 does not follow the pattern", " to follow it"
        if (not re.search(r"/^[a-z][a-z\s]*$/", json_result['activities'][0]['staff'][1]['name'])):
            return "Staff 2 does not follow the pattern", " to follow it"
        if (not re.search(r"/^[a-z][a-z\s]*$/", json_result['activities'][0]['divers'][0]['name'])):
            return "Diver 1 does not follow the pattern", " to follow it"
        if (not re.search(r"/^[a-z][a-z\s]*$/", json_result['activities'][0]['divers'][1]['name'])):
            return "Diver 2 does not follow the pattern", " to follow it"
    return response.status_code, 200

@lists
def getListDecorator(id):
    return getListWithToken(id)

def getListPopulated(id):
    expected = 200
    response = requests.get(url+boatlist+"populated?id="+id)
    if (response.status_code != expected):
        logging.error(response.content)
        return response.status_code, expected
       
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200

@lists
def getPopulatedListDecorator(id):
    return getListPopulated(id)

def deleteList(id):
    response = requests.delete(url+boatlist+"delete/"+id)
    return response.status_code, 200

@lists 
def deleteListDecorator(id):
    return deleteList(id)
