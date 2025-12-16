const MentorService = require("../services/mentor_service");

// ===== CREATE =====
exports.createMentor = async (req, res) => {
    const result = await MentorService.createMentor(req.body);
    if (!result) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    res.status(201).json(result);
};

// ===== GET ALL =====
exports.getAllMentors = async (req, res) => {
    const rows = await MentorService.getAllMentors();
    if (!rows) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(rows);
};

// ===== GET BY ID =====
exports.getMentorById = async (req, res) => {
    const mentor = await MentorService.getMentorById(req.params.id);
    if (!mentor) {
        return res.status(404).json({ message: "Mentor không tồn tại" });
    }
    res.json(mentor);
};

// ===== SEARCH =====
exports.searchMentor = async (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    const rows = await MentorService.searchMentor(q);
    if (!rows) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json(rows);
};

// ===== UPDATE =====
exports.updateMentor = async (req, res) => {
    const result = await MentorService.updateMentor(req.params.id, req.body);
    if (result === null) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!result) {
        return res.status(404).json({ message: "Mentor không tồn tại" });
    }
    res.json({ message: "Cập nhật thành công" });
};

// ===== DELETE =====
exports.deleteMentor = async (req, res) => {
    const result = await MentorService.deleteMentor(req.params.id);
    if (result === null) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!result) {
        return res.status(404).json({ message: "Mentor không tồn tại" });
    }
    res.json({ message: "Xóa thành công" });
};
