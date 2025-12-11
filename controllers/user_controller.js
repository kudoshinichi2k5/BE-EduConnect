const UserService = require('../services/user_service');

/**
 * @desc    Đăng ký profile user vào MySQL sau khi tạo tài khoản Firebase
 * @route   POST /user/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { uid, email, username, role, school, avatar } = req.body;

    // Validate required fields
    if (!uid || !username) {
      return res.status(400).json({ 
        message: "Thiếu thông tin bắt buộc",
        required: ["uid", "username"]
      });
    }

    // Validate role
    if (role && !['admin', 'student'].includes(role)) {
      return res.status(400).json({ 
        message: "Role không hợp lệ. Chỉ chấp nhận: admin, student"
      });
    }

    const result = await UserService.register({ 
      uid, 
      email, 
      username, 
      role: role || 'student', 
      school, 
      avatar 
    });

    if (result === null) {
      return res.status(500).json({ error: "Lỗi hệ thống khi đăng ký" });
    }

    if (result.exists) {
      return res.status(409).json({ 
        message: "User đã tồn tại", 
        field: result.by 
      });
    }

    return res.status(201).json({ 
      message: "Đăng ký thành công", 
      user: result 
    });

  } catch (err) {
    console.error("UserController.register:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Lấy thông tin user sau khi verify Firebase token
 * @route   POST /user/login
 * @access  Public (có Firebase token)
 * @note    Firebase đã xử lý authentication, endpoint này chỉ lấy user info từ MySQL
 */
exports.login = async (req, res) => {
  try {
    // Firebase token đã được verify bởi middleware verifyFirebaseToken
    // req.user chứa decoded token với uid, email...
    const firebaseUid = req.user.uid;

    const user = await UserService.getByFirebaseUid(firebaseUid);
    
    if (!user) {
      return res.status(404).json({ 
        message: "User chưa tạo profile trong hệ thống",
        hint: "Vui lòng gọi /user/register để tạo profile"
      });
    }

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: user
    });

  } catch (err) {
    console.error("UserController.login:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Lấy tất cả users
 * @route   GET /user
 * @access  Admin only
 */
exports.getAll = async (req, res) => {
  try {
    const rows = await UserService.getAll();
    
    if (rows === null) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách user" });
    }

    return res.status(200).json({
      count: rows.length,
      users: rows
    });
  } catch (err) {
    console.error("UserController.getAll:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Lấy thông tin một user theo UID
 * @route   GET /user/:id
 * @access  Private (user chỉ xem được chính mình, admin xem được tất cả)
 */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.uid;
    const requesterRole = req.user.role;

    // Kiểm tra quyền: user chỉ xem được chính mình, admin xem được tất cả
    if (requesterId !== id && requesterRole !== 'admin') {
      return res.status(403).json({ 
        message: "Bạn không có quyền xem thông tin user này" 
      });
    }

    const user = await UserService.getUser(id);

    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    return res.status(200).json(user);

  } catch (err) {
    console.error("UserController.getUser:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Cập nhật thông tin user
 * @route   PUT /user/:id
 * @access  Private (user chỉ update chính mình, admin update được tất cả)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const requesterId = req.user.uid;
    const requesterRole = req.user.role;

    // Kiểm tra quyền
    if (requesterId !== id && requesterRole !== 'admin') {
      return res.status(403).json({ 
        message: "Bạn không có quyền cập nhật user này" 
      });
    }

    // Không cho user thường tự đổi role thành admin
    if (req.body.role && requesterId === id && requesterRole !== 'admin') {
      return res.status(403).json({ 
        message: "Bạn không có quyền thay đổi role của chính mình" 
      });
    }

    // Validate role nếu có
    if (req.body.role && !['admin', 'student'].includes(req.body.role)) {
      return res.status(400).json({ 
        message: "Role không hợp lệ. Chỉ chấp nhận: admin, student"
      });
    }

    const result = await UserService.updateUser(id, req.body);

    if (result === null) {
      return res.status(500).json({ error: "Lỗi khi cập nhật user" });
    }

    if (!result) {
      return res.status(400).json({ 
        message: "Cập nhật thất bại. User không tồn tại hoặc không có thay đổi" 
      });
    }

    return res.status(200).json({ 
      message: "Cập nhật thành công" 
    });

  } catch (err) {
    console.error("UserController.updateUser:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Xóa user
 * @route   DELETE /user/:id
 * @access  Admin only
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Không cho admin tự xóa chính mình
    if (req.user.uid === id) {
      return res.status(400).json({ 
        message: "Bạn không thể xóa chính mình" 
      });
    }

    const result = await UserService.deleteUser(id);

    if (result === null) {
      return res.status(500).json({ error: "Lỗi khi xóa user" });
    }

    if (!result) {
      return res.status(404).json({ 
        message: "User không tồn tại hoặc đã bị xóa" 
      });
    }

    return res.status(200).json({ 
      message: "Xóa user thành công" 
    });

  } catch (err) {
    console.error("UserController.deleteUser:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Cập nhật avatar
 * @route   PATCH /user/:id/avatar
 * @access  Private (user chỉ update chính mình)
 */
exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;
    const { avatar } = req.body;
    const requesterId = req.user.uid;

    if (!avatar) {
      return res.status(400).json({ message: "Thiếu URL avatar" });
    }

    // Kiểm tra quyền
    if (requesterId !== id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: "Bạn không có quyền cập nhật avatar của user này" 
      });
    }

    const result = await UserService.updateAvatar(id, avatar);

    if (result === null) {
      return res.status(500).json({ error: "Lỗi khi cập nhật avatar" });
    }

    if (!result) {
      return res.status(404).json({ 
        message: "User không tồn tại" 
      });
    }

    return res.status(200).json({ 
      message: "Cập nhật avatar thành công",
      avatar: avatar
    });

  } catch (err) {
    console.error("UserController.updateAvatar:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Lấy danh sách students
 * @route   GET /user/role/student
 * @access  Private
 */
exports.getStudents = async (req, res) => {
  try {
    const rows = await UserService.getByRole('student');
    
    if (rows === null) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách students" });
    }

    return res.status(200).json({
      count: rows.length,
      students: rows
    });
  } catch (err) {
    console.error("UserController.getStudents:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

/**
 * @desc    Lấy danh sách admins
 * @route   GET /user/role/admin
 * @access  Admin only
 */
exports.getAdmins = async (req, res) => {
  try {
    const rows = await UserService.getByRole('admin');
    
    if (rows === null) {
      return res.status(500).json({ error: "Lỗi khi lấy danh sách admins" });
    }

    return res.status(200).json({
      count: rows.length,
      admins: rows
    });
  } catch (err) {
    console.error("UserController.getAdmins:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
};