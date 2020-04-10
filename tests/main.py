import requests
import json
from helper import *
import logging
import re
import sys
from unit_tests.unit_divers import *
from unit_tests.unit_staff import *
from unit_tests.unit_lists import *
from unit_tests.unit_users import *


logging.basicConfig(filename='./logs/test.log', filemode='w', level=logging.DEBUG)
currentId = ""

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
        if (str.startswith(name, 'myProfile')):
            res, expected, content = func(token.decode("utf-8"))
            testPerformed = True
        if (not testPerformed):
            res, expected = func()

        if (res == expected):
            #print("TEST OK " +name.replace('Decorator', ''))
            if (res != "skip"):
                tests_ok += 1
                logging.debug("TEST OK " +name.replace('Decorator', ''))
            else:
                tests_skipped += 1
                logging.debug("TEST SKIPPED " +name.replace('Decorator', ''))
        else:
            print ("ERROR - " + name.replace('Decorator', '') + " \tResult: " + str(res) + " - Expected: " + str(expected))
            tests_fail += 1
            logging.error("TEST NOK - " + name.replace('Decorator', '') + " \tResult: " + str(res) + " - Expected: " + str(expected))

    reportResults(tests_ok, tests_fail, tests_skipped)

if __name__ == "__main__":
    initFunctions(sys.argv[1:])
    main()

