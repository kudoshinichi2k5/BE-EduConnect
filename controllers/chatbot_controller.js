const ChatbotService = require("../services/chatbot_service");

/**
 * Gửi câu hỏi cho chatbot AI
 * POST /api/chatbot/ask
 */
exports.askChatbot = async (req, res) => {
    try {
        const { question } = req.body;

        // 1️⃣ Validate input
        if (!question || question.trim() === "") {
            return res.status(400).json({
                message: "Thiếu câu hỏi"
            });
        }

        // 2️⃣ Gọi service
        const answer = await ChatbotService.askQuestion(question);

        // 3️⃣ Kiểm tra lỗi service
        if (!answer) {
            return res.status(500).json({
                message: "Chatbot không phản hồi"
            });
        }

        // 4️⃣ Thành công
        return res.status(200).json({
            question,
            answer
        });

    } catch (error) {
        console.error("ChatbotController Error:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống"
        });
    }
};
