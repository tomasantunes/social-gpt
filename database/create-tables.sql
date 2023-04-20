CREATE TABLE posts (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    parent_id INT(11) NOT NULL,
    user_id INT(11) NOT NULL,
    content TEXT DEFAULT NULL,
    timeline VARCHAR(128) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE posts ADD COLUMN author VARCHAR(256) NOT NULL AFTER user_id;