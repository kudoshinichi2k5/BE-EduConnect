const router = require("express").Router();
const chatbotController = require("../controllers/chatbot_controller");

/**
 * @swagger
 * tags:
 *   - name: Chatbot
 *     description: API Chatbot Gia sư AI (Gemini)
 */

/**
 * @swagger
 * /chatbot/ask:
 *   post:
 *     summary: Gửi câu hỏi cho chatbot AI
 *     description: |
 *       API cho phép người dùng gửi câu hỏi đến chatbot AI.
 *       Chatbot sẽ trả lời với vai trò là gia sư giáo dục trong ứng dụng EduConnect.
 *
 *       Lưu ý:
 *       - Trả lời bằng tiếng Việt
 *       - Không lưu lịch sử chat
 *       - Không yêu cầu đăng nhập (tạm thời)
 *     tags:
 *       - Chatbot
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 example: "Sự khác nhau giữa Công nghệ thông tin và Khoa học dữ liệu?"
 *     responses:
 *       200:
 *         description: Chatbot trả lời thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   example: "Nên học CNTT hay Data Science?"
 *                 answer:
 *                   type: string
 *                   example: "CNTT tập trung vào phát triển phần mềm..."
 *       400:
 *         description: Thiếu câu hỏi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu câu hỏi"
 *       500:
 *         description: Lỗi hệ thống hoặc AI không phản hồi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Chatbot không phản hồi"
 */

router.post("/ask", chatbotController.askChatbot);

module.exports = router;
