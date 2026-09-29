import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in .env");
}

const ai = new GoogleGenAI({
    apiKey,
});

interface LowStockProduct {
    name: string;
    stock: number;
    price: number;
}

interface TopSellingProduct {
    name: string;
    totalQuantity: number;
    totalRevenue: number;
}

interface TopCustomer {
    name: string;
    email: string;
    totalOrders: number;
    totalSpent: number;
}

export const askAI = async (
    message: string,
    data: {
        lowStockProducts: LowStockProduct[];
        topSellingProducts: TopSellingProduct[];
        topCustomers: TopCustomer[];
    }
): Promise<string> => {

    const prompt = `
You are BizPilot AI, a concise business assistant.

Answer the user's question in ONLY 1 or 2 short sentences.
Use very simple language.
Do not use markdown.
Do not use headings.
Do not use bullet points.
Do not give unnecessary examples.

LOW STOCK PRODUCTS:
${JSON.stringify(data.lowStockProducts)}

TOP SELLING PRODUCTS:
${JSON.stringify(data.topSellingProducts)}

TOP CUSTOMERS:
${JSON.stringify(data.topCustomers)}

Use the relevant data to answer the user's question.
Do not invent or make up business data.

User question:
${message}
`;

    const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
    });

    return response.text ?? "";
};