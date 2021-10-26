// local packages/files
const courses = require("../controllers/course");
const isAuth = require("../middleware/is-auth");
const isTeacher = require("../middleware/is-teacher");

// third party packages
const express = require("express");
const routes = express.Router();

routes.get("/", courses.getIndex);

routes.get("/home", courses.getIndex);

routes.get("/courses", courses.getCourses);

routes.post("/course-signup", courses.postCourseSignup);

routes.get("/courses/:courseId", courses.getCourse);

routes.get("/user/enrolled-courses", isAuth, courses.getEnrolledCourses);

routes.get("/user/teach-with-us", isAuth, courses.getTeachWithUs);

routes.post("/user/teach-with-us", isAuth, courses.postTeachWithUs);

routes.get("/instructor/courses", isAuth, isTeacher, courses.getInstructorCourses);

routes.get("/instructor/courses/create", isAuth, isTeacher, courses.getCreateInstructorCourses);

routes.get("/instructor/courses/:courseId", isAuth, isTeacher, courses.getInstructorCourse);

routes.post("/instructor/courses/create", isAuth, isTeacher, courses.postCreateInstructorCourse);

routes.get("/instructor/courses/update/:courseId", isAuth, isTeacher, courses.getUpdateInstructorCourse);

routes.post("/instructor/courses/update", isAuth, isTeacher, courses.postUpdateInstructorCourse);

routes.delete("/instructor/courses/delete/:courseId", isAuth, isTeacher, courses.postDeleteInstructorCourse);

module.exports = routes;
