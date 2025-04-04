import time
import os
import pandas as pd
import requests
from bs4 import BeautifulSoup
from tabulate import tabulate


url = "https://internet3.trincoll.edu/ptools/courselisting.aspx"

with requests.session() as session:
    course_selection = (
        BeautifulSoup(session.get(url).text, "html.parser")
        .select("#ddlList [value]")
    )
    all_courses = [[c.get("value"), c.getText()] for c in course_selection]

    for course in all_courses:
        course_id, course_name = course
        print(f"Getting {course_name}...")

        v_state = (
            BeautifulSoup(session.get(url).text, "html.parser")
            .find("input", {"name": "__VIEWSTATE"})["value"]
        )
        event_validation = (
            BeautifulSoup(session.get(url).text, "html.parser")
            .find("input", {"name": "__EVENTVALIDATION"})["value"]
        )

        payload = {
            "__EVENTVALIDATION": event_validation,
            "__VIEWSTATE": v_state,
            "__VIEWSTATEGENERATOR": "3786FA90",
            "rblLstType": 1,
            "ddlList": course_id,
            "ddlLevelList": 0,
            "ddlTermList": 1241,
            "ddlSession": 0,
            "btnSubmit": "Submit",
        }

        response = session.post(url, data=payload)
        courses = (
            BeautifulSoup(response.text, "html.parser")
            .select_one('table[class="TITLE_tbl"]')
        )

        if courses:
            table_rows = zip(
                courses.select(".TITLE_id"),
                courses.select(".TITLE_times"),
                courses.select(".TITLE_title"),
                courses.find_all('td', nowrap="true"),
            )
        else:
            table_rows = []

        my_table = [
            [
                id_.getText(),
                time.getText(),
                title.getText(),
                c_id.getText(),
            ] for id_, time, title, c_id in table_rows
        ]

        folder_name = "/Users/anupamkhargharia/Desktop/Computer Science/trincoll_scheduler/course_web_scraper/data"
        file_name = f"{course_id}_{course_name}.csv"
        path = os.path.join(folder_name, file_name)
        df = pd.DataFrame(my_table, columns=["ID", "Time", "Title", "Course ID"])
        df.to_csv(path, index=False)
        print(tabulate(df, headers="keys", tablefmt="psql", showindex=False))