const db = require("../config/database");

class OpportunityService {

    // ================== CREATE ==================

    // Tạo 1 opportunity
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

            const [rows] = await db.query(
                "SELECT MaTinTuc FROM OPPORTUNITY ORDER BY MaTinTuc DESC LIMIT 1"
            );

            let lastId = rows.length > 0 ? rows[0].MaTinTuc : "";
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

    // Tạo nhiều opportunity (ADMIN – BULK INSERT)
    static async createManyOpportunities(list) {
        try {
            if (!Array.isArray(list) || list.length === 0) return null;

            const [rows] = await db.query(
                "SELECT MaTinTuc FROM OPPORTUNITY ORDER BY MaTinTuc DESC LIMIT 1"
            );

            let lastId = rows.length > 0 ? rows[0].MaTinTuc : "";

            const records = list.map(item => {
                lastId = this.createId(lastId);
                return {
                    MaTinTuc: lastId,
                    Title: item.Title,
                    Description: item.Description,
                    Content_url: item.Content_url,
                    Image_url: item.Image_url,
                    Type: item.Type,
                    Deadline: item.Deadline
                };
            });

            await db.query(
                "INSERT INTO OPPORTUNITY (MaTinTuc, Title, Description, Content_url, Image_url, Type, Deadline) VALUES ?",
                [records.map(r => Object.values(r))]
            );

            return records;
        } catch (error) {
            console.log("OpportunityService createManyOpportunities Error:", error);
            return null;
        }
    }

    // ================== READ ==================

    static async getAll() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY ORDER BY Created_at DESC"
            );
            return rows;
        } catch (error) {
            console.log("OpportunityService getAll Error:", error);
            return null;
        }
    }

    static async getById(MaTinTuc) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY WHERE MaTinTuc = ?",
                [MaTinTuc]
            );
            return rows[0] || null;
        } catch (error) {
            console.log("OpportunityService getById Error:", error);
            return null;
        }
    }

    static async getByType(type) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM OPPORTUNITY WHERE Type = ? ORDER BY Created_at DESC",
                [type]
            );
            return rows;
        } catch (error) {
            console.log("OpportunityService getByType Error:", error);
            return null;
        }
    }

    // ================== UPDATE ==================

    static async updateOpportunity(MaTinTuc, updateData) {
        try {
            const {
                Title,
                Description,
                Content_url,
                Image_url,
                Type,
                Deadline
            } = updateData;

            const [result] = await db.query(
                `UPDATE OPPORTUNITY 
                 SET Title = ?, Description = ?, Content_url = ?, Image_url = ?, Type = ?, Deadline = ?
                 WHERE MaTinTuc = ?`,
                [Title, Description, Content_url, Image_url, Type, Deadline, MaTinTuc]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.log("OpportunityService updateOpportunity Error:", error);
            return null;
        }
    }

    // ================== DELETE ==================

    static async deleteOpportunity(MaTinTuc) {
        try {
            const [result] = await db.query(
                "DELETE FROM OPPORTUNITY WHERE MaTinTuc = ?",
                [MaTinTuc]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.log("OpportunityService deleteOpportunity Error:", error);
            return null;
        }
    }

    // ================== UTIL ==================

    static createId(lastId) {
        if (!lastId) return "OP001";
        const num = parseInt(lastId.slice(2)) + 1;
        return "OP" + num.toString().padStart(3, "0");
    }
}

module.exports = OpportunityService;
