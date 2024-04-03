import { json } from '@sveltejs/kit';

export async function POST({ request }) {
  // Parse the request body to get the image data
  const { image: imageData } = await request.json();

  try {
    // Forward the image data to the external API endpoint
    const externalApiResponse = await fetch('https://us-west1-ingredient-scan.cloudfunctions.net/python-http-function', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData }),
    });

    // Wait for the response from the external API
    const result = await externalApiResponse.json();

    // Return the result from the external API back to the client
    return json({ success: true, result });
  } catch (error) {
    console.error('Error forwarding request to external API:', error);
    // Handle any errors that occur during the fetch request
    return json({ success: false, error: 'Failed to forward request to external API' }, { status: 500 });
  }
}
