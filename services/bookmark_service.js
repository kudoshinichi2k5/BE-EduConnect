const db = require("../config/database");

class BookmarkService {

    // ===== Thêm bookmark =====
    static async addBookmark(MaNguoiDung, TargetId, TargetType) {
        try {
            const userExists = await this.existedUser(MaNguoiDung);
            if (!userExists) return { userNotFound: true };

            const targetExists = await this.existedTarget(TargetId, TargetType);
            if (!targetExists) return { targetNotFound: true };

            const sql = `
                INSERT INTO BOOKMARK (MaNguoiDung, TargetId, TargetType)
                VALUES (?, ?, ?)
            `;
            await db.query(sql, [MaNguoiDung, TargetId, TargetType]);

            return true;

        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                return { exists: true };
            }
            console.error("BookmarkService.addBookmark:", error);
            return null;
        }
    }

    // ===== Xóa bookmark =====
    static async removeBookmark(MaNguoiDung, TargetId, TargetType) {
        try {
            const [result] = await db.query(
                `DELETE FROM BOOKMARK 
                 WHERE MaNguoiDung = ? AND TargetId = ? AND TargetType = ?`,
                [MaNguoiDung, TargetId, TargetType]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("BookmarkService.removeBookmark:", error);
            return null;
        }
    }

    // ===== Kiểm tra bookmark =====
    static async isBookmarked(MaNguoiDung, TargetId, TargetType) {
        try {
            const [rows] = await db.query(
                `SELECT 1 FROM BOOKMARK 
                 WHERE MaNguoiDung = ? AND TargetId = ? AND TargetType = ?`,
                [MaNguoiDung, TargetId, TargetType]
            );
            return rows.length > 0;
        } catch (error) {
            console.error("BookmarkService.isBookmarked:", error);
            return null;
        }
    }

    // ===== Lấy bookmark của user (gộp cả opportunity + article) =====
    static async getBookmarksByUser(MaNguoiDung) {
        try {
            const [rows] = await db.query(
                `
                SELECT 
                    b.TargetType,
                    b.TargetId,
                    b.Saved_at,

                    o.Title AS oppTitle,
                    o.Description AS oppDesc,
                    o.Image_url AS oppImage,
                    o.Type AS oppType,
                    o.Deadline,

                    a.Title AS articleTitle,
                    a.Category,
                    a.Image_url AS articleImage

                FROM BOOKMARK b
                LEFT JOIN OPPORTUNITY o
                    ON b.TargetType = 'opportunity'
                   AND b.TargetId = o.MaTinTuc
                LEFT JOIN ARTICLE a
                    ON b.TargetType = 'article'
                   AND b.TargetId = a.MaBaiViet
                WHERE b.MaNguoiDung = ?
                ORDER BY b.Saved_at DESC
                `,
                [MaNguoiDung]
            );
            return rows;
        } catch (error) {
            console.error("BookmarkService.getBookmarksByUser:", error);
            return null;
        }
    }

    // ===== Helpers =====
    static async existedUser(uid) {
        const [rows] = await db.query(
            "SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?",
            [uid]
        );
        return rows.length > 0;
    }

    static async existedTarget(TargetId, TargetType) {
        let sql = "";

        if (TargetType === "opportunity") {
            sql = "SELECT MaTinTuc FROM OPPORTUNITY WHERE MaTinTuc = ?";
        } else if (TargetType === "article") {
            sql = "SELECT MaBaiViet FROM ARTICLE WHERE MaBaiViet = ?";
        } else {
            return false;
        }

        const [rows] = await db.query(sql, [TargetId]);
        return rows.length > 0;
    }
}

module.exports = BookmarkService;
