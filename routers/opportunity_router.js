const router = require('express').Router();
const controller = require('../controllers/opportunity_controller');
const { verifyFirebaseToken, requireAdmin } = require('../middlewares/firebase_auth');

/**
 * @swagger
 * tags:
 *   - name: Opportunity
 *     description: API quản lý Cơ hội (Học bổng / Cuộc thi / Sự kiện)
 */

/**
 * @swagger
 * /opportunity:
 *   get:
 *     summary: Lấy danh sách tất cả cơ hội
 *     tags:
 *       - Opportunity
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /opportunity/{id}:
 *   get:
 *     summary: Lấy chi tiết cơ hội
 *     tags:
 *       - Opportunity
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /opportunity/type/{type}:
 *   get:
 *     summary: Lọc theo loại
 *     tags:
 *       - Opportunity
 */
router.get('/type/:type', controller.getByType);

/**
 * @swagger
 * /opportunity:
 *   post:
 *     summary: Tạo cơ hội (Admin)
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 */
router.post('/', verifyFirebaseToken, requireAdmin, controller.create);

/**
 * @swagger
 * /opportunity/bulk:
 *   post:
 *     summary: Thêm cơ hội hàng loạt (Admin)
 *     description: |
 *       Dùng để import nhiều bài (20–50 bài) cùng lúc
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 */
router.post('/bulk', verifyFirebaseToken, requireAdmin, controller.bulkCreate);

/**
 * @swagger
 * /opportunity/{id}:
 *   put:
 *     summary: Cập nhật cơ hội (Admin)
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', verifyFirebaseToken, requireAdmin, controller.update);

/**
 * @swagger
 * /opportunity/{id}:
 *   delete:
 *     summary: Xóa cơ hội (Admin)
 *     tags:
 *       - Opportunity
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', verifyFirebaseToken, requireAdmin, controller.delete);

module.exports = router;
