require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {

    static async askQuestion(question) {
        try {
            if (!question || question.trim() === "") {
                return null;
            }

            // 1️⃣ Khởi tạo Gemini
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash"
            });

            // 2️⃣ Prompt hệ thống (RẤT QUAN TRỌNG)
            const prompt = `
Bạn là một gia sư AI trong ứng dụng EduConnect dành cho học sinh và sinh viên Việt Nam.

Nhiệm vụ của bạn:
- Trả lời bằng tiếng Việt
- Giải thích dễ hiểu, ngắn gọn
- Định hướng học tập và nghề nghiệp
- Không trả lời nội dung phản cảm, chính trị, bạo lực

Nếu câu hỏi không liên quan đến giáo dục:
→ Hãy lịch sự từ chối và gợi ý chủ đề học tập.

Câu hỏi của người dùng:
${question}
            `;

            // 3️⃣ Gửi câu hỏi cho Gemini
            const result = await model.generateContent(prompt);

            // 4️⃣ Lấy text trả về
            const response = result.response.text();

            return response;

        } catch (error) {
            console.error("ChatbotService askQuestion Error:", error);
            return null;
        }
    }
}

module.exports = ChatbotService;
