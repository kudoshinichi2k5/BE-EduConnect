const ArticleService = require("../services/article_service");

// ===== CREATE 1 =====
exports.createArticle = async (req, res) => {
    const result = await ArticleService.createArticle(req.body);
    if (!result) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    return res.status(201).json(result);
};

// ===== BULK CREATE =====
exports.bulkCreate = async (req, res) => {
    const { articles } = req.body;

    if (!Array.isArray(articles)) {
        return res.status(400).json({ message: "articles phải là mảng" });
    }

    const count = await ArticleService.bulkCreate(articles);
    if (!count) {
        return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.status(201).json({
        message: "Thêm bài viết thành công",
        total: count
    });
};

// ===== GET ALL =====
exports.getAll = async (req, res) => {
    const rows = await ArticleService.getAll();
    return res.status(200).json(rows);
};

// ===== GET BY ID =====
exports.getById = async (req, res) => {
    const article = await ArticleService.getById(req.params.id);
    if (!article) {
        return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }
    return res.json(article);
};

// ===== UPDATE =====
exports.update = async (req, res) => {
    const result = await ArticleService.update(req.params.id, req.body);
    if (result === null) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    if (!result) {
        return res.status(400).json({ message: "Không có thay đổi" });
    }
    return res.json({ message: "Cập nhật thành công" });
};

// ===== DELETE =====
exports.delete = async (req, res) => {
    const result = await ArticleService.delete(req.params.id);
    if (!result) {
        return res.status(404).json({ message: "Xóa không thành công" });
    }
    return res.json({ message: "Xóa thành công" });
};
