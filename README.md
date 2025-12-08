# BE-EduConnect
This repo stores code BE of project EduConnect

## PHẦN 1: CÀI ĐẶT DATABASE (MySQL)

### B1: Cài đặt MySQL Server
Nếu máy chưa có MySQL, cài đặt MySQL Server (hoặc XAMPP/WAMP cho nhanh).
- Link tải MySQL Installer: [Download tại đây](https://dev.mysql.com/downloads/installer/)

### B2: Kiểm tra file SQL
Đảm bảo bạn đã thấy file `database.sql` nằm trong thư mục gốc của dự án này.

### B3: Nhập dữ liệu (Import Database)
Mở **MySQL Command Line Client** (hoặc CMD/Terminal) và đăng nhập vào mysql. Sau đó chạy lần lượt các lệnh sau:

**B3.1**: Import bảng và dữ liệu từ file code
```
source <duong_dan_den_file_.sql>
```

**B3.2**: Kiểm tra lại xem database đã được thêm hay chưa?
```
show databases;
```

**B3.3**: Kiểm tra lại xem đã có bảng hay chưa?
```
show tables;
```

## PHẦN 2: CẤU HÌNH SERVER
### B1: Chỉnh sửa thông tin kết nối
Mở file server.js (hoặc db.js tùy cấu trúc), tìm đoạn mysql.createConnection:

```
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // <--- Sửa thành user MySQL của máy bạn (thường là root)
    password: '123',   // <--- QUAN TRỌNG: Sửa thành mật khẩu MySQL máy bạn (nếu không có pass thì để trống '')
    database: 'edu_connect'
});
```
- Lưu ý: Nếu sai mật khẩu ở bước này, Server sẽ báo lỗi "Access denied" và không chạy được.

## PHẦN 3: CHẠY BACKEND
Mở Terminal (hoặc CMD/PowerShell) tại thư mục chứa code và thực hiện tuần tự:

### B1: Cài đặt các thư viện (Dependencies)
Lệnh này sẽ tải về các thư viện cần thiết (express, mysql2, cors...) được khai báo trong package.json.

```
npm install
```

### B2: Chạy Server

```
node index.js
```

### B3: Kiểm tra hoạt động
Nếu Terminal hiện thông báo:

Server đang chạy tại http://localhost:5000 Đã kết nối thành công với MySQL

Thì hãy mở trình duyệt và vào thử link: http://localhost:5000/api/posts
