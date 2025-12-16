// Liên quan đến cơ hội học tập – học bổng – sự kiện – cuộc thi
// + Thêm cơ hội (1 hoặc nhiều)
// + Lấy danh sách
// + Lọc theo loại
// + Cập nhật
// + Xóa

const router = require('express').Router();
const opportunityController = require('../controllers/opportunity_controller');

/**
 * @swagger
 * tags:
 *   name: Opportunity
 *   description: Các API quản lý cơ hội (học bổng, sự kiện, cuộc thi)
 */

/**
 * @swagger
 * /opportunity/create:
 *   post:
 *     summary: Thêm một cơ hội
 *     description: |
 *       API dùng để thêm **một** cơ hội mới vào hệ thống.
 *       Phù hợp khi admin nhập tay từng bài.
 *     tags:
 *       - Opportunity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Title
 *               - Type
 *             properties:
 *               Title:
 *                 type: string
 *                 example: "Học bổng UIT 2025"
 *               Description:
 *                 type: string
 *                 example: "Học bổng dành cho sinh viên xuất sắc"
 *               Content_url:
 *                 type: string
 *                 example: "https://uit.edu.vn/scholarship"
 *               Image_url:
 *                 type: string
 *                 example: "https://example.com/image.png"
 *               Type:
 *                 type: string
 *                 enum: [scholarship, contest, event]
 *                 example: scholarship
 *               Deadline:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-31 23:59:59"
 *     responses:
 *       201:
 *         description: Thêm thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/create', opportunityController.createOpportunity);

/**
 * @swagger
 * /opportunity/createMany:
 *   post:
 *     summary: Thêm nhiều cơ hội cùng lúc (Admin)
 *     description: |
 *       API cho phép thêm **nhiều cơ hội cùng lúc**  
 *       Dùng khi admin import 10–20–50 bài một lần  
 *       (ví dụ: crawl dữ liệu, nhập file Excel).
 *     tags:
 *       - Opportunity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               opportunities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     Title:
 *                       type: string
 *                       example: "Cuộc thi AI Hackathon"
 *                     Description:
 *                       type: string
 *                     Content_url:
 *                       type: string
 *                     Image_url:
 *                       type: string
 *                     Type:
 *                       type: string
 *                       enum: [scholarship, contest, event]
 *                     Deadline:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Thêm danh sách thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi hệ thống
 */
router.post('/createMany', opportunityController.createMany);

/**
 * @swagger
 * /opportunity:
 *   get:
 *     summary: Lấy tất cả cơ hội
 *     description: |
 *       API trả về toàn bộ danh sách cơ hội  
 *       Sắp xếp theo thời gian tạo mới nhất.
 *     tags:
 *       - Opportunity
 *     responses:
 *       200:
 *         description: Danh sách cơ hội
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/', opportunityController.getAll);

/**
 * @swagger
 * /opportunity/{id}:
 *   get:
 *     summary: Lấy chi tiết một cơ hội
 *     description: Lấy thông tin chi tiết theo MaTinTuc
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     responses:
 *       200:
 *         description: Thành công
 *       404:
 *         description: Không tìm thấy
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/:id', opportunityController.getById);

/**
 * @swagger
 * /opportunity/type/{type}:
 *   get:
 *     summary: Lọc cơ hội theo loại
 *     description: |
 *       Lấy danh sách cơ hội theo loại:
 *       - scholarship
 *       - contest
 *       - event
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [scholarship, contest, event]
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.get('/type/:type', opportunityController.getByType);

/**
 * @swagger
 * /opportunity/{id}:
 *   put:
 *     summary: Cập nhật cơ hội
 *     description: Cập nhật thông tin cơ hội theo MaTinTuc
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Description:
 *                 type: string
 *               Content_url:
 *                 type: string
 *               Image_url:
 *                 type: string
 *               Type:
 *                 type: string
 *                 enum: [scholarship, contest, event]
 *               Deadline:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Không có thay đổi
 *       500:
 *         description: Lỗi hệ thống
 */
router.put('/:id', opportunityController.updateOpportunity);

/**
 * @swagger
 * /opportunity/{id}:
 *   delete:
 *     summary: Xóa cơ hội
 *     description: Xóa cơ hội theo MaTinTuc
 *     tags:
 *       - Opportunity
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "OP001"
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       400:
 *         description: Xóa không thành công
 *       500:
 *         description: Lỗi hệ thống
 */
router.delete('/:id', opportunityController.deleteOpportunity);

module.exports = router;
