CREATE DATABASE IF NOT EXISTS EDU_CONNECT_DB;
USE EDU_CONNECT_DB;

CREATE TABLE USER (
    MaNguoiDung VARCHAR(128) PRIMARY KEY,
    Email VARCHAR(150) UNIQUE,
    HoTen VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    Role ENUM('admin', 'student') DEFAULT 'student',
    School VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Avatar TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE MENTOR (
    MaMentor VARCHAR(5) PRIMARY KEY,
    HoTen VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    ChucVu VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    NoiLamViec VARCHAR(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    ChuyenNganh VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    LinkLienHe TEXT,
    AnhDaiDien TEXT,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OPPORTUNITY (
    MaTinTuc VARCHAR(5) PRIMARY KEY,
    Title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    Description TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Content_url TEXT NULL,
    Image_url TEXT,
    Type ENUM('scholarship', 'contest', 'event') NOT NULL,
    Deadline DATETIME,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ARTICLE (
    MaBaiViet VARCHAR(5) PRIMARY KEY,
    Title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    Content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Category VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    Image_url TEXT,
    Created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BOOKMARK (
    MaNguoiDung VARCHAR(128) NOT NULL,
    TargetId VARCHAR(10) NOT NULL,
    TargetType ENUM('opportunity', 'article') NOT NULL,
    Saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (MaNguoiDung, TargetId, TargetType),

    FOREIGN KEY (MaNguoiDung)
        REFERENCES USER(MaNguoiDung)
        ON DELETE CASCADE
);

