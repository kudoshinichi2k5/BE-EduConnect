const db = require("../config/database");

class ArticleService {

    // ===== TẠO ID BÀI VIẾT =====
    static createId(lastId) {
        if (!lastId) return "AR001";
        const num = parseInt(lastId.slice(2)) + 1;
        return "AR" + num.toString().padStart(3, "0");
    }

    // ===== CREATE 1 ARTICLE =====
    static async createArticle(data) {
        try {
            const { Title, Content, Category, Image_url } = data;

            const [rows] = await db.query(
                "SELECT MaBaiViet FROM ARTICLE ORDER BY MaBaiViet DESC LIMIT 1"
            );

            const lastId = rows.length ? rows[0].MaBaiViet : null;
            const newId = this.createId(lastId);

            const record = {
                MaBaiViet: newId,
                Title,
                Content,
                Category,
                Image_url
            };

            await db.query("INSERT INTO ARTICLE SET ?", [record]);
            return record;
        } catch (error) {
            console.log("ArticleService.createArticle Error:", error);
            return null;
        }
    }

    // ===== BULK CREATE =====
    static async bulkCreate(articles) {
        try {
            const [rows] = await db.query(
                "SELECT MaBaiViet FROM ARTICLE ORDER BY MaBaiViet DESC LIMIT 1"
            );

            let lastId = rows.length ? rows[0].MaBaiViet : null;
            const records = [];

            for (const item of articles) {
                lastId = this.createId(lastId);
                records.push([
                    lastId,
                    item.Title,
                    item.Content,
                    item.Category,
                    item.Image_url
                ]);
            }

            const sql = `
                INSERT INTO ARTICLE 
                (MaBaiViet, Title, Content, Category, Image_url)
                VALUES ?
            `;

            await db.query(sql, [records]);
            return records.length;
        } catch (error) {
            console.log("ArticleService.bulkCreate Error:", error);
            return null;
        }
    }

    // ===== GET ALL =====
    static async getAll() {
        try {
            const [rows] = await db.query(
                "SELECT * FROM ARTICLE ORDER BY Created_at DESC"
            );
            return rows;
        } catch (error) {
            console.log("ArticleService.getAll Error:", error);
            return null;
        }
    }

    // ===== GET BY ID =====
    static async getById(id) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM ARTICLE WHERE MaBaiViet = ?",
                [id]
            );
            return rows[0] || null;
        } catch (error) {
            console.log("ArticleService.getById Error:", error);
            return null;
        }
    }

    // ===== UPDATE =====
    static async update(id, data) {
        try {
            const { Title, Content, Category, Image_url } = data;

            const [result] = await db.query(
                `UPDATE ARTICLE 
                 SET Title = ?, Content = ?, Category = ?, Image_url = ?
                 WHERE MaBaiViet = ?`,
                [Title, Content, Category, Image_url, id]
            );

            return result.affectedRows > 0;
        } catch (error) {
            console.log("ArticleService.update Error:", error);
            return null;
        }
    }

    // ===== DELETE =====
    static async delete(id) {
        try {
            const [result] = await db.query(
                "DELETE FROM ARTICLE WHERE MaBaiViet = ?",
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            console.log("ArticleService.delete Error:", error);
            return null;
        }
    }
}

module.exports = ArticleService;
