exports.handler = async (event) => {
    const CAT_API_KEY = process.env.VITE_CAT_API_KEY;
    const DOG_API_KEY = process.env.VITE_DOG_API_KEY;
    
    const type = event.queryStringParameters.type || "cat"; // Default to cats
    const apiUrl = type === "cat" 
        ? "https://api.thecatapi.com/v1/images/search?limit=5"
        : "https://api.thedogapi.com/v1/images/search?limit=5";

    const apiKey = type === "cat" ? CAT_API_KEY : DOG_API_KEY;

    try {
        const response = await fetch(apiUrl, {
            headers: { "x-api-key": apiKey },
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch pet images" }),
        };
    }
};

  