const UserService = require('../services/user_service');

// POST /register
exports.register = async (req, res) => {
    try {
        const data = req.body;

        const result = await UserService.register(data);

        if (result?.exists)
            return res.status(409).json({ message: "Username đã tồn tại" });

        if (!result)
            return res.status(500).json({ error: "Internal Server Error" });

        return res.status(201).json({
            message: "Đăng ký thành công",
            id: result.id
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// POST /login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserService.login(username, password);

        if (!user)
            return res.status(401).json({ message: "Sai username hoặc password" });

        return res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// GET / (admin)
exports.getAll = async (req, res) => {
    try {
        const users = await UserService.getAll();
        res.status(200).json(users);
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET /:id
exports.getUser = async (req, res) => {
    try {
        const user = await UserService.getUser(req.params.id);

        if (!user)
            return res.status(404).json({ message: "User không tồn tại" });

        res.status(200).json(user);
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// PUT /:id
exports.updateUser = async (req, res) => {
    try {
        const result = await UserService.updateUser(req.params.id, req.body);

        if (!result)
            return res.status(400).json({ message: "Cập nhật thất bại" });

        res.status(200).json({ message: "Cập nhật thành công" });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// DELETE /:id
exports.deleteUser = async (req, res) => {
    try {
        const result = await UserService.deleteUser(req.params.id);

        if (!result)
            return res.status(400).json({ message: "Xóa không thành công" });

        res.status(200).json({ message: "Xóa thành công" });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// PATCH /:id/avatar
exports.updateAvatar = async (req, res) => {
    try {
        const { avatar } = req.body;
        const { id } = req.params;

        const result = await UserService.updateAvatar(id, avatar);

        if (!result)
            return res.status(400).json({ message: "Cập nhật avatar thất bại" });

        res.status(200).json({ message: "Cập nhật avatar thành công" });
    } catch {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// GET /role/student
exports.getStudents = async (req, res) => {
    const users = await UserService.getByRole("student");
    res.status(200).json(users);
};

// GET /role/admin
exports.getAdmins = async (req, res) => {
    const users = await UserService.getByRole("admin");
    res.status(200).json(users);
};
