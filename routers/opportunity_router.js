const router = require('express').Router();
const controller = require('../controllers/opportunity_controller');
const { verifyFirebaseToken, requireAdmin } = require('../middlewares/firebase_auth');

/**
 * @swagger
 * tags:
 *   name: Opportunity
 *   description: API quản lý cơ hội (học bổng, sự kiện, cuộc thi)
 */

/**
 * @swagger
 * /opportunity:
 *   get:
 *     summary: Lấy danh sách cơ hội
 *     tags: [Opportunity]
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /opportunity/{id}:
 *   get:
 *     summary: Lấy chi tiết cơ hội
 *     tags: [Opportunity]
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /opportunity/type/{type}:
 *   get:
 *     summary: Lọc cơ hội theo loại
 *     tags: [Opportunity]
 */
router.get('/type/:type', controller.getByType);

/**
 * @swagger
 * /opportunity:
 *   post:
 *     summary: Thêm 1 cơ hội (Admin)
 *     tags: [Opportunity]
 */
router.post('/', verifyFirebaseToken, requireAdmin, controller.createOpportunity);

/**
 * @swagger
 * /opportunity/bulk:
 *   post:
 *     summary: Thêm nhiều cơ hội cùng lúc (Admin)
 *     tags: [Opportunity]
 */
router.post('/bulk', verifyFirebaseToken, requireAdmin, controller.createManyOpportunities);

/**
 * @swagger
 * /opportunity/{id}:
 *   put:
 *     summary: Cập nhật cơ hội
 *     tags: [Opportunity]
 */
router.put('/:id', verifyFirebaseToken, requireAdmin, controller.updateOpportunity);

/**
 * @swagger
 * /opportunity/{id}:
 *   delete:
 *     summary: Xóa cơ hội
 *     tags: [Opportunity]
 */
router.delete('/:id', verifyFirebaseToken, requireAdmin, controller.deleteOpportunity);

module.exports = router;
