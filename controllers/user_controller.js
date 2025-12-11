const UserService = require('../services/user_service');

exports.register = async (req, res) => {
  try {
    const { uid, email, username, role, school, avatar } = req.body;

    if (!uid || !username)
      return res.status(400).json({ message: "Thiếu uid hoặc username" });

    const result = await UserService.register({ uid, email, username, role, school, avatar });

    if (result === null)
      return res.status(500).json({ error: "Internal Server Error" });

    if (result.exists)
      return res.status(409).json({ message: "User đã tồn tại", by: result.by });

    return res.status(201).json({ message: "Register success", user: result });

  } catch (err) {
    console.error("UserController.register:", err);
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await UserService.login(email, password);
    if (!user)
      return res.status(401).json({ message: "Sai email hoặc password" });

    return res.status(200).json(user);

  } catch (err) {
    console.error("UserController.login:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.getAll = async (req, res) => {
  try {
    const rows = await UserService.getAll();
    return res.status(200).json(rows);
  } catch (err) {
    console.error("UserController.getAll:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserService.getUser(id);

    if (!user)
      return res.status(404).json({ message: "User không tồn tại" });

    return res.status(200).json(user);

  } catch (err) {
    console.error("UserController.getUser:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.updateUser(id, req.body);

    if (result === null)
      return res.status(500).json({ error: "Internal Server Error" });

    if (!result)
      return res.status(400).json({ message: "Cập nhật thất bại" });

    return res.status(200).json({ message: "Cập nhật thành công" });

  } catch (err) {
    console.error("UserController.updateUser:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await UserService.deleteUser(id);

    if (result === null)
      return res.status(500).json({ error: "Internal Server Error" });

    if (!result)
      return res.status(400).json({ message: "Xóa không thành công" });

    return res.status(200).json({ message: "Xóa thành công" });

  } catch (err) {
    console.error("UserController.deleteUser:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;

    if (!avatar)
      return res.status(400).json({ message: "Thiếu avatar" });

    const result = await UserService.updateAvatar(id, avatar);

    if (result === null)
      return res.status(500).json({ error: "Internal Server Error" });

    if (!result)
      return res.status(400).json({ message: "Cập nhật avatar thất bại" });

    return res.status(200).json({ message: "Cập nhật avatar thành công" });

  } catch (err) {
    console.error("UserController.updateAvatar:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const rows = await UserService.getByRole('student');
    return res.status(200).json(rows);
  } catch (err) {
    console.error("UserController.getStudents:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const rows = await UserService.getByRole('admin');
    return res.status(200).json(rows);
  } catch (err) {
    console.error("UserController.getAdmins:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
