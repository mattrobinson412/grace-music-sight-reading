"use strict";

/** Routes for contacts. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Contact = require("../models/contact");
const { createToken } = require("../helpers/tokens");
const contactNewSchema = require("../schemas/contactNew.json");
const contactUpdateSchema = require("../schemas/contactUpdate.json");

const router = express.Router();


/** POST / { contact } ==> { contact } 
 * Adds a new contact. 
 * 
 * Returns new contact:
 * { firstName, lastName, email, message, isHandled }
 * 
 * Authorization required: admin
*/

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, contactNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const contact = await Contact.create(req.body);
        return res.status(201).json({ contact });

    } catch (err) {
        return next(err);
    }
});

/** GET / =>
 *  contacts: [ { firstName, lastName, email, message, isHandled }, ...]
 * 
 * Auth required: admin
 */

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const contacts = await Contact.getAll();
        return res.json({ contacts });

    } catch (err) {
        return next(err);
    }
});

/** GET /[email] ==> { contact }
 * 
 * Contact is { firstName, lastName, email, message, isHandled }
 * 
 * Auth required: admin
 */

router.get("/:email", async function (req, res, next) {
    try {
        const contact = await Contact.getContact(req.params.email);
        return res.json({ contact });

    } catch (err) {
        return next(err);
    }
});

/** PATCH /[email] { fld1, fld2, ... } ==> { contact } 
 * 
 * Patches contact data, primarily 'isHandled'.
 * 
 * fields can be: { isHandled }
 * 
 * Returns { id, firstName, lastName, email, message, isHandled }
 * 
 * auth required: admin
*/

router.patch(":/email", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, contactUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const contact = await Contact.update(req.params.email, req.body);
        return res.json({ contact });

    } catch (err) {
        return next(err);
    }
});

/** DELETE /[email] => { deleted: email }
 * 
 * Auth: admin
 */

router.delete("/:email", ensureAdmin, async function (req, res, next) {
    try {
        await Contact.remove(req.params.email);
        return res.json({ deleted: req.params.email });

    } catch (err) {
        return next(err);
    }
});

module.exports = router;