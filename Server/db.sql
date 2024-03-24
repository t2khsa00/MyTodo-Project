drop database if exists todo;

create database MyToDo;
use MyToDo;

create table task (
    id int primary key auto_increment,
    description varchar(255) not null,
    done boolean not null default false
);
 insert into task (description) values ('My task description');
 insert into task (description) values ('My task description 2');