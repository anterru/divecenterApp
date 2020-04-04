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
    return expected, response.status_code, None

@user
def loginDecorator():
    return login(default_values['login'])

