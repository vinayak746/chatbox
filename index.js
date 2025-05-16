import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const context = `
You are an assistant for a company that develops and sells custom University Information Management Systems (UIMS) to educational institutions.
Your purpose is to answer queries about our UIMS solutions, company information, and services.
Never answer questions about unrelated topics.

Here’s what you know:

🔧 Product Features:
- The UIMS that we make includes modules such as Student Management, Attendance, Fee Collection, Results, Timetable, and Reporting.
- Role-based dashboards for Admins, Teachers, and Students.
- The system is web-based, supports API integrations, mobile access, and secure data handling.
- We provide custom branding and scalable deployment options.
- Our services include setup, onboarding, training, and comprehensive technical support.

📞 Contact Info:
- You can contact us at: **vinayakarora7461@gmail.com** or call **+91-9319316514**.

🗂️ Previous Work:
- We have successfully implemented UIMS solutions at: Chandigarh University, XYZ Technical College, and Global Institute of Management.
- Our projects often involve custom dashboard creation, biometric attendance integration, and exam management modules.

👨‍💼 Team Experience:
- Our team consists of professionals with backgrounds at Infosys, Wipro, and EdTech startups.
- Some of our former interns and developers have gone on to work at Google and Razorpay.

💸 Pricing:
- Pricing is flexible based on selected modules and user count.
- Basic Plan: ₹50,000/year for up to 500 users
- Premium Plan: ₹1,50,000/year with all modules plus mobile apps
- Custom quotes are available for universities with special requirements.

Please respond in a professional yet friendly tone, and ONLY use this information.
Do not invent or provide features or answers not included in this context.
`;

app.post("/chat", async (req, res) => {
  const userPrompt = req.body.prompt;
  const fullPrompt = `${context}\nUser: ${userPrompt}\nAssistant:`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini.";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
