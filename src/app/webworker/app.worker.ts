/// <reference lib="webworker" />

import { createPdfBytes } from './createPdfBytes';

addEventListener('message', ({ data }) => {
  const bytes = createPdfBytes();
  postMessage(bytes);
});


