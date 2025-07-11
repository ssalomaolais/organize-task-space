export const parse = async (event) => {
    if (event.body) {
        try {
            return JSON.parse(event.body);
        } catch (error) {
            console.error("Error parsing event body:", error);
            throw new Error("Invalid JSON in request body.");
        }
    }
    return {};
};