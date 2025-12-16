const db = require("../config/database");

class MentorService {

    // ===== TẠO MÃ MENTOR =====
    static createId(lastId) {
        if (!lastId) return "MT001";
        const num = parseInt(lastId.slice(2)) + 1;
        return "MT" + num.toString().padStart(3, "0");
    }

    // ===== TẠO MENTOR =====
    static async createMentor(data) {
        try {
            const {
                HoTen,
                ChucVu,
                NoiLamViec,
                ChuyenNganh,
                LinkLienHe,
                AnhDaiDien
            } = data;

            const [rows] = await db.query(
                "SELECT MaMentor FROM MENTOR ORDER BY MaMentor DESC LIMIT 1"
            );

            const nextId = this.createId(rows[0]?.MaMentor);

            const record = {
                MaMentor: nextId,
                HoTen,
                ChucVu,
                NoiLamViec,
                ChuyenNganh,
                LinkLienHe,
                AnhDaiDien
            };

            await db.query("INSERT INTO MENTOR SET ?", record);
            return record;

        } catch (error) {
            console.error("MentorService.createMentor:", error);
            return null;
        }
    }

    // ===== LẤY TẤT CẢ MENTOR =====
    static async getAllMentors() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM MENTOR ORDER BY Created_at DESC"
            );
            return rows;
        } catch (error) {
            console.error("MentorService.getAllMentors:", error);
            return null;
        }
    }

    // ===== LẤY MENTOR THEO ID =====
    static async getMentorById(id) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM MENTOR WHERE MaMentor = ?",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.error("MentorService.getMentorById:", error);
            return null;
        }
    }

    // ===== SEARCH MENTOR =====
    static async searchMentor(keyword) {
        try {
            const like = `%${keyword}%`;
            const [rows] = await db.query(
                `SELECT * FROM MENTOR
                 WHERE HoTen LIKE ?
                 OR ChuyenNganh LIKE ?
                 OR NoiLamViec LIKE ?`,
                [like, like, like]
            );
            return rows;
        } catch (error) {
            console.error("MentorService.searchMentor:", error);
            return null;
        }
    }

    // ===== UPDATE =====
    static async updateMentor(id, data) {
        try {
            const [result] = await db.query(
                "UPDATE MENTOR SET ? WHERE MaMentor = ?",
                [data, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("MentorService.updateMentor:", error);
            return null;
        }
    }

    // ===== DELETE =====
    static async deleteMentor(id) {
        try {
            const [result] = await db.query(
                "DELETE FROM MENTOR WHERE MaMentor = ?",
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.error("MentorService.deleteMentor:", error);
            return null;
        }
    }
}

module.exports = MentorService;
