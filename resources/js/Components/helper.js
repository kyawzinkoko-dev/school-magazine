export const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const noOfWords = text.split(/\s+/).length;
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return minutes;
};
