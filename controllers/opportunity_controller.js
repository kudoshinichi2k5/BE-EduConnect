const OpportunityService = require("../services/opportunity_service");

// ========== CREATE ONE ==========
exports.createOpportunity = async (req, res) => {
    try {
        const result = await OpportunityService.createOpportunity(req.body);
        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("createOpportunity Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ========== CREATE MANY (ADMIN) ==========
exports.createManyOpportunities = async (req, res) => {
    try {
        const result = await OpportunityService.createManyOpportunities(req.body);
        if (!result) {
            return res.status(400).json({ message: "Danh sách không hợp lệ" });
        }
        res.status(201).json(result);
    } catch (error) {
        console.error("createManyOpportunities Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ========== READ ==========
exports.getAll = async (req, res) => {
    const rows = await OpportunityService.getAll();
    res.json(rows);
};

exports.getById = async (req, res) => {
    const row = await OpportunityService.getById(req.params.id);
    if (!row) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(row);
};

exports.getByType = async (req, res) => {
    const rows = await OpportunityService.getByType(req.params.type);
    res.json(rows);
};

// ========== UPDATE ==========
exports.updateOpportunity = async (req, res) => {
    const result = await OpportunityService.updateOpportunity(req.params.id, req.body);
    if (result === null) return res.status(500).json({ error: "Internal Server Error" });
    if (!result) return res.status(400).json({ message: "Không có thay đổi" });
    res.json({ success: "Cập nhật thành công" });
};

// ========== DELETE ==========
exports.deleteOpportunity = async (req, res) => {
    const result = await OpportunityService.deleteOpportunity(req.params.id);
    if (result === null) return res.status(500).json({ error: "Internal Server Error" });
    if (!result) return res.status(400).json({ message: "Xóa không thành công" });
    res.json({ success: "Xóa thành công" });
};
