const db = require('../config/database');

class UserService {

  static async register(data) {
    try {
      const { uid, email = '', username = '', role = 'student', school = null, avatar = null } = data;

      // Check UID
      const [existsByUid] = await db.query(
        'SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?',
        [uid]
      );
      if (existsByUid.length > 0) return { exists: true, by: 'uid' };

      // Check Email
      if (email) {
        const [existsByEmail] = await db.query(
          'SELECT Email FROM USER WHERE Email = ?',
          [email]
        );
        if (existsByEmail.length > 0) return { exists: true, by: 'email' };
      }

      // Insert
      const sql = `
        INSERT INTO USER (MaNguoiDung, Email, Password, HoTen, Role, School, Avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(sql, [uid, email, '', username, role, school, avatar]);

      return { uid, email, username, role };
    } catch (err) {
      console.error("UserService.register:", err);
      return null;
    }
  }

  static async login(email, password) {
    try {
      const [rows] = await db.query(
        `SELECT MaNguoiDung AS uid, Email, HoTen AS username, Role, Avatar 
         FROM USER 
         WHERE Email = ? AND Password = ?`,
        [email, password]
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      console.error("UserService.login:", err);
      return null;
    }
  }

  static async getAll() {
    try {
      const [rows] = await db.query(
        `SELECT MaNguoiDung AS uid, Email, HoTen AS username, Role, School, Avatar 
         FROM USER`
      );
      return rows;
    } catch (err) {
      console.error("UserService.getAll:", err);
      return null;
    }
  }

  static async getUser(uid) {
    try {
      const [rows] = await db.query(
        `SELECT MaNguoiDung AS uid, Email, HoTen AS username, Role, School, Avatar 
         FROM USER 
         WHERE MaNguoiDung = ?`,
        [uid]
      );
      return rows.length ? rows[0] : null;
    } catch (err) {
      console.error("UserService.getUser:", err);
      return null;
    }
  }

  static async updateUser(uid, updateData) {
    try {
      const sets = [];
      const params = [];

      if (updateData.username) {
        sets.push("HoTen = ?");
        params.push(updateData.username);
      }

      if (updateData.role) {
        sets.push("Role = ?");
        params.push(updateData.role);
      }

      if (updateData.school !== undefined) {
        sets.push("School = ?");
        params.push(updateData.school);
      }

      if (updateData.email) {
        sets.push("Email = ?");
        params.push(updateData.email);
      }

      if (updateData.avatar) {
        sets.push("Avatar = ?");
        params.push(updateData.avatar);
      }

      if (sets.length === 0) return false;

      const sql = `UPDATE USER SET ${sets.join(", ")} WHERE MaNguoiDung = ?`;
      params.push(uid);

      const [result] = await db.query(sql, params);
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.updateUser:", err);
      return null;
    }
  }

  static async deleteUser(uid) {
    try {
      const [rs] = await db.query(
        "DELETE FROM USER WHERE MaNguoiDung = ?",
        [uid]
      );
      return rs.affectedRows > 0;
    } catch (err) {
      console.error("UserService.deleteUser:", err);
      return null;
    }
  }

  static async updateAvatar(uid, avatarUrl) {
    try {
      const [rs] = await db.query(
        "UPDATE USER SET Avatar = ? WHERE MaNguoiDung = ?",
        [avatarUrl, uid]
      );
      return rs.affectedRows > 0;
    } catch (err) {
      console.error("UserService.updateAvatar:", err);
      return null;
    }
  }

  static async getByRole(role) {
    try {
      const [rows] = await db.query(
        `SELECT MaNguoiDung AS uid, Email, HoTen AS username, Role, Avatar 
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
