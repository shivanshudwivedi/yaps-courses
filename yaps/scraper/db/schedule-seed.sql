-- Inserting Users
INSERT INTO Users (username, email, password, first_name, last_name)
VALUES ('akhargha', 'akhargha@scheduler.com', 'hashedpassword1', 'Anupam', 'Khargharia'),
       ('lmellitz', 'lmellitz@scheduler.com', 'hashedpassword2', 'Lily', 'Mellitz'),
       ('jdoe', 'jdoe@scheduler.com', 'hashedpassword3', 'John', 'Doe');

-- Inserting Courses
-- For days_of_week: 1 = Monday, 2 = Tuesday, ... , 7 = Sunday
-- Assuming DSA is on Monday and Wednesday, Film on Tuesday and Thursday, and Music on Wednesday
INSERT INTO Courses (course_code, course_name, start_time, end_time, days_of_week)
VALUES ('101', 'Data Structures and Algorithms', '09:00', '10:30', '1,3'),
       ('102', 'Intro to Film-making', '11:00', '12:30', '2,4'),
       ('103', 'Basic Musicianship', '02:00', '03:30', '1,3');

-- Anupam has DSA and Film
-- Lily has Film and Music
-- John has just DSA
INSERT INTO UserCourses (user_id, course_id)
VALUES (1, 1),
       (1, 2),
       (2, 2),
       (2, 3),
       (3, 1);

-- Anupam and Lily are friends
-- John sent a friend request to Lily, but they're not friends yet
INSERT INTO Friends (user_id, friend_id, status)
VALUES (1, 2, 'Accepted'),
       (3, 2, 'Pending');

-- John added Film to Anupam's schedule
INSERT INTO AuditTrail (user_id, friend_id, course_id, action)
VALUES (1, 3, 2, 'Added Course');