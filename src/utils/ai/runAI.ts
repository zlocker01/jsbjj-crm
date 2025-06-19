// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { OpenAI } from "openai";

// const openIA = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY || "",
// });

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// export async function runAI(
//   messages: { role: "user" | "system" | "assistant"; content: string }[],
//   provider: "google" | "openai" = "google",
// ): Promise<string> {
//   if (provider === "google") {
//     try {
//       // Use the correct model name
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const result = await model.generateContent({
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: messages[0].content }],
//           },
//         ],
//       });

//       const text = await result.response.text();
//       return text || "Sin respuesta.";
//     } catch (error) {
//       console.error("Error with Google AI:", error);
//       throw error;
//     }
//   }

//   // OpenAI as fallback
//   const response = await openIA.chat.completions.create({
//     model: "gpt-4",
//     messages,
//     max_tokens: 1000,
//     temperature: 0.2,
//   });

//   return response.choices?.[0]?.message?.content || "Sin respuesta.";
// }
