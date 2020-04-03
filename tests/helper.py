import logging
import json

TESTS = dict()
tests_to_run = [    #"divers", 
                    #"staffs"
                    "lists"
                    #"debug"
                ]


##########################
#        HELPERS
##########################
def jsonPrettify(toPrint):
    parsed = json.loads(toPrint)
    return(json.dumps(parsed, indent=4, sort_keys=True))

##########################
#        DECORATORS
##########################
def divers(func):
    if ("divers" in tests_to_run):
        TESTS[func.__name__] = func
        return func

def staffs(func):
    if ("staffs" in tests_to_run):
        TESTS[func.__name__] = func
        return func

def lists(func):
    if ("lists" in tests_to_run):
        TESTS[func.__name__] = func
        return func

def debug(func):
    if ("debug" in tests_to_run):
        TESTS[func.__name__] = func
        return func

def staffs(func):
    if ("staffs" in tests_to_run):
        TESTS[func.__name__] = func
        return func