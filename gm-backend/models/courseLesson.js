"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for course lessons. */

class CourseLesson {
    /** Create a new course lesson (from data), return new course lesson data.
     * 
     * Data should be { userId, courseId, lessonId, isCompleted }
     * 
     * Returns { id, userId, courseId, lessonId, isCompleted }
     */

    static async create(data) {
        const res = await db.query(
            `INSERT INTO Course_Lesson (user_id, course_id,
             lesson_id, is_completed)
             VALUES ($1, $2, $3, $4)
             RETURNING id, user_id AS "userId", course_id AS "courseId", lesson_id AS "lessonId", is_completed AS "isCompleted"`,
            [data.courseId, 
             data.lessonId]);

        let cl = res.rows[0];
        return cl;
    }

    /** Get all lessons for a course.
     * 
     */

    static async getAll(courseId) {
        const res = await db.query(
            `SELECT course_id AS "courseId",
            lesson_id AS "lessonId"
            FROM Course_Lesson 
            WHERE course_id = $1`,
            [courseId]);

        return res.rows;
    }

    /** Get all completed lessons by a user in a course. 
     * data should be { userId, courseId, isCompleted}
     */

    static async getAllComplete(data) {
        const res = await db.query(
            `SELECT user_id AS "userId",
            course_id AS "courseId"
            FROM Course_Lesson
            WHERE user_id = $1 AND course_id = $2 AND is_completed = $3`,
            [data.userId, data.courseId, data.isCompleted]);
        
        return res.rows;
    }

    /** PUT - mark a lesson as complete or incomplete by a user in a course.
     * data should be { userId, courseId, lessonId, isCompleted }
     */

    static async markComplete(data) {
        const res = await db.query(
            `UPDATE course_lesson
                SET is_completed
                WHERE user_id = $1 AND course_id = $2 AND lesson_id = $3
                RETURNING id,
                          user_id AS "userId",
                          course_id AS "courseId",
                          lesson_id AS "lessonId",
                          is_completed AS "isCompleted"`,
            [data.userId,
             data.courseId,
             data.lessonId,
             data.isCompleted]);
        const course_lesson = res.rows[0];

        if (!course_lesson) throw new NotFoundError(`No course_lesson for ${data.userId} ${data.courseId}:${data.lessonId}.`);

        return course_lesson;
    }

    /** Delete given course lesson from database, returns undefined.
     * data should be { userId, courseId, lessonId }
     */

    static async remove(data) {
        let res = await db.query(
            `DELETE
            FROM Course_Lesson
            WHERE user_id = $1 AND course_id = $2 AND lesson_id = $3`, 
            [data.userId, data.courseId, data.lessonId]);
        const cl = res.rows[0];

        if (!cl) throw new NotFoundError(`No course lesson for ${data.userId}: ${data.courseId}.${data.lessonId}`);

        return cl;
    }
}

module.exports = CourseLesson;