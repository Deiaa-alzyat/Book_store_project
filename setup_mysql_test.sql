-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS test_db;
CREATE USER IF NOT EXISTS 'deiaa_samir_test'@'localhost' IDENTIFIED BY 'deiaasamir_test_pwd';
GRANT ALL PRIVILEGES ON `test_db`.* TO 'deiaa_samir_test'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'deiaa_samir_test'@'localhost';
FLUSH PRIVILEGES;
