import jsPDF from 'jspdf';

export function createPdfBytes() {
  const doc = new jsPDF();
  for (let index = 0; index < 100000 / 29; index++) {
    doc.addPage();
  }
  for (let index = 1; index < 100000; index++) {
    const primeStr = isPrime(index) ? "prime" : "composite";
    const pageNumber = Math.floor(index / 29) + 1;
    console.log("page Number is ::", pageNumber);
    doc.setPage(pageNumber);
    const y = index % 29;
    doc.text(`${index} is ${primeStr}`, 10, y * 10 + 10);
  }
  const bytes = doc.output('arraybuffer');
  return bytes;
}
let isPrime: Function = (num: number) => {
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

