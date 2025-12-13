const db = require('../config/database');

class UserService {

  static async register(data) {
    try {
      const { uid, email, username, role = 'student', school = null, avatar = null } = data;

      const [exists] = await db.query(
        'SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?',
        [uid]
      );
      if (exists.length > 0) {
        return { exists: true };
      }

      const sql = `
        INSERT INTO USER (MaNguoiDung, Email, HoTen, Role, School, Avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(sql, [uid, email, username, role, school, avatar]);

      return { uid, email, username, role, school, avatar };
    } catch (err) {
      console.error("UserService.register:", err);
      return null;
    }
  }

  static async getByUid(uid) {
    try {
      const [rows] = await db.query(
        `SELECT 
          MaNguoiDung AS uid,
          Email AS email,
          HoTen AS username,
          Role AS role,
          School AS school,
          Avatar AS avatar
         FROM USER
         WHERE MaNguoiDung = ?`,
        [uid]
      );
      return rows[0] || null;
    } catch (err) {
      console.error("UserService.getByUid:", err);
      return null;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT 
          MaNguoiDung AS uid,
          Email AS email,
          HoTen AS username,
          Role AS role,
          School AS school,
          Avatar AS avatar
         FROM USER
         ORDER BY HoTen`
      );
      return rows;
    } catch (err) {
      console.error("UserService.getAll:", err);
      return null;
    }
  }

  static async updateUser(uid, data) {
    try {
      const fields = [];
      const values = [];

      if (data.username) {
        fields.push("HoTen = ?");
        values.push(data.username);
      }
      if (data.school !== undefined) {
        fields.push("School = ?");
        values.push(data.school);
      }
      if (data.avatar !== undefined) {
        fields.push("Avatar = ?");
        values.push(data.avatar);
      }
      if (data.role) {
        fields.push("Role = ?");
        values.push(data.role);
      }

      if (fields.length === 0) return false;

      const sql = `UPDATE USER SET ${fields.join(', ')} WHERE MaNguoiDung = ?`;
      values.push(uid);

      const [result] = await db.query(sql, values);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.updateUser:", err);
      return null;
    }
  }

  static async deleteUser(uid) {
    try {
      const [result] = await db.query(
        'DELETE FROM USER WHERE MaNguoiDung = ?',
        [uid]
      );
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.deleteUser:", err);
      return null;
    }
  }

  static async getByRole(role) {
    try {
      const [rows] = await db.query(
        `SELECT 
          MaNguoiDung AS uid,
          Email AS email,
          HoTen AS username,
          Role AS role,
          School AS school,
          Avatar AS avatar
         FROM USER
         WHERE Role = ?`,
        [role]
      );
      return rows;
    } catch (err) {
      console.error("UserService.getByRole:", err);
      return null;
    }
  }
}

module.exports = UserService;
