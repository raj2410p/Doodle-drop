CREATE DATABASE notes_app;
USE notes_app;

CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL
);

INSERT INTO notes (title, contents) 
VALUES 
    ('First Note', 'This is the first note'),
    ('Second Note', 'This is the second note');
  
