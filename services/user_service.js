const db = require('../config/database');

class UserService {

  /**
   * Đăng ký user mới vào MySQL sau khi tạo tài khoản Firebase
   * @param {Object} data - {uid, email, username, role, school, avatar}
   * @returns {Object|null} - User info hoặc {exists: true, by: 'uid'/'email'} nếu đã tồn tại
   */
  static async register(data) {
    try {
      const { 
        uid, 
        email = '', 
        username = '', 
        role = 'student', 
        school = null, 
        avatar = null 
      } = data;

      // Validate uid
      if (!uid || uid.trim() === '') {
        console.error("UserService.register: uid is required");
        return null;
      }

      // Validate username
      if (!username || username.trim() === '') {
        console.error("UserService.register: username is required");
        return null;
      }

      // Validate role
      if (role && !['admin', 'student'].includes(role)) {
        console.error("UserService.register: invalid role");
        return null;
      }

      // Check UID exists
      const [existsByUid] = await db.query(
        'SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?',
        [uid]
      );
      if (existsByUid.length > 0) {
        return { exists: true, by: 'uid' };
      }

      // Check Email exists (chỉ check nếu email không rỗng)
      if (email && email.trim() !== '') {
        const [existsByEmail] = await db.query(
          'SELECT Email FROM USER WHERE Email = ?',
          [email]
        );
        if (existsByEmail.length > 0) {
          return { exists: true, by: 'email' };
        }
      }

      // Insert user vào database
      const sql = `
        INSERT INTO USER (MaNguoiDung, Email, HoTen, Role, School, Avatar)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const [result] = await db.query(sql, [
        uid, 
        email || null, 
        username, 
        role, 
        school, 
        avatar
      ]);

      // Verify insert thành công
      if (result.affectedRows === 0) {
        console.error("UserService.register: Insert failed");
        return null;
      }

      // Return user info
      return { 
        uid, 
        email: email || null, 
        username, 
        role, 
        school, 
        avatar 
      };
    } catch (err) {
      console.error("UserService.register:", err);
      return null;
    }
  }

  /**
   * Lấy user theo Firebase UID
   * @param {String} uid - Firebase UID
   * @returns {Object|null} - User info hoặc null nếu không tìm thấy
   */
  static async getByFirebaseUid(uid) {
    try {
      if (!uid || uid.trim() === '') {
        console.error("UserService.getByFirebaseUid: uid is required");
        return null;
      }

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
      
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("UserService.getByFirebaseUid:", err);
      return null;
    }
  }

  /**
   * Lấy tất cả users (thường dùng cho admin)
   * @returns {Array|null} - Danh sách users, [] nếu không có user nào
   */
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
         ORDER BY HoTen ASC`
      );
      return rows;
    } catch (err) {
      console.error("UserService.getAll:", err);
      return null;
    }
  }

  /**
   * Lấy user theo UID
   * @param {String} uid - Firebase UID
   * @returns {Object|null} - User info hoặc null nếu không tìm thấy
   */
  static async getUser(uid) {
    try {
      if (!uid || uid.trim() === '') {
        console.error("UserService.getUser: uid is required");
        return null;
      }

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
      
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("UserService.getUser:", err);
      return null;
    }
  }

  /**
   * Cập nhật thông tin user
   * @param {String} uid - Firebase UID
   * @param {Object} updateData - Dữ liệu cần update {username, role, school, email, avatar}
   * @returns {Boolean|null} - true nếu thành công, false nếu không có gì thay đổi, null nếu lỗi
   */
  static async updateUser(uid, updateData) {
    try {
      if (!uid || uid.trim() === '') {
        console.error("UserService.updateUser: uid is required");
        return null;
      }

      const sets = [];
      const params = [];

      // Build dynamic UPDATE query - chỉ update các field được truyền vào
      if (updateData.username !== undefined && updateData.username !== null) {
        sets.push("HoTen = ?");
        params.push(updateData.username);
      }

      if (updateData.role !== undefined && updateData.role !== null) {
        // Validate role
        if (!['admin', 'student'].includes(updateData.role)) {
          console.error("UserService.updateUser: invalid role");
          return null;
        }
        sets.push("Role = ?");
        params.push(updateData.role);
      }

      if (updateData.school !== undefined) {
        sets.push("School = ?");
        params.push(updateData.school);
      }

      if (updateData.email !== undefined) {
        sets.push("Email = ?");
        params.push(updateData.email);
      }

      if (updateData.avatar !== undefined) {
        sets.push("Avatar = ?");
        params.push(updateData.avatar);
      }

      // Không có gì để update
      if (sets.length === 0) {
        console.warn("UserService.updateUser: No fields to update");
        return false;
      }

      const sql = `UPDATE USER SET ${sets.join(", ")} WHERE MaNguoiDung = ?`;
      params.push(uid);

      const [result] = await db.query(sql, params);
      
      // affectedRows = 0 có thể do: uid không tồn tại hoặc data không thay đổi
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.updateUser:", err);
      
      // Check duplicate email error
      if (err.code === 'ER_DUP_ENTRY' && err.message.includes('Email')) {
        console.error("UserService.updateUser: Email already exists");
      }
      
      return null;
    }
  }

  /**
   * Xóa user khỏi database
   * @param {String} uid - Firebase UID
   * @returns {Boolean|null} - true nếu xóa thành công, false nếu user không tồn tại, null nếu lỗi
   * @note Các bản ghi liên quan trong BOOKMARK sẽ tự động bị xóa do ON DELETE CASCADE
   */
  static async deleteUser(uid) {
    try {
      if (!uid || uid.trim() === '') {
        console.error("UserService.deleteUser: uid is required");
        return null;
      }

      const [result] = await db.query(
        "DELETE FROM USER WHERE MaNguoiDung = ?",
        [uid]
      );
      
      // affectedRows = 0 nghĩa là user không tồn tại
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.deleteUser:", err);
      return null;
    }
  }

  /**
   * Cập nhật avatar của user
   * @param {String} uid - Firebase UID
   * @param {String} avatarUrl - URL avatar mới (thường là Firebase Storage URL)
   * @returns {Boolean|null} - true nếu thành công, false nếu user không tồn tại, null nếu lỗi
   */
  static async updateAvatar(uid, avatarUrl) {
    try {
      if (!uid || uid.trim() === '') {
        console.error("UserService.updateAvatar: uid is required");
        return null;
      }

      if (!avatarUrl || avatarUrl.trim() === '') {
        console.error("UserService.updateAvatar: avatarUrl is required");
        return null;
      }

      const [result] = await db.query(
        "UPDATE USER SET Avatar = ? WHERE MaNguoiDung = ?",
        [avatarUrl, uid]
      );
      
      return result.affectedRows > 0;
    } catch (err) {
      console.error("UserService.updateAvatar:", err);
      return null;
    }
  }

  /**
   * Lấy users theo role
   * @param {String} role - 'admin' hoặc 'student'
   * @returns {Array|null} - Danh sách users, [] nếu không có user nào, null nếu lỗi
   */
  static async getByRole(role) {
    try {
      if (!role || !['admin', 'student'].includes(role)) {
        console.error("UserService.getByRole: invalid role");
        return null;
      }

      const [rows] = await db.query(
        `SELECT 
          MaNguoiDung AS uid, 
          Email AS email, 
          HoTen AS username, 
          Role AS role, 
          School AS school,
          Avatar AS avatar 
         FROM USER 
         WHERE Role = ?
         ORDER BY HoTen ASC`,
        [role]
      );
      return rows;
    } catch (err) {
      console.error("UserService.getByRole:", err);
      return null;
    }
  }

  /**
   * Tìm kiếm users theo tên hoặc email
   * @param {String} keyword - Từ khóa tìm kiếm (tên hoặc email)
   * @returns {Array|null} - Danh sách users tìm được, [] nếu không tìm thấy, null nếu lỗi
   */
  static async searchUsers(keyword) {
    try {
      if (!keyword || keyword.trim() === '') {
        console.error("UserService.searchUsers: keyword is required");
        return [];
      }

      const searchTerm = `%${keyword}%`;
      const [rows] = await db.query(
        `SELECT 
          MaNguoiDung AS uid, 
          Email AS email, 
          HoTen AS username, 
          Role AS role, 
          School AS school,
          Avatar AS avatar 
         FROM USER 
         WHERE HoTen LIKE ? OR Email LIKE ?
         ORDER BY HoTen ASC
         LIMIT 50`,
        [searchTerm, searchTerm]
      );
      return rows;
    } catch (err) {
      console.error("UserService.searchUsers:", err);
      return null;
    }
  }

  /**
   * Đếm số lượng users theo role
   * @returns {Object|null} - {total, students, admins} hoặc null nếu lỗi
   */
  static async countByRole() {
    try {
      const [rows] = await db.query(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN Role = 'student' THEN 1 ELSE 0 END) as students,
          SUM(CASE WHEN Role = 'admin' THEN 1 ELSE 0 END) as admins
         FROM USER`
      );
      
      // Convert từ BigInt sang Number để tránh lỗi JSON serialize
      const result = rows[0];
      return {
        total: Number(result.total),
        students: Number(result.students),
        admins: Number(result.admins)
      };
    } catch (err) {
      console.error("UserService.countByRole:", err);
      return null;
    }
  }

  /**
   * Kiểm tra xem user có tồn tại không
   * @param {String} uid - Firebase UID
   * @returns {Boolean|null} - true nếu tồn tại, false nếu không, null nếu lỗi
   */
  static async exists(uid) {
    try {
      if (!uid || uid.trim() === '') {
        return false;
      }

      const [rows] = await db.query(
        'SELECT MaNguoiDung FROM USER WHERE MaNguoiDung = ?',
        [uid]
      );
      return rows.length > 0;
    } catch (err) {
      console.error("UserService.exists:", err);
      return null;
    }
  }

  /**
   * Kiểm tra xem email đã được sử dụng chưa
   * @param {String} email - Email cần check
   * @param {String} excludeUid - (Optional) Bỏ qua uid này khi check (dùng khi update)
   * @returns {Boolean|null} - true nếu email đã tồn tại, false nếu chưa, null nếu lỗi
   */
  static async isEmailTaken(email, excludeUid = null) {
    try {
      if (!email || email.trim() === '') {
        return false;
      }

      let sql = 'SELECT Email FROM USER WHERE Email = ?';
      const params = [email];

      // Nếu có excludeUid, bỏ qua user đó (dùng khi update email)
      if (excludeUid) {
        sql += ' AND MaNguoiDung != ?';
        params.push(excludeUid);
      }

      const [rows] = await db.query(sql, params);
      return rows.length > 0;
    } catch (err) {
      console.error("UserService.isEmailTaken:", err);
      return null;
    }
  }
}

module.exports = UserService;