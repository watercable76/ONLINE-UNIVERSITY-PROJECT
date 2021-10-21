const Product = require("../models/product");
const Order = require("../models/order");
const Course = require("../models/course");
const InstructorRequest = require("../models/instructor-request");

// TODO: implement database here
const getCourses = async () => {
  return await Course.find();
};

exports.getIndex = async (req, res, next) => {
  getCourses()
    .then((courses) => {
      res.render("app/index", {
        courses: courses && courses.slice(0, 2),
        pageTitle: "Home",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCourses = (req, res, next) => {
  getCourses()
    .then((courses) => {
      res.render("app/course-list", {
        courses,
        pageTitle: "All Courses",
        path: "/courses",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCourse = (req, res, next) => {
  const courseId = req.params.courseId;

  getCourses()
    .then((courses) => {
      res.render("app/course-detail", {
        course: courses.filter((x) => x.id.toString() === courseId.toString())[0],
        pageTitle: `Course ${courseId}`,
        path: "/course-detail",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEnrolledCourses = (req, res, next) => {
  const userId = "2"; //dummy

  getCourses()
    .then((courses) => {
      res.render("app/enrolled-courses", {
        path: "/user/enrolled-courses",
        pageTitle: "My Enrolled Courses",
        courses: courses.filter((x) => x.registeredStudents.includes(userId)),
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getTeachWithUs = (req, res, next) => {
  res.render("app/teach-with-us", {
    path: "/user/teach-with-us",
    pageTitle: "Teach with Us",
    user: req.user,
  });
};

// TODO: UPDATE ROLE BASED AUTH (+ add rights to admins)
exports.postTeachWithUs = async (req, res, next) => {
  try {
    const newInstructorRequest = new InstructorRequest(req.body);

    await newInstructorRequest.save();

    res.redirect("/");
  } catch (e) {
    console.log("exports.postTeachWithUs");
    console.log(e);
    res.redirect("/");
  }
};

exports.getInstructorCourses = async (req, res, next) => {
  try {

    const courses = await Course.find({ instructorId: req.user.id });
    
    res.render("app/instructor-courses", {
      path: "/instructor/courses",
      pageTitle: "Your Courses",
      courses,
    });
  } catch (e) {
    console.log("exports.getInstructorCourses");
    console.log(e);
    res.redirect("/");
  }
};

exports.getCreateInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id });

    res.render("app/create-course", {
      path: "/instructor/courses/create",
      pageTitle: "Your Courses",
      courses,
    });
  } catch (e) {
    console.log("exports.getCreateInstructorCourses");
    console.log(e);
    res.redirect("/");
  }
};

exports.postCreateInstructorCourse = async (req, res, next) => {
  try {
    const newCourse = new Course(req.body);

    await newCourse.save();

    res.redirect("/instructor/courses");
  } catch (e) {
    console.log("exports.postCreateInstructorCourse");
    console.log(e);
    res.redirect("/");
  }
};

exports.getUpdateInstructorCourse = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);

    console.log(course);

    res.render("app/update-course", {
      path: "/instructor/courses/update",
      pageTitle: "Update the Course",
      course,
    });
  } catch (e) {
    console.log("exports.getUpdateInstructorCourse");
    console.log(e);
    res.redirect("/");
  }
};

exports.postUpdateInstructorCourse = async (req, res, next) => {
  try {
    const updatedCourse = req.body;
    
    await Course.findByIdAndUpdate(updatedCourse.id, {
      $set: {
        ...updatedCourse,
      },
    });
    
    res.redirect("/instructor/courses");
  } catch (e) {
    console.log("exports.postUpdateInstructorCourse");
    console.log(e);
    res.redirect("/");
  }
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
