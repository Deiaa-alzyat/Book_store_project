-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS liberary;
CREATE USER IF NOT EXISTS 'deiaa_samir'@'localhost' IDENTIFIED BY 'deiaasamirpwd';
GRANT ALL PRIVILEGES ON `liberary`.* TO 'deiaa_samir'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'deiaa_samir'@'localhost';
FLUSH PRIVILEGES;
