exports.handler = async (event) => {
    const API_KEY = process.env.VITE_CAT_API_KEY;
    const url = "https://api.thecatapi.com/v1/votes";

    try {
        const { image_id, value } = JSON.parse(event.body);

        if (!image_id || typeof value !== "number") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Invalid request data" }),
            };
        }

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            body: JSON.stringify({ image_id, value }),
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to submit vote" }),
        };
    }
};
