const router = require("express").Router();
const mentorController = require("../controllers/mentor_controller");

/**
 * @swagger
 * tags:
 *   - name: Mentor
 *     description: Các API liên quan đến Mentor
 */

/**
 * @swagger
 * /mentor/create:
 *   post:
 *     summary: Tạo mentor mới
 *     description: |
 *       API dùng để tạo hồ sơ mentor.
 *       Mã mentor được sinh tự động theo format MT001 → MT999.
 *     tags:
 *       - Mentor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - HoTen
 *             properties:
 *               HoTen:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *               ChucVu:
 *                 type: string
 *                 example: "Software Engineer"
 *               NoiLamViec:
 *                 type: string
 *                 example: "FPT Software"
 *               ChuyenNganh:
 *                 type: string
 *                 example: "Công nghệ phần mềm"
 *               LinkLienHe:
 *                 type: string
 *                 example: "https://linkedin.com/in/abc"
 *               AnhDaiDien:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       201:
 *         description: Tạo mentor thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.post("/create", mentorController.createMentor);

/**
 * @swagger
 * /mentor:
 *   get:
 *     summary: Lấy danh sách mentor
 *     description: |
 *       Trả về danh sách tất cả mentor trong hệ thống.
 *     tags:
 *       - Mentor
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/", mentorController.getAllMentors);

/**
 * @swagger
 * /mentor/search:
 *   get:
 *     summary: Tìm kiếm mentor
 *     description: |
 *       Tìm mentor theo:
 *       - Họ tên
 *       - Chuyên ngành
 *       - Nơi làm việc
 *     tags:
 *       - Mentor
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *         example: "IT"
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/search", mentorController.searchMentor);

/**
 * @swagger
 * /mentor/{id}:
 *   get:
 *     summary: Xem chi tiết mentor
 *     description: |
 *       Lấy thông tin chi tiết mentor theo mã mentor (MTxxx).
 *     tags:
 *       - Mentor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MT001"
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Mentor không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.get("/:id", mentorController.getMentorById);

/**
 * @swagger
 * /mentor/{id}:
 *   put:
 *     summary: Cập nhật mentor
 *     description: |
 *       Cập nhật thông tin mentor theo mã mentor.
 *     tags:
 *       - Mentor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MT001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               HoTen:
 *                 type: string
 *                 example: "Nguyễn Văn B"
 *               ChucVu:
 *                 type: string
 *                 example: "Senior Developer"
 *               NoiLamViec:
 *                 type: string
 *                 example: "Google"
 *               ChuyenNganh:
 *                 type: string
 *                 example: "AI"
 *               LinkLienHe:
 *                 type: string
 *                 example: "https://linkedin.com/in/xyz"
 *               AnhDaiDien:
 *                 type: string
 *                 example: "https://firebasestorage.googleapis.com/..."
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Mentor không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.put("/:id", mentorController.updateMentor);

/**
 * @swagger
 * /mentor/{id}:
 *   delete:
 *     summary: Xóa mentor
 *     description: |
 *       Xóa mentor theo mã mentor.
 *     tags:
 *       - Mentor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "MT001"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Mentor không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete("/:id", mentorController.deleteMentor);

module.exports = router;
