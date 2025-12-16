const BookmarkService = require("../services/bookmark_service");

// ===== Thêm bookmark =====
exports.addBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, MaTinTuc } = req.body;

        if (!MaNguoiDung || !MaTinTuc) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung hoặc MaTinTuc"
            });
        }

        const result = await BookmarkService.addBookmark(MaNguoiDung, MaTinTuc);

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (result.userNotFound) {
            return res.status(404).json({
                message: "User chưa tồn tại trong hệ thống"
            });
        }

        if (result.oppNotFound) {
            return res.status(404).json({
                message: "Opportunity không tồn tại"
            });
        }

        if (result.exists) {
            return res.status(409).json({
                message: "Opportunity đã được bookmark"
            });
        }

        return res.status(201).json({
            message: "Bookmark thành công"
        });

    } catch (error) {
        console.error("addBookmark:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== Bỏ bookmark =====
exports.removeBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, MaTinTuc } = req.body;

        if (!MaNguoiDung || !MaTinTuc) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung hoặc MaTinTuc"
            });
        }

        const result = await BookmarkService.removeBookmark(MaNguoiDung, MaTinTuc);

        if (result === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        if (!result) {
            return res.status(404).json({
                message: "Bookmark không tồn tại"
            });
        }

        return res.status(200).json({
            message: "Bỏ bookmark thành công"
        });

    } catch (error) {
        console.error("removeBookmark:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== Kiểm tra bookmark =====
exports.checkBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, MaTinTuc } = req.query;

        if (!MaNguoiDung || !MaTinTuc) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung hoặc MaTinTuc"
            });
        }

        const isSaved = await BookmarkService.isBookmarked(MaNguoiDung, MaTinTuc);

        if (isSaved === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json({
            bookmarked: isSaved
        });

    } catch (error) {
        console.error("checkBookmark:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ===== Lấy danh sách bookmark =====
exports.getBookmarksByUser = async (req, res) => {
    try {
        const { uid } = req.params;

        if (!uid) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung"
            });
        }

        const rows = await BookmarkService.getBookmarksByUser(uid);

        if (rows === null) {
            return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.status(200).json({
            count: rows.length,
            bookmarks: rows
        });

    } catch (error) {
        console.error("getBookmarksByUser:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
