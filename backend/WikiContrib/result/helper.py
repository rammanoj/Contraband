import pandas as pd
from WikiContrib.settings import API_TOKEN, GITHUB_ACCESS_TOKEN


ORGS = [
"wikimedia",
"wmde",
"DataValues",
"commons-app",
"wikidata",
"openzim",
"mediawiki-utilities",
"wiki-ai",
"wikimedia-research",
"toollabs",
"toolforge",
"counterVandalism"
]

API_ENDPOINTS = [
     ["""https://phabricator.wikimedia.org/api/maniphest.search""",
      """https://phabricator.wikimedia.org/api/user.search"""],
      """https://gerrit.wikimedia.org/r/changes/?q=owner:{gerrit_username}&o=DETAILED_ACCOUNTS""",
     ["""https://api.github.com/search/commits?per_page=100&q=author:{github_username}""",
      """https://api.github.com/search/issues?per_page=100&q=is:pr+is:merged+author:{github_username}"""]
    ]

REQUEST_DATA = [
    {
        'constraints[authorPHIDs][0]': '',
        'api.token': API_TOKEN,
        'constraints[createdStart]': 0,
        'constraints[createdEnd]': 0
    },
    {
        'constraints[assigned][0]': '',
        'api.token': API_TOKEN,
        'constraints[createdStart]': 0,
        'constraints[createdEnd]': 0
    },
    {
        'constraints[usernames][0]':'',
        'api.token': API_TOKEN
    },
    {
        'github_username':'',
        'github_access_token':GITHUB_ACCESS_TOKEN,
        'createdStart':0,
        'createdEnd':0
    }
]



def get_prev_user(file, ind):
    prev_user = None
    while True:
        if ind != 0:
            temp = file.iloc[ind - 1, :]
            if pd.isnull(temp['fullname']) or (pd.isnull(temp['Gerrit']) and pd.isnull(temp['Phabricator'])):
                ind -= 1
            else:
                prev_user = temp['fullname']
                break
        else:
            break

    return prev_user


def get_next_user(file, ind):
    next_user = None
    while True:
        if ind != len(file) - 1:
            temp = file.iloc[ind+1, :]
            if pd.isnull(temp['fullname']) or (pd.isnull(temp['Gerrit']) and pd.isnull(temp['Phabricator'])):
                ind += 1
            else:
                next_user = temp['fullname']
                break
        else:
            break

    return next_user
