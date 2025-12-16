const OpportunityService = require('../services/opportunity_service');

// ===== CREATE 1 =====
exports.create = async (req, res) => {
  const result = await OpportunityService.create(req.body);
  if (!result) return res.status(500).json({ message: "Tạo thất bại" });
  return res.status(201).json({ message: "Tạo opportunity thành công" });
};

// ===== BULK CREATE =====
exports.bulkCreate = async (req, res) => {
  const list = req.body;
  if (!Array.isArray(list) || list.length === 0) {
    return res.status(400).json({ message: "Danh sách không hợp lệ" });
  }

  const count = await OpportunityService.bulkCreate(list);
  if (!count) return res.status(500).json({ message: "Bulk insert thất bại" });

  return res.status(201).json({
    message: "Thêm dữ liệu hàng loạt thành công",
    inserted: count
  });
};

// ===== GET ALL =====
exports.getAll = async (req, res) => {
  const rows = await OpportunityService.getAll();
  return res.json(rows);
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
  const item = await OpportunityService.getById(req.params.id);
  if (!item) return res.status(404).json({ message: "Không tìm thấy" });
  return res.json(item);
};

// ===== UPDATE =====
exports.update = async (req, res) => {
  const result = await OpportunityService.update(req.params.id, req.body);
  if (!result) return res.status(400).json({ message: "Không có thay đổi" });
  return res.json({ message: "Cập nhật thành công" });
};

// ===== DELETE =====
exports.delete = async (req, res) => {
  const result = await OpportunityService.delete(req.params.id);
  if (!result) return res.status(404).json({ message: "Không tồn tại" });
  return res.json({ message: "Xóa thành công" });
};

// ===== GET BY TYPE =====
exports.getByType = async (req, res) => {
  const rows = await OpportunityService.getByType(req.params.type);
  return res.json(rows);
};
