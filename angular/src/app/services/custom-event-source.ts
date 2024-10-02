import { Observable } from 'rxjs';


// Custom Implementation of EventSource so we are able to include headers.
export const customEventSource = (expressURL: string): Observable<any> => {
  return new Observable((observer) => {
    fetch(`${expressURL}`, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then(async (response) => {
        if (response.ok && response.status === 200) {
          // The body is a stream, so we need to get a reader
          const reader = response.body?.getReader();
          const decoder = new TextDecoder("utf-8");

          if (!reader) {
            observer.error("Unable to get reader from response");
            return;
          }

          let textBuffer = "";
          // Read the stream chunk by chunk
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log("Stream completed");
              observer.complete();
              break;
            }

            // Decode and append the chunk to the buffer
            textBuffer += decoder.decode(value, { stream: true });

            // Process the buffer for full messages
            let eventIndex;
            while ((eventIndex = textBuffer.indexOf("\n\n")) > -1) {
              const eventString = textBuffer.slice(0, eventIndex);
              textBuffer = textBuffer.slice(eventIndex + 2); // Move past the current event
              
              // Parse the event string
              if (eventString.startsWith("data: ")) {
                const jsonData = eventString.slice(6); // Get data part, assuming 'data: ' prefix
                try {
                  const parsedData = JSON.parse(jsonData);
                  observer.next(parsedData);
                } catch (error) {
                  observer.error("Error parsing JSON from stream");
                }
              }
            }
          }
        } else {
          observer.error(`Error: ${response.statusText}`);
        }
      })
      .catch((err) => {
        observer.error(`Fetch error: ${err}`);
      });

    // Return a cleanup function in case the subscription is unsubscribed
    return () => {
      console.log("Stream manually closed by the client");
    };
  });
};