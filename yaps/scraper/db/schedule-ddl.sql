-- Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255)
);

-- Courses Table
CREATE TABLE Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(255) NOT NULL UNIQUE,
    course_name VARCHAR(255) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    days_of_week VARCHAR(255) NOT NULL
);

-- UserCourses Table
CREATE TABLE UserCourses (
    user_id INT,
    course_id INT,
    added_by_friend_id INT,
    date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (added_by_friend_id) REFERENCES Users(user_id)
);

-- Friends Table
CREATE TABLE Friends (
    user_id INT,
    friend_id INT,
    status ENUM('Pending', 'Accepted') NOT NULL DEFAULT 'Pending',
    date_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_accepted DATETIME,
    PRIMARY KEY(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (friend_id) REFERENCES Users(user_id)
);

-- AuditTrail Table
CREATE TABLE AuditTrail (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    friend_id INT,
    course_id INT,
    action VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (friend_id) REFERENCES Users(user_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);