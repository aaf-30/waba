const parseBody = (rawBody) => {
    try {
        return JSON.parse(rawBody);
    } catch (error) {
        console.error(error);
        return null;
    }
};

export { parseBody };