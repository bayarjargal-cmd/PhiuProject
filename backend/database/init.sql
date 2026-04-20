CREATE DATABASE IF NOT EXISTS web_system;
USE web_system;

-- Contents table
CREATE TABLE IF NOT EXISTS contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content_type VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (username: admin, password: admin123)
INSERT INTO admins (username, password) VALUES ('admin', 'admin123');

-- Insert sample data
INSERT INTO contents (title, description, content_type) VALUES
('Welcome to Our System', 'This is a dynamic content management system built with Flask, MySQL, and Docker.', 'general'),
('About Us', 'We provide modern web development solutions using cutting-edge technologies.', 'about'),
('Our Services', 'Web development, Cloud solutions, API integration, and Database management.', 'services'),
('Contact Information', 'Email: info@example.com, Phone: +1234567890', 'contact');