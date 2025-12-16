const db = require("../config/database");

class OpportunityService {

    // ===== TẠO 1 OPPORTUNITY =====
    static async createOpportunity(data) {
        try {
            const {
                Title,
                Description,
                Content_url,
                Image_url,
                Type,
                Deadline
            } = data;

            // Lấy MaTinTuc cuối
            const [rows] = await db.query(
                "SELECT MaTinTuc FROM OPPORTUNITY ORDER BY MaTinTuc DESC LIMIT 1"
            );

            let lastId = "";
            if (rows.length > 0) {
                lastId = rows[0].MaTinTuc;
            }

            const nextId = this.createId(lastId);

            const record = {
                MaTinTuc: nextId,
                Title,
                Description,
                Content_url,
                Image_url,
                Type,
                Deadline
            };

            await db.query(
                "INSERT INTO OPPORTUNITY SET ?",
                [record]
            );

            return record;
        } catch (error) {
            console.log("OpportunityService createOpportunity Error:", error);
            return null;
        }
    }

    // ===== TẠO NHIỀU OPPORTUNITY (BULK INSERT) =====
    static async createMany(opportunities) {
        try {
            const [rows] = await db.query(
                "SELECT MaTinTuc FROM OPPORTUNITY ORDER BY MaTinTuc DESC LIMIT 1"
            );

            let lastId = rows.length > 0 ? rows[0].MaTinTuc : "";

            const records = opportunities.map(item => {
                lastId = this.createId(lastId);
                return [
                    lastId,
                    item.Title,
                    item.Description,
                    item.Content_url,
                    item.Image_url,
                    item.Type,
                    item.Deadline
                ];
            });

            await db.query(
                `INSERT INTO OPPORTUNITY 
                (MaTinTuc, Title, Description, Content_url, Image_url, Type, Deadline)
                VALUES ?`,
                [records]
            );

            return true;
        } catch (error) {
            console.log("OpportunityService createMany Error:", error);
            return null;
        }
    }

    // ===== LẤY TẤT CẢ =====
    static async getAll() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY ORDER BY Created_at DESC"
            );
            return rows;
        } catch (error) {
            console.log("OpportunityService getAll Error:", error);
        }
    }

    // ===== LẤY THEO ID =====
    static async getById(MaTinTuc) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY WHERE MaTinTuc = ?",
                [MaTinTuc]
            );
            return rows[0] || null;
        } catch (error) {
            console.log("OpportunityService getById Error:", error);
        }
    }

    // ===== LỌC THEO TYPE =====
    static async getByType(type) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY WHERE Type = ? ORDER BY Created_at DESC",
                [type]
            );
            return rows;
        } catch (error) {
            console.log("OpportunityService getByType Error:", error);
        }
    }

    // ===== UPDATE =====
    static async updateOpportunity(MaTinTuc, data) {
        try {
            const {
                Title,
                Description,
                Content_url,
                Image_url,
                Type,
                Deadline
            } = data;

            const [result] = await db.query(
                `UPDATE OPPORTUNITY 
                 SET Title = ?, Description = ?, Content_url = ?, Image_url = ?, Type = ?, Deadline = ?
                 WHERE MaTinTuc = ?`,
                [Title, Description, Content_url, Image_url, Type, Deadline, MaTinTuc]
            );

            if (result.affectedRows === 0) return false;
            return true;
        } catch (error) {
            console.log("OpportunityService updateOpportunity Error:", error);
            return null;
        }
    }

    // ===== DELETE =====
    static async deleteOpportunity(MaTinTuc) {
        try {
            const [result] = await db.query(
                "DELETE FROM OPPORTUNITY WHERE MaTinTuc = ?",
                [MaTinTuc]
            );
            if (result.affectedRows === 0) return false;
            return true;
        } catch (error) {
            console.log("OpportunityService deleteOpportunity Error:", error);
        }
    }

    // ===== TẠO ID =====
    static createId(lastId) {
        if (!lastId) return "OP001";
        const num = parseInt(lastId.slice(2)) + 1;
        return "OP" + num.toString().padStart(3, "0");
    }
}

module.exports = OpportunityService;
