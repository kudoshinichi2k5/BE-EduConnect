const db = require("../config/database");

class BookmarkService {

    // ===== Thêm bookmark =====
    static async addBookmark(MaNguoiDung, MaTinTuc) {
        try {
            // Check USER
            const userExists = await this.existedUser(MaNguoiDung);
            if (!userExists) return { userNotFound: true };

            // Check OPPORTUNITY
            const oppExists = await this.existedOpportunity(MaTinTuc);
            if (!oppExists) return { oppNotFound: true };

            const sql = `
                INSERT INTO BOOKMARK (MaNguoiDung, MaTinTuc)
                VALUES (?, ?)
            `;
            await db.query(sql, [MaNguoiDung, MaTinTuc]);
            return true;
            
        } catch (error) {
            // Duplicate PK (đã bookmark)
            if (error.code === 'ER_DUP_ENTRY') {
                return { exists: true };
            }
            console.error("BookmarkService.addBookmark:", error);
            return null;
        }
    }
    
    // ===== Xóa bookmark =====
    static async removeBookmark(MaNguoiDung, MaTinTuc) {
        try {
            const [result] = await db.query(
                "DELETE FROM BOOKMARK WHERE MaNguoiDung = ? AND MaTinTuc = ?",
                [MaNguoiDung, MaTinTuc]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("BookmarkService.removeBookmark:", error);
            return null;
        }
    }

    // ===== Kiểm tra đã bookmark chưa =====
    static async isBookmarked(MaNguoiDung, MaTinTuc) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM BOOKMARK WHERE MaNguoiDung = ? AND MaTinTuc = ?",
                [MaNguoiDung, MaTinTuc]
            );
            return rows.length > 0;
        } catch (error) {
            console.error("BookmarkService.isBookmarked:", error);
            return null;
        }
    }

    // ===== Lấy danh sách opportunity đã bookmark =====
    static async getBookmarksByUser(MaNguoiDung) {
        try {
            const [rows] = await db.query(
                `
                SELECT 
                    o.MaTinTuc,
                    o.Title,
                    o.Description,
                    o.Image_url,
                    o.Type,
                    o.Deadline,
                    b.Saved_at
                FROM BOOKMARK b
                JOIN OPPORTUNITY o ON b.MaTinTuc = o.MaTinTuc
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

    static async existedUser(uid) {
        const [rows] = await db.query(
            "SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?",
            [uid]
        );
        return rows.length > 0;
    }

    static async existedOpportunity(MaTinTuc) {
        const [rows] = await db.query(
            "SELECT MaTinTuc FROM OPPORTUNITY WHERE MaTinTuc = ?",
            [MaTinTuc]
        );
        return rows.length > 0;
    }
}

module.exports = BookmarkService;
