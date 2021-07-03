"use strict";

/** Routes for courses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Course = require("../models/courses");
const { createToken } = require("../helpers/tokens");
const courseNewSchema = require("../schemas/courseNew.json");
const courseUpdateSchema = require("../schemas/courseUpdate.json");

const router = express.Router();


/** POST / { course } => { course }
 * Adds a new course.
 * 
 * Returns new course:
 *  { id, name, level }
 * 
 * auth req: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
    try {
        const validator = jsonschema.validate(req.body, courseNewSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const course = await Course.create(req.body);
        return res.status(201).json({ course });
        
    } catch (err) {
        return next(err);
    }
})