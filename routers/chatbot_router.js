const router = require("express").Router();
const chatbotController = require("../controllers/chatbot_controller");

/**
 * @swagger
 * tags:
 *   - name: Chatbot
 *     description: API Chatbot tư vấn học tập & nghề nghiệp
 */

/**
 * @swagger
 * /chatbot/ask:
 *   post:
 *     summary: Gửi câu hỏi tới chatbot AI
 *     description: |
 *       Chatbot sử dụng mô hình ngôn ngữ lớn (LLM) từ OpenRouter
 *       với model AllenAI OLMo 3.1 32B Think.
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
 *                 example: "Ngành Công nghệ thông tin cần học gì?"
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
 *                 answer:
 *                   type: string
 *       400:
 *         description: Thiếu câu hỏi
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/ask", chatbotController.askChatbot);

module.exports = router;
