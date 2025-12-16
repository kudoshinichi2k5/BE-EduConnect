const OpportunityService = require("../services/opportunity_service");

// ===== TẠO 1 OPPORTUNITY =====
exports.createOpportunity = async (req, res) => {
    try {
        const result = await OpportunityService.createOpportunity(req.body);
        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error createOpportunity:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== TẠO NHIỀU OPPORTUNITY =====
exports.createMany = async (req, res) => {
    try {
        const { opportunities } = req.body;
        if (!Array.isArray(opportunities)) {
            return res.status(400).json({ message: "opportunities phải là mảng" });
        }

        const result = await OpportunityService.createMany(opportunities);
        if (!result) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(201).json({ success: "Thêm danh sách thành công" });
    } catch (error) {
        console.error("Error createMany:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== GET ALL =====
exports.getAll = async (req, res) => {
    try {
        const rows = await OpportunityService.getAll();
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
    try {
        const row = await OpportunityService.getById(req.params.id);
        if (!row) return res.status(404).json({ message: "Not found" });
        res.status(200).json(row);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== GET BY TYPE =====
exports.getByType = async (req, res) => {
    try {
        const rows = await OpportunityService.getByType(req.params.type);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== UPDATE =====
exports.updateOpportunity = async (req, res) => {
    try {
        const result = await OpportunityService.updateOpportunity(
            req.params.id,
            req.body
        );

        if (result === null) return res.status(500).json({ error: "Internal Server Error" });
        if (result === false) return res.status(400).json({ message: "Không có thay đổi" });

        return res.status(200).json({ success: "Cập nhật thành công" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== DELETE =====
exports.deleteOpportunity = async (req, res) => {
    try {
        const result = await OpportunityService.deleteOpportunity(req.params.id);

        if (result === null) return res.status(500).json({ error: "Internal Server Error" });
        if (result === false) return res.status(400).json({ message: "Xóa không thành công" });

        return res.status(200).json({ success: "Xóa thành công" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
