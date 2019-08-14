/*
 All the Global Constants are declared here.
*/

const BASE_API_URI = "https://tools.wmflabs.org/contraband/";
// const BASE_API_URI = "http://127.0.0.1:8000/";

// method: POST
export const QueryCreateApi = BASE_API_URI + "query/add/user/";
// method: GET, PATCH, DELETE
export const QueryDetailApi = BASE_API_URI + "query/<hash>/update/user/";
// method: POST
export const filterCreateApi = BASE_API_URI + "query/<hash>/add/filter/";
// method: GET, PATCH, DELETE
export const filterDetailApi = BASE_API_URI + "query/<hash>/update/filter/";
// method: POST
export const queryExist = BASE_API_URI + "query/<hash>/check/";
// method: GET
export const fetchDetails = BASE_API_URI + "result/<hash>/";

export const getUsers = BASE_API_URI + "result/<hash>/users/";

export const commits_by_date = BASE_API_URI + "result/<hash>/commits/";

export const BASE_YEAR = 2013;
export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "nov",
  "Dec"
];

export const full_months = [
  "January",
  "Feberuary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

export const contribution_color = contr => {
  if (contr === 0) {
    return "rgb(227, 231, 229)";
  } else if (contr >= 1 && contr < 3) {
    return "rgb(198, 228, 139)";
  } else if (contr >= 3 && contr < 5) {
    return "rgb(123, 201, 111)";
  } else if (contr >= 5 && contr < 7) {
    return "rgb(35, 154, 59)";
  } else {
    return "rgb(25, 97, 39)";
  }
};

export const filter_2 = [
  { key: 30, value: 30, text: "Last 30 days" },
  { key: 60, value: 60, text: "Last 60 days" },
  { key: 90, value: 90, text: "Last 90 days" },
  { key: 180, value: 180, text: "Last 6 months" },
  { key: 365, value: 365, text: "Last 1 year" }
];

export const get_dates = () => {
  let current_year = new Date().getFullYear();
  let current_month = new Date().getMonth();
  let rv = [];

  for (let i = current_year; i >= BASE_YEAR; i--) {
    for (let j = 11; j >= 0; j--) {
      if (i == current_year && j > current_month) {
        continue;
      }
      rv.push({
        key: full_months[j] + ", " + i,
        value: full_months[j] + ", " + i,
        text: full_months[j] + ", " + i
      });
    }
  }
  return rv;
};

export const phab_status = ["declined", "resolved", "stalled", "invalid"];

export const gerrit_status = [
  "merged",
  "abandoned",
  "closed",
  "pending",
  "reviewed"
];

export const format_status = arr => {
  let rv = [];
  for (let i of arr) {
    if (gerrit_status.includes(i)) {
      rv.push({
        key: i,
        value: i,
        text: "Gerrit: " + i
      });
    }

    if (phab_status.includes(i)) {
      rv.push({ key: i, value: i, text: "Phab: " + i });
    }

    if (i == "open") {
      rv.push({ key: "g-open", value: "g-open", text: "Gerrit: " + i });
      rv.push({ key: "p-open", value: "p-open", text: "Phab: " + i });
    }
  }
  return rv;
};

export const get_timestamp = (date1, date2) => {
  let days = Math.abs((date2 - date1) / 86400000);
  let day = 30;
  if (days >= 365) {
    day = 365;
  } else if (days >= 180 && days <= 365) {
    day = 180;
  } else if (days >= 90 && days <= 180) {
    day = 90;
  } else if (days >= 60 && days <= 90) {
    day = 60;
  }
  return day;
};
