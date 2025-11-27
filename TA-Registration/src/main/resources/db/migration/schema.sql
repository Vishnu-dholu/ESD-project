CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role VARCHAR(50) NOT NULL,
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE courses (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64),
  title VARCHAR(255),
  faculty_id BIGINT,
  CONSTRAINT fk_course_faculty FOREIGN KEY (faculty_id) REFERENCES users(id)
);

CREATE TABLE ta_applications (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  statement_of_purpose TEXT,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_taapp_student FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT fk_taapp_course FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE ta_assignments (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_taassign_student FOREIGN KEY (student_id) REFERENCES users(id),
  CONSTRAINT fk_taassign_course FOREIGN KEY (course_id) REFERENCES courses(id)
);
