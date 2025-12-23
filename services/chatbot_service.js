const { OpenRouter } = require("@openrouter/sdk");
require("dotenv").config();

class ChatbotService {

    static async askQuestion(question) {
        try {
            if (!question || question.trim() === "") {
                return null;
            }

            const openrouter = new OpenRouter({
                apiKey: process.env.OPENROUTER_API_KEY
            });

            const completion = await openrouter.chat.send({
                model: "allenai/olmo-3.1-32b-think:free",
                temperature: 0.4, // giảm lan man
                messages: [
                    {
                        role: "system",
                        content: `
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
                        `
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]
            });

            return completion?.choices?.[0]?.message?.content || null;

        } catch (error) {
            console.error("ChatbotService askQuestion Error:", error);
            return null;
        }
    }
}

module.exports = ChatbotService;
