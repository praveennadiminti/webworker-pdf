/// <reference lib="webworker" />

import { createPdfBytes } from './webworker/createPdfBytes';

addEventListener('message', ({ data }) => {
  const bytes = createPdfBytes();
  postMessage(bytes);
});
