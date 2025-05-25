
/// <reference lib="webworker" />

import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

addEventListener('message', ({ data }) => {
  const doc = new jsPDF();

  const items = [];
  for (let i = 0; i < 100000; i++) {
    items.push([i, isPrime(i)])
  }
  // Define the table data
  const columns = ["Number", "isPrime"];
  const rows = items;

  // Add the table to the PDF with styles
  autoTable(doc, {
    head: [columns],
    body: rows,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 10,
      cellPadding: 5,
      overflow: 'linebreak',
      lineColor: [44, 62, 80],
      lineWidth: 0.75,
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [52, 152, 219],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
    didParseCell: (data) => {
      // Apply alternate row colors
      if (data.row.index % 2 === 0) {
        data.cell.styles.fillColor = [153, 207, 224]; // Light gray for even rows
      } else {
        data.cell.styles.fillColor = [255, 255, 255]; // White for odd rows
      }
    },
    margin: { top: 20 },
  });
  const bytes = doc.output('arraybuffer');
  postMessage(bytes);
});

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
