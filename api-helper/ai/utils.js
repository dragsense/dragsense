const wordToNumber = (text) => {
    // Dictionary for basic numbers and multipliers
    const numberMap = {
        one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
        eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
        eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
        seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, couple: 2, "a dozen": 6, dozen: 12,
        several: () => Math.floor(Math.random() * 3) + 3, "a few": () => Math.floor(Math.random() * 3) + 2,
        few: () => Math.floor(Math.random() * 3) + 2, many: () => Math.floor(Math.random() * 3) + 10,
        hundreds: () => Math.floor(Math.random() * 901) + 100, thousands: () => Math.floor(Math.random() * 9001) + 1000
    };

    // Function to convert words to numbers
    function convertWordNumber(word) {
        if (typeof numberMap[word] === "function") {
            return numberMap[word](); // Call the function to get a random number
        }
        return numberMap[word] || word; // Return word itself if not found
    }

    // Handle multi-word numbers like "twenty two", "one hundred", etc.
    function parseNumber(words) {
        let result = [];
        let current = 0;

        for (let word of words) {
            if (word === "hundred" || word === "thousand") {
                if (current === 0) {
                    current = 1; // Treat "one hundred" as "100"
                }
                current *= numberMap[word];
            } else if (numberMap[word]) {
                // Check if the word is a number word
                current += convertWordNumber(word);
            } else {
                // If the word is not a number, finalize any ongoing number conversion and add the non-number word
                if (current !== 0) {
                    result.push(current.toString());
                    current = 0;
                }
                result.push(word); // Keep the non-number word as is
            }
        }

        // If there's any remaining number to add, push it
        if (current !== 0) {
            result.push(current.toString());
        }

        return result.join(" ");
    }

    // Split the input text into words
    const words = text.split(/\s+/); // Use regex to split by spaces
    const result = parseNumber(words);

    return result; // Return the result with both numbers and words
};


  module.exports = {
    wordToNumber
  }