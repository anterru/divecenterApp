import requests
import json
from helper import *
import logging
import re
import sys

url = "http://localhost:3000/"
diver = "diver/"
staff = "staff/"
boatlist = "lists/"
users = "users/"
auth  = "auth/"
logging.basicConfig(filename='./logs/test.log', filemode='w', level=logging.DEBUG)
currentId = ""

default_entries = {
    'diver': {
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
    },
    'staff': {
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
    },
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
    },
    "user":{
        "name": "Toni",
        "email": "toni@gmail.com",
        "password": "fundive123N,"
    },
    "login":{
        "email": "toni@gmail.com",
        "password": "fundive123N,"
    }
}

##########################
#          USERS
##########################

def register(credentials):
    response = requests.post(url+users+"register", json=credentials)
    if (response.status_code == 200):
        logging.debug(jsonPrettify(response.content))
    else:
        logging.error(response.content)
    return response.status_code, 200

@user
def registerDecorator():
    return register(default_entries['user'])

def login(credentials):
    expected = 200
    response = requests.post(url+auth+"login", json=credentials)
    if (response.status_code == expected):
        logging.debug("Token = " + str(response.content))
        return expected, response.status_code, response.content
    else:
        logging.error(response.content)
    return expected, response.status_code, None

@user
def loginDecorator():
    return login(default_entries['login'])

##########################
#          DIVERS
##########################

def postDiver(currentdiver):
    response = requests.post(url+diver+"addDiver", json=currentdiver)
    currentId = response.json()['_id']
    return response.status_code, 200, response.json()['_id']

@divers
def postDiverDecorator():
    return postDiver(default_entries['diver'])

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

##########################
#          STAFF
##########################

def postStaff():
    response = requests.post(url+staff+"addStaff", json=default_entries['staff'])
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200, response.json()['_id']

@staffs
def postStaffDecorator():
    return postStaff()

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

##########################
#          LISTS
##########################

def postList():
    #Send new list
    response = requests.post(url+boatlist+"addList", json=default_entries['boat_list'])
    logging.debug(jsonPrettify(response.content))
    return response.status_code, 200, response.json()['_id']

@lists
def postListDecorator():
    return postList()

def putLists(id):
    expected = 200
    #Declare staffs
    expected, res, staffid1 = postStaff()
    if ( expected != res ):
        return "Could not post staff1 ", " to be able", 0

    expected, res, staffid2 = postStaff()
    if ( expected != res ):
        return "Could not post staff2 ", " to be able", 0

    expected, res = putStaff(staffid2)
    if ( expected != res ):
        return "Could not change staff2 ", " to be able", 0

    #Declare divers
    expected, res, diverid1 = postDiver(default_entries['diver'])
    if ( expected != res ):
        return "Could not post diver1 ", " to be able", 0

    expected, res, diverid2 = postDiver(default_entries['diver'])
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


def main():
    tests_ok        = 0 
    tests_fail      = 0
    tests_skipped   = 0

    id = ""
    token = None
    for name,func in TESTS.items():
        testPerformed = False
        if (str.startswith(name, 'post')):
            res, expected, id = func()
            testPerformed = True
        if (str.startswith(name, 'get') or str.startswith(name, 'put') or str.startswith(name, 'delete')):
            res, expected = func(id)
            testPerformed = True
        if (str.startswith(name, 'login')):
            res, expected, token = func()
            testPerformed = True
        if (not testPerformed):
            res, expected = func()

        if (res == expected):
            #print("TEST OK " +name.replace('Decorator', ''))
            tests_ok += 1
            logging.debug("TEST OK " +name.replace('Decorator', ''))
        else:
            print ("ERROR - " + name.replace('Decorator', '') + " \tResult: " + str(res) + " - Expected: " + str(expected))
            tests_fail += 1
            logging.error("TEST NOK - " + name.replace('Decorator', '') + " \tResult: " + str(res) + " - Expected: " + str(expected))

    logging.info("OK - " + str(tests_ok))
    logging.info("FAIL - " + str(tests_fail))
    print("OK - " + str(tests_ok))
    print("FAIL - " + str(tests_fail))

if __name__ == "__main__":
    for arg in sys.argv[1:]:
        addDecorator(str(arg))
    main()

