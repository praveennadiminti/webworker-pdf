
/// <reference lib="webworker" />

import Handlebars from "handlebars";

addEventListener('message', ({ data }) => {

  const items: TableItem[] = [];
  for (let i = 0; i < 100000; i++) {
    items.push({
      name: i.toString(),
      value: isPrime(i)
    })
  }
  const jsonResponse: ApiResponse = {
    "title": "Sample Title",
    "description": "This is a sample description.",
    "items": []
  };
  jsonResponse.items = items;
  const html = jsonToHtmlTable(jsonResponse);
  const parsedHtml = Handlebars.compile(html);
  postMessage(parsedHtml({}));
});

function jsonToHtmlTable(json: ApiResponse) {
  let html = `
      <html><head><title>Inventory report</title>
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
      </head>
      <body>
      <h1>${json.title}</h1>
      <p>${json.description}</p>
      <table>
      <tr><th>Name</th><th>Value</th></tr>
    `;
  json.items.forEach(item => {
    html += `<tr><td>${item.name}</td><td>${item.value}</td></tr>`;
  });
  html += `</table></body></html>`;
  return html;
}


export type ApiResponse = {
  title: string;
  description: string;
  items: TableItem[]
}

export type TableItem = {
  name: string;
  value: string;
}
function isPrime(i: number): string {
  if (isPrimeNum(i)) {
    return "YES";
  } else {
    return "NO";
  }
}


let isPrimeNum: Function = (num: number) => {
  if (num == 1 || num == 2) {
    return true;
  } else {
    let isPrime = true;
    for (let i = 2; i < num; i++) {
      if (num % i == 0) {
        isPrime = false;
      }
    }
    return isPrime;
  }
};
