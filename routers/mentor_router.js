const router = require("express").Router();
const mentorController = require("../controllers/mentor_controller");

/**
 * @swagger
 * tags:
 *   - name: Mentor
 *     description: API quản lý mentor
 */

/**
 * @swagger
 * /mentor/create:
 *   post:
 *     summary: Tạo mentor mới
 *     tags: [Mentor]
 */
router.post("/create", mentorController.createMentor);

/**
 * @swagger
 * /mentor:
 *   get:
 *     summary: Lấy danh sách mentor
 *     tags: [Mentor]
 */
router.get("/", mentorController.getAllMentors);

/**
 * @swagger
 * /mentor/search:
 *   get:
 *     summary: Tìm mentor theo từ khóa
 *     tags: [Mentor]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 */
router.get("/search", mentorController.searchMentor);

/**
 * @swagger
 * /mentor/{id}:
 *   get:
 *     summary: Xem chi tiết mentor
 *     tags: [Mentor]
 */
router.get("/:id", mentorController.getMentorById);

/**
 * @swagger
 * /mentor/{id}:
 *   put:
 *     summary: Cập nhật mentor
 *     tags: [Mentor]
 */
router.put("/:id", mentorController.updateMentor);

/**
 * @swagger
 * /mentor/{id}:
 *   delete:
 *     summary: Xóa mentor
 *     tags: [Mentor]
 */
router.delete("/:id", mentorController.deleteMentor);

module.exports = router;
