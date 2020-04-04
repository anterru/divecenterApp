import logging
import json

TESTS = dict()

diversFunctions = dict()
staffsFunctions = dict()
listsFunctions = dict()
usersFunctions = dict()
debugFunctions = dict()

##########################
#        HELPERS
##########################
def jsonPrettify(toPrint):
    parsed = json.loads(toPrint)
    return(json.dumps(parsed, indent=4, sort_keys=True))

def initFunctions(tags):
    for tag in tags:
        if (tag == "all"):
            TESTS.update(diversFunctions)
            TESTS.update(staffsFunctions)
            TESTS.update(listsFunctions)
            TESTS.update(usersFunctions)
            TESTS.update(debugFunctions)
            break
        if (tag == "divers"):
            TESTS.update(diversFunctions)
            continue
        if (tag == "staffs"):
            TESTS.update(staffsFunctions)
            continue
        if (tag == "lists"):
            TESTS.update(listsFunctions)
            continue
        if (tag == "users"):
            TESTS.update(usersFunctions)
            continue
        if (tag == "debug"):
            TESTS.update(debugFunctions)
            continue
        

##########################
#        DECORATORS
##########################
def divers(func):
    diversFunctions[func.__name__] = func
    return func

def staffs(func):
    staffsFunctions[func.__name__] = func
    return func

def lists(func):
    listsFunctions[func.__name__] = func
    return func

def debug(func):
    debugFunctions[func.__name__] = func
    return func

def user(func):
    usersFunctions[func.__name__] = func
    return func