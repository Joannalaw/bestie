const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()
// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
async function textGenTextOnlyPrompt() {
    // [START text_gen_text_only_prompt]
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(process.env.APIkey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "identify negative language and output a list";
    const query = ["feeling so blue", 'hate the world','love my child']


    const result = await model.generateContent(prompt+ query.map(q=>q));
    console.log(result.response.text());
    // [END text_gen_text_only_prompt]
}

textGenTextOnlyPrompt();