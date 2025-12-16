const db = require('../config/database');

class OpportunityService {

  // ===== CREATE 1 =====
  static async create(data) {
    try {
      const {
        id,
        title,
        description,
        content_url,
        image_url,
        type,
        deadline
      } = data;

      const sql = `
        INSERT INTO OPPORTUNITY
        (MaTinTuc, Title, Description, Content_url, Image_url, Type, Deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await db.query(sql, [
        id,
        title,
        description,
        content_url,
        image_url,
        type,
        deadline
      ]);

      return true;
    } catch (err) {
      console.error("OpportunityService.create:", err);
      return null;
    }
  }

  // ===== BULK CREATE =====
  static async bulkCreate(list) {
    try {
      const values = list.map(item => [
        item.id,
        item.title,
        item.description,
        item.content_url,
        item.image_url,
        item.type,
        item.deadline
      ]);

      const sql = `
        INSERT INTO OPPORTUNITY
        (MaTinTuc, Title, Description, Content_url, Image_url, Type, Deadline)
        VALUES ?
      `;

      await db.query(sql, [values]);
      return values.length;
    } catch (err) {
      console.error("OpportunityService.bulkCreate:", err);
      return null;
    }
  }

  // ===== GET ALL =====
  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT * FROM OPPORTUNITY ORDER BY Created_at DESC`
      );
      return rows;
    } catch (err) {
      console.error("OpportunityService.getAll:", err);
      return null;
    }
  }

  // ===== GET BY ID =====
  static async getById(id) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM OPPORTUNITY WHERE MaTinTuc = ?`,
        [id]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("OpportunityService.getById:", err);
      return null;
    }
  }

  // ===== UPDATE =====
  static async update(id, data) {
    try {
      const fields = [];
      const values = [];

      if (data.title) {
        fields.push("Title = ?");
        values.push(data.title);
      }
      if (data.description !== undefined) {
        fields.push("Description = ?");
        values.push(data.description);
      }
      if (data.content_url !== undefined) {
        fields.push("Content_url = ?");
        values.push(data.content_url);
      }
      if (data.image_url !== undefined) {
        fields.push("Image_url = ?");
        values.push(data.image_url);
      }
      if (data.type) {
        fields.push("Type = ?");
        values.push(data.type);
      }
      if (data.deadline !== undefined) {
        fields.push("Deadline = ?");
        values.push(data.deadline);
      }

      if (fields.length === 0) return false;

      const sql = `
        UPDATE OPPORTUNITY
        SET ${fields.join(', ')}
        WHERE MaTinTuc = ?
      `;
      values.push(id);

      const [result] = await db.query(sql, values);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("OpportunityService.update:", err);
      return null;
    }
  }

  // ===== DELETE =====
  static async delete(id) {
    try {
      const [result] = await db.query(
        `DELETE FROM OPPORTUNITY WHERE MaTinTuc = ?`,
        [id]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("OpportunityService.delete:", err);
      return null;
    }
  }

  // ===== GET BY TYPE =====
  static async getByType(type) {
    try {
      const [rows] = await db.query(
        `SELECT * FROM OPPORTUNITY WHERE Type = ? ORDER BY Created_at DESC`,
        [type]
      );
      return rows;
    } catch (err) {
      console.error("OpportunityService.getByType:", err);
      return null;
    }
  }
}

module.exports = OpportunityService;
