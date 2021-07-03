"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for courses. */

class Lesson {
    /** Create a new lesson (from data), update db, return new course data.
     * 
     * Data should be { courseId, name, number, sheet, sound }
     * 
     * Returns { id, courseId, name, number, sheet, sound }
     */

    static async create(data) {
        const res = await db.query(
            `INSERT INTO Lesson (
                course_id
                name,
                number,
                sheet,
                sound)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, course_id AS "courseId", name, number, sheet, sound`,
            [
                data.course_id,
                data.name,
                data.number,
                data.sheet,
                data.sound,
            ]);

        let lesson = res.rows[0];
        return lesson;
    }

    /** Get all Lessons for a specific course.
     * 
     */

    static async getAll(courseId) {
        const res = await db.query(
            `SELECT course_id AS "courseId",
                    name,
                    number,
                    sheet,
                    sound
            FROM Lesson
            WHERE course_id = $1
            ORDER BY number DESC`,
            [courseId]);

        return res.rows;
    }

    /** Get a lesson from a specific course.
     * 
     */

    static async getLesson(courseId, number) {
        const res = await db.query(
            `SELECT course_id AS "courseId",
                    name,
                    number,
                    sheet,
                    sound
            FROM Lesson
            WHERE course_id = $1 AND number = $2`,
            [courseId, number],
        );

        const lesson = res.rows[0];
        return lesson;
    }

    /** update lesson with 'data' as a partial update.
     * 
     */

    static async update(name, courseId, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                course_id: "courseId",
                name: "name",
                number: "number",
                sheet: "sheet",
                sound: "sound"
            });
        const nameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE Lesson
                          SET ${setCols}
                          WHERE name = ${name} AND course_id = ${courseId}
                          RETURNING course_id AS "courseId",
                          name,
                          number,
                          sheet,
                          sound`;
        
        const res = await db.query(querySql, [...values, name, courseId]);
        const lesson = res.rows[0];

        if (!lesson) throw new NotFoundError(`No lesson ${name}`);

        return lesson;
    }

    /** Delete given lesson from database; returns undefined.
     * 
     */

    static async remove(name, courseId) {
        let res = await db.query(
            `DELETE
            FROM Lesson
            WHERE name = $1 AND course_id = $2,
            RETURNING name, course_id AS "courseId"`,
            [name, courseId],
        );
        const lesson = res.rows[0];

        if (!lesson) throw new NotFoundError(`No lesson ${name} found in course ${courseId}`);

        return lesson;
    }
}