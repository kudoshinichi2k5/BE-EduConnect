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
                messages: [
                    {
                        role: "system",
                        content: `
Bạn là một chatbot gia sư AI trong ứng dụng EduConnect dành cho học sinh, sinh viên Việt Nam.

Yêu cầu:
- Trả lời bằng tiếng Việt
- Giải thích dễ hiểu
- Tập trung giáo dục, học tập, định hướng nghề nghiệp
- Không trả lời nội dung nhạy cảm
                        `
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]
            });

            const answer =
                completion?.choices?.[0]?.message?.content || null;

            return answer;

        } catch (error) {
            console.error("ChatbotService askQuestion Error:", error);
            return null;
        }
    }
}

module.exports = ChatbotService;
