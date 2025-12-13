const UserService = require('../services/user_service');

exports.register = async (req, res) => {
  const { uid, email, username, role, school, avatar } = req.body;

  if (!uid || !username) {
    return res.status(400).json({ message: "Thiếu uid hoặc username" });
  }

  const result = await UserService.register({
    uid,
    email,
    username,
    role: role || 'student',
    school,
    avatar
  });

  if (!result) {
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }

  if (result.exists) {
    return res.status(409).json({ message: "User đã tồn tại" });
  }

  return res.status(201).json({
    message: "Đăng ký thành công",
    user: result
  });
};

exports.login = async (req, res) => {
  const uid = req.user.uid;

  const user = await UserService.getByUid(uid);
  if (!user) {
    return res.status(404).json({
      message: "Chưa có profile",
      hint: "Gọi /user/register"
    });
  }

  return res.status(200).json({
    message: "Đăng nhập thành công",
    user
  });
};

exports.getAll = async (req, res) => {
  const users = await UserService.getAll();
  return res.status(200).json(users);
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.uid !== id && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Không có quyền" });
  }

  const user = await UserService.getByUid(id);
  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  return res.json(user);
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.uid !== id && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Không có quyền" });
  }

  const result = await UserService.updateUser(id, req.body);
  if (!result) return res.status(400).json({ message: "Không có thay đổi" });

  return res.json({ message: "Cập nhật thành công" });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  if (req.user.uid === id) {
    return res.status(400).json({ message: "Không thể tự xóa mình" });
  }

  const result = await UserService.deleteUser(id);
  if (!result) return res.status(404).json({ message: "User không tồn tại" });

  return res.json({ message: "Xóa thành công" });
};

exports.getStudents = async (req, res) => {
  const rows = await UserService.getByRole('student');
  return res.json(rows);
};

exports.getAdmins = async (req, res) => {
  const rows = await UserService.getByRole('admin');
  return res.json(rows);
};
