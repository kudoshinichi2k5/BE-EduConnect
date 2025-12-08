const db = require('../config/database');

class UserService {

    // Đăng ký
    static async register(data) {
        try {
            const { username } = data;

            const [exists] = await db.query(
                "SELECT id FROM USERS WHERE username = ?",
                [username]
            );
            if (exists.length > 0) return { exists: true };

            const [result] = await db.query(
                "INSERT INTO USERS SET ?",
                [data]
            );

            return { id: result.insertId };
        } catch (error) {
            console.log("UserService register error:", error);
            return null;
        }
    }

    // Login
    static async login(username, password) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM USERS WHERE username = ? AND password = ?",
                [username, password]
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.log("UserService login error:", error);
        }
    }

    // Lấy danh sách user
    static async getAll() {
        try {
            const [rows] = await db.query("SELECT * FROM USERS");
            return rows;
        } catch (error) {
            console.log("UserService getAll error:", error);
        }
    }

    // Lấy chi tiết user
    static async getUser(id) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM USERS WHERE id = ?",
                [id]
            );
            return rows.length ? rows[0] : null;
        } catch (error) {
            console.log("UserService getUser error:", error);
        }
    }

    // Cập nhật thông tin user
    static async updateUser(id, data) {
        try {
            const [rows] = await db.query(
                "UPDATE USERS SET ? WHERE id = ?",
                [data, id]
            );
            return rows.affectedRows > 0;
        } catch (error) {
            console.log("UserService updateUser error:", error);
        }
    }

    // Xóa user
    static async deleteUser(id) {
        try {
            const [rows] = await db.query(
                "DELETE FROM USERS WHERE id = ?",
                [id]
            );
            return rows.affectedRows > 0;
        } catch (error) {
            console.log("UserService deleteUser error:", error);
        }
    }

    // Cập nhật avatar
    static async updateAvatar(id, avatarUrl) {
        try {
            const [rows] = await db.query(
                "UPDATE USERS SET avatar = ? WHERE id = ?",
                [avatarUrl, id]
            );
            return rows.affectedRows > 0;
        } catch (error) {
            console.log("UserService updateAvatar error:", error);
        }
    }

    // Lấy danh sách theo role
    static async getByRole(role) {
        try {
            const [rows] = await db.query(
                "SELECT * FROM USERS WHERE role = ?",
                [role]
            );
            return rows;
        } catch (error) {
            console.log("UserService getByRole error:", error);
        }
    }
}

module.exports = UserService;
