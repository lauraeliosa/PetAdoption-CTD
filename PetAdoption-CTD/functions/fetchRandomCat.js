exports.handler = async () => {
    const API_KEY = process.env.VITE_CAT_API_KEY;
    const url = "https://api.thecatapi.com/v1/images/search";

    try {
        const response = await fetch(url, {
            headers: { "x-api-key": API_KEY },
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch random cat" }),
        };
    }
};
