"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for Course. */

class Course {
/** Create a new course (from data), update db, return new course data.
     * 
     * Data should be { name, level }
     * 
     * Returns { id, name, level }
     **/

    static async create(data) {
        const res = await db.query(
            `INSERT INTO Course (name, level)
            VALUES ($1, $2)
            RETURNING id, name, level`,
            [data.name, data.level]);
        
        let course = res.rows[0];
        return course;
    }

    /** Get all Courses.
     * 
     */

    static async getAll() {
        const res = await db.query(
            `SELECT id, name, level
            FROM Course
            ORDER BY name DESC`,
        );

        return res.rows;
    }

    static async getCourse(name) {
        const res = await db.query(
            `SELECT id, name, level
            FROM Course
            WHERE name = $1`,
            [name],
        );

        const course = res.rows[0];
        return course;
    }

    /** Update course with 'data' as a partial update.
     * 
     */

    static async update(name, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                name: "name",
                level: "level"
            });
        const nameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE Course
                         SET ${setCols}
                         WHERE name = ${name}
                         RETURNING name`;
            
        const res = await db.query(querySql, [...values, name]);
        const course = res.rows[0];

        if (!course) throw new NotFoundError(`No course ${name}`);

        return course;
    }


    /** Delete given course from database; returns undefined. 
     * 
    */
    static async remove(name) {
        let res = await db.query(
            `DELETE
             FROM Course
             WHERE name = $1
             RETURNING name`,
             [name],
        );
        const course = res.rows[0];

        if (!course) throw new NotFoundError(`No course; ${name}`);

        return course;
    }
}

module.exports = Course;