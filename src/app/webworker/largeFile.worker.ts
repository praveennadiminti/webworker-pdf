/// <reference lib="webworker" />

// Listen for messages from the main thread
self.onmessage = async ({data}) => {
    const url = data;
    console.log(`Worker received URL: ${url}`);
    if (!url) {
        self.postMessage({ error: 'No URL provided' });
        return;
    }

    try {
        console.log(`Fetching large file from: ${url}`);
        // Fetch the large file as a stream
        const response = await fetch(url);
        console.log(`Response status: ${response.status}`);
        if (!response.ok) {
            // If the response is not OK, send an error message back to the main thread
            console.error(`Failed to fetch: ${response.statusText}`);
            self.postMessage({ error: `Failed to fetch: ${response.statusText}` });
            return;
        }

        // Read the response as a stream and send progress updates
        const reader = response.body?.getReader();
        console.log(`Response body is readable: ${!!reader}`);
        if (!reader) {
            self.postMessage({ error: 'No readable stream available' });
            return;
        }

        const contentLength = +response.headers.get('Content-Length')!;
        let receivedLength = 0;
        let chunks: Uint8Array[] = [];

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
                chunks.push(value);
                receivedLength += value.length;
                // Send progress update
                self.postMessage({
                    progress: contentLength
                        ? Math.round((receivedLength / contentLength) * 100)
                        : null,
                    receivedLength,
                });
            }
        }

        // Combine all chunks into a single Uint8Array
        const fileData = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
            fileData.set(chunk, position);
            position += chunk.length;
        }

        // Send the complete file data back to the main thread
        self.postMessage({ done: true, fileData }, [fileData.buffer]);
    } catch (error: any) {
        self.postMessage({ error: error.message || 'Unknown error' });
    }
};

export {};