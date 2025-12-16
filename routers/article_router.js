// ===============================
// ARTICLE ROUTER
// Quản lý các bài viết định hướng:
// + Thêm bài viết
// + Thêm nhiều bài viết (seed dữ liệu)
// + Lấy danh sách
// + Xem chi tiết
// + Cập nhật
// + Xóa
// ===============================

const router = require("express").Router();
const articleController = require("../controllers/article_controller");

/**
 * @swagger
 * tags:
 *   name: Article
 *   description: Các API liên quan tới bài viết định hướng
 */

/**
 * @swagger
 * /article/create:
 *   post:
 *     summary: Tạo mới một bài viết
 *     description: API dùng để thêm một bài viết định hướng vào hệ thống.
 *     tags:
 *       - Article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Xu hướng ngành CNTT năm 2025"
 *               Content:
 *                 type: string
 *                 example: "Nội dung bài viết chi tiết..."
 *               Category:
 *                 type: string
 *                 example: "Career"
 *               Image_url:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *     responses:
 *       201:
 *         description: Tạo bài viết thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/create", articleController.createArticle);

/**
 * @swagger
 * /article/bulk:
 *   post:
 *     summary: Thêm nhiều bài viết cùng lúc
 *     description: |
 *       API dùng để thêm hàng loạt bài viết (10–20 bài)
 *       Phù hợp cho admin seed dữ liệu ban đầu.
 *     tags:
 *       - Article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               articles:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     Title:
 *                       type: string
 *                       example: "Học Data Science bắt đầu từ đâu?"
 *                     Content:
 *                       type: string
 *                       example: "Nội dung bài viết..."
 *                     Category:
 *                       type: string
 *                       example: "Education"
 *                     Image_url:
 *                       type: string
 *                       example: "https://example.com/image.png"
 *     responses:
 *       201:
 *         description: Thêm nhiều bài viết thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/bulk", articleController.bulkCreate);

/**
 * @swagger
 * /article:
 *   get:
 *     summary: Lấy danh sách tất cả bài viết
 *     description: API trả về danh sách các bài viết định hướng.
 *     tags:
 *       - Article
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/", articleController.getAll);

/**
 * @swagger
 * /article/{id}:
 *   get:
 *     summary: Lấy chi tiết bài viết
 *     description: API lấy thông tin chi tiết của một bài viết theo mã bài viết.
 *     tags:
 *       - Article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AR001"
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy bài viết
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/:id", articleController.getById);

/**
 * @swagger
 * /article/{id}:
 *   put:
 *     summary: Cập nhật bài viết
 *     description: API cập nhật thông tin bài viết theo mã bài viết.
 *     tags:
 *       - Article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AR001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Content:
 *                 type: string
 *               Category:
 *                 type: string
 *               Image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không có thay đổi
 *       500:
 *         description: Lỗi hệ thống
 */
router.put("/:id", articleController.update);

/**
 * @swagger
 * /article/{id}:
 *   delete:
 *     summary: Xóa bài viết
 *     description: API xóa bài viết theo mã bài viết.
 *     tags:
 *       - Article
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "AR001"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Xóa không thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete("/:id", articleController.delete);

module.exports = router;
