const router = require("express").Router();
const bookmarkController = require("../controllers/bookmark_controller");

/**
 * @swagger
 * tags:
 *   - name: Bookmark
 *     description: API quản lý bookmark (lưu cơ hội)
 */

/**
 * @swagger
 * /bookmark/add:
 *   post:
 *     summary: Thêm bookmark
 *     tags:
 *       - Bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaNguoiDung
 *               - MaTinTuc
 *             properties:
 *               MaNguoiDung:
 *                 type: string
 *                 example: "abc123firebase"
 *               MaTinTuc:
 *                 type: string
 *                 example: "OP001"
 *     responses:
 *       201:
 *         description: Bookmark thành công
 *       409:
 *         description: Đã bookmark
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/add", bookmarkController.addBookmark);

/**
 * @swagger
 * /bookmark/remove:
 *   delete:
 *     summary: Bỏ bookmark
 *     tags:
 *       - Bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - MaNguoiDung
 *               - MaTinTuc
 *             properties:
 *               MaNguoiDung:
 *                 type: string
 *                 example: "abc123firebase"
 *               MaTinTuc:
 *                 type: string
 *                 example: "OP001"
 *     responses:
 *       200:
 *         description: Bỏ bookmark thành công
 *       404:
 *         description: Bookmark không tồn tại
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete("/remove", bookmarkController.removeBookmark);

/**
 * @swagger
 * /bookmark/user/{uid}:
 *   get:
 *     summary: Lấy danh sách cơ hội đã bookmark
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *           example: "abc123firebase"
 *     responses:
 *       200:
 *         description: Danh sách bookmark
 *       400:
 *         description: Thiếu uid
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/user/:uid", bookmarkController.getBookmarksByUser);

/**
 * @swagger
 * /bookmark/check:
 *   get:
 *     summary: Kiểm tra đã bookmark hay chưa
 *     tags:
 *       - Bookmark
 *     parameters:
 *       - in: query
 *         name: MaNguoiDung
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: MaTinTuc
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái bookmark
 *       400:
 *         description: Thiếu dữ liệu
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/check", bookmarkController.checkBookmark);

module.exports = router;
