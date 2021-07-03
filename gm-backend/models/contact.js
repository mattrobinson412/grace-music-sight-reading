"use strict";

const db = require("../db");
const { NotFoundError} = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


/** Related functions for Contact. */

class Contact {
    /** Create a new contact (from data), update db, return new contact data.
     * 
     * Data should be { firstName, lastName, email, message, isHandled }
     * 
     * Returns { id, firstName, lastName, email, message, isHandled }
     **/

    static async create(data) {
        const res = await db.query(
            `INSERT INTO Contact (
                first_name,
                last_name,
                email,
                message,
                is_handled)
            VALUES ($1, $2, $3, $4)
            RETURNING id, first_name AS firstName, last_name AS lastName, email, message, is_handled AS "isHandled"`,
            [
                data.firstName,
                data.lastName,
                data.email,
                data.message,
                data.isHandled,
            ]);
        
        let contact = res.rows[0];
        return contact;
    }

    /** Get all Contact.
     * 
     */

    static async getAll() {
        const res = await db.query(
            `SELECT first_name AS "firstName",
            last_name AS "lastName",
            email,
            message,
            isHandled
            FROM Contact 
            ORDER BY lastName`,
        );

        return res.rows;
    }


/** Given an email, return data about that contact.
 * 
 */
    static async getContact(email) {
        const res = await db.query(
            `SELECT first_name AS "firstName",
            last_name AS "lastName",
            email,
            message,
            is_handled AS "isHandled"
            FROM Contact
            WHERE email = $1`,
            [email],
        );

        const contact = res.rows[0];
        return contact;
    }


    /** Update contact with 'data' as a partial update.
     * 
     */

    static async update(email, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                email: "email",
                message: "message",
                isHandled: "is_handled",
            });
        const emailVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE Contact
                            SET ${setCols}
                            WHERE email = ${email}
                            RETURNING first_name AS "firstName",
                                      last_name AS "lastName",
                                      email,
                                      is_handled AS "isHandled"`;
        
        const res = await db.query(querySql, [...values, email]);
        const contact =  res.rows[0];
        
        if (!contact) throw new NotFoundError(`No contact ${email}`);
      
        return contact;
    }

    /** Delete given contact from database; returns undefined. 
     * 
    */
    static async remove(email) {
        let res = await db.query(
            `DELETE 
             FROM Contact
             WHERE email = $1
             RETURNING email`,
             [email],
        );
        const contact = res.rows[0];

        if (!contact) throw new NotFoundError(`No contact: ${email}`);

        return contact;
    }
}

module.exports = Contact;