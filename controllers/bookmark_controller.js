const BookmarkService = require("../services/bookmark_service");

// ===== Thêm bookmark =====
exports.addBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, TargetId, TargetType } = req.body;

        if (!MaNguoiDung || !TargetId || !TargetType) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung, TargetId hoặc TargetType"
            });
        }

        const result = await BookmarkService.addBookmark(
            MaNguoiDung,
            TargetId,
            TargetType
        );

        if (result === null) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (result.userNotFound) {
            return res.status(404).json({ message: "User không tồn tại" });
        }

        if (result.targetNotFound) {
            return res.status(404).json({ message: "Target không tồn tại" });
        }

        if (result.exists) {
            return res.status(409).json({ message: "Đã bookmark" });
        }

        return res.status(201).json({ message: "Bookmark thành công" });

    } catch (error) {
        console.error("addBookmark:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ===== Bỏ bookmark =====
exports.removeBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, TargetId, TargetType } = req.body;

        if (!MaNguoiDung || !TargetId || !TargetType) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung, TargetId hoặc TargetType"
            });
        }

        const result = await BookmarkService.removeBookmark(
            MaNguoiDung,
            TargetId,
            TargetType
        );

        if (result === null) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (!result) {
            return res.status(404).json({ message: "Bookmark không tồn tại" });
        }

        return res.status(200).json({ message: "Bỏ bookmark thành công" });

    } catch (error) {
        console.error("removeBookmark:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ===== Kiểm tra bookmark =====
exports.checkBookmark = async (req, res) => {
    try {
        const { MaNguoiDung, TargetId, TargetType } = req.query;

        if (!MaNguoiDung || !TargetId || !TargetType) {
            return res.status(400).json({
                message: "Thiếu MaNguoiDung, TargetId hoặc TargetType"
            });
        }

        const bookmarked = await BookmarkService.isBookmarked(
            MaNguoiDung,
            TargetId,
            TargetType
        );

        if (bookmarked === null) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        return res.status(200).json({ bookmarked });

    } catch (error) {
        console.error("checkBookmark:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ===== Lấy danh sách bookmark =====
exports.getBookmarksByUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const rows = await BookmarkService.getBookmarksByUser(uid);

        if (rows === null) {
            return res.status(500).json({ message: "Internal Server Error" });
        }

        return res.status(200).json({
            count: rows.length,
            bookmarks: rows
        });

    } catch (error) {
        console.error("getBookmarksByUser:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
