// local packages/files
const courses = require("../controllers/course");
const isAuth = require("../middleware/is-auth");

// third party packages
const express = require("express");
const routes = express.Router();

routes.get("/", courses.getIndex);

routes.get("/home", courses.getIndex);

routes.get("/courses", courses.getCourses);

routes.get("/courses/:courseId", courses.getCourse);

routes.get("/user/enrolled-courses", isAuth, courses.getEnrolledCourses);

routes.get("/user/teach-with-us", isAuth, courses.getTeachWithUs);

routes.post("/user/teach-with-us", isAuth, courses.postTeachWithUs);

// TODO:

routes.post("/cart-delete-item", isAuth, courses.postCartDeleteProduct);

routes.get("/orders", isAuth, courses.getOrders);

routes.post("/create-order", isAuth, courses.postOrder);

module.exports = routes;
