-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/pFZY14

DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Course;
DROP TABLE IF EXISTS Lesson;
DROP TABLE IF EXISTS Course_Lesson;
DROP TABLE IF EXISTS Contact;

-- LEVEL 1 - User Info
CREATE TABLE "User" (
    "id" int NOT NULL,
    "username" varchar(20) NOT NULL,
    "first_name" text   NOT NULL,
    "last_name" text   NOT NULL,
    "password" varchar(20)   NOT NULL,
    "email" TEXT NOT NULL
    CHECK (position('@' IN "email") > 1),
    "is_admin" boolean   NOT NULL,
    CONSTRAINT "pk_User" PRIMARY KEY (
        "id"
     )
);

-- LEVEL 2 - Curriculum Content
CREATE TABLE "Course" (
    "id" int NOT NULL,
    "name" text   NOT NULL,
    "level" int   NOT NULL,
    CONSTRAINT "pk_Course" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Lesson" (
    "id" int NOT NULL,
    "course_id" int NOT NULL,
    "name" text   NOT NULL,
    "number" int   NOT NULL,
    "stanza" varchar   NOT NULL,
    "sound" varchar   NOT NULL,
    CONSTRAINT "pk_Lesson" PRIMARY KEY (
        "id"
     )
);

CREATE TABLE "Course_Lesson" (
    "id" int NOT NULL,
    "user_id" int   NOT NULL,
    "course_id" int   NOT NULL,
    "lesson_id" int   NOT NULL,
    "is_completed" boolean   NOT NULL,
    CONSTRAINT "pk_Course_Lesson" PRIMARY KEY (
        "id"
     )
);

-- LEVEL 3 - Contact Info
CREATE TABLE "Contact" (
    "id" int NOT NULL,
    "first_name" text   NOT NULL,
    "last_name" text   NOT NULL,
    "email" TEXT NOT NULL
    CHECK (position('@' IN "email") > 1),
    "message" text   NOT NULL,
    "is_handled" boolean NOT NULL,
    CONSTRAINT "pk_Contact" PRIMARY KEY (
        "id"
     )
);

ALTER TABLE "Lesson" ADD CONSTRAINT "fk_Lesson_course_id" FOREIGN KEY("course_id")
REFERENCES "Course" ("id");

ALTER TABLE "Course_Lesson" ADD CONSTRAINT "fk_Course_Lesson_user_id" FOREIGN KEY("user_id")
REFERENCES "User" ("id");

ALTER TABLE "Course_Lesson" ADD CONSTRAINT "fk_Course_Lesson_course_id" FOREIGN KEY("course_id")
REFERENCES "Course" ("id");

ALTER TABLE "Course_Lesson" ADD CONSTRAINT "fk_Course_Lesson_lesson_id" FOREIGN KEY("lesson_id")
REFERENCES "Lesson" ("id");

