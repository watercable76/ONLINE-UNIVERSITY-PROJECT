const Product = require("../models/product");
const Order = require("../models/order");

// TODO: implement database here
const getCourses = async () => {
  return [
    {
      id: "1",
      image: "https://dummyimage.com/300",
      title: "title1",
      description: "description1",
      content: "content?1",
      maxStudents: 10,
      registeredStudents: ["1"],
    },
    {
      id: "2",
      image: "https://dummyimage.com/300",
      title: "title2",
      description: "description2",
      content: "content?2",
      maxStudents: 25,
      registeredStudents: ["1", "2"],
    },
    {
      id: "3",
      image: "https://dummyimage.com/300",
      title: "title3",
      description: "description3",
      content: "content?3",
      maxStudents: 15,
      registeredStudents: ["1", "2", "3"],
    },
  ];
};

exports.getIndex = async (req, res, next) => {
  // TODO: implement database
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
  console.log("Tried to render")
  res.render("app/teach-with-us", {
    path: "/user/teach-with-us",
    pageTitle: "Teach with Us",
  });
};

exports.postTeachWithUs = (req, res, next) => {
  // TODO: WRITE TO DB!

  console.log(req.body);
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
