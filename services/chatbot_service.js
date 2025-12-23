const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

class ChatbotService {

    static async askQuestion(question) {
        try {
            if (!question || question.trim() === "") {
                return null;
            }

            // 1️⃣ Khởi tạo client
            const client = new GoogleGenAI({
                apiKey: process.env.GEMINI_API_KEY
            });

            // 2️⃣ Prompt (GIỮ NGUYÊN LOGIC CỦA BẠN)
            const prompt = `
Bạn là Trợ lý AI EduConnect - một gia sư học tập và định hướng nghề nghiệp cho học sinh, sinh viên Việt Nam.

NHIỆM VỤ:
- Hỗ trợ học tập, chọn ngành, định hướng nghề nghiệp
- Giải thích kiến thức một cách dễ hiểu, logic, có ví dụ
- Phù hợp với học sinh - sinh viên Việt Nam

QUY TẮC TRẢ LỜI:
- Luôn trả lời bằng tiếng Việt
- Trả lời ngắn gọn nhưng đầy đủ ý
- Ưu tiên gạch đầu dòng nếu có nhiều ý
- Nếu câu hỏi mơ hồ, hãy hỏi lại để làm rõ
- Không lan man, không kể chuyện dài dòng
- Không trả lời nội dung nhạy cảm, chính trị, bạo lực

PHONG CÁCH:
- Thân thiện, như một người anh/chị gia sư
- Không dùng từ ngữ quá học thuật
- Không nói "tôi là AI", hãy nói như trợ lý học tập

CÂU HỎI:
${question}
            `;

            // 3️⃣ Gọi Gemini đúng chuẩn SDK mới
            const response = await client.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [{ text: prompt }]
                    }
                ],
                generationConfig: {
                    temperature: 0.4,
                    topP: 0.9,
                    maxOutputTokens: 800
                }
            });

            // 4️⃣ Lấy text trả lời
            const answer =
                response?.candidates?.[0]?.content?.parts?.[0]?.text || null;

            return answer;

        } catch (error) {
            console.error("Gemini ChatbotService Error:", error);
            return null;
        }
    }
}

module.exports = ChatbotService;
