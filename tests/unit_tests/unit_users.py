import requests
import json
from helper import *
import logging
import re
import sys

default_values = {
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
    return register(default_values['user'])

def login(credentials):
    expected = 200
    response = requests.post(url+auth+"login", json=credentials)
    if (response.status_code == expected):
        logging.debug("Token = " + str(response.content))
        return expected, response.status_code, response.content
    else:
        logging.error(response.content)
    return  response.status_code, expected, None

@user
def loginDecorator():
    return login(default_values['login'])

def myProfileGet(token):
    expected = 200
    response = requests.get(url+users+"myProfile", headers={'x-auth-token': token})
    if (response.status_code == expected):
        logging.debug(jsonPrettify(response.content))
    else:
        print(response.content)
        logging.error(response.content)
    return response.status_code, expected, str(response.content)

@user
def myProfileGetDecorator(token):
    return myProfileGet(token)

def myProfileDelete(token):
    expected = 200
    response = requests.delete(url+users+"delete", headers={'x-auth-token': token})
    if (response.status_code == expected):
        logging.debug(response.content)
    else:
        print(response.content)
        logging.error(response.content)
    return response.status_code, expected, str(response.content)

@user
def myProfileDeleteDecorator(token):
    return myProfileDelete(token)