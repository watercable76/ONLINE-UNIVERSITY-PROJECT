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
      res.render("app/courses", {
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

exports.getInstructorCourse = (req, res, next) => {
  const courseId = req.params.courseId;

  getCourses()
    .then((courses) => {
      res.render("app/instructor-course", {
        course: courses.filter((x) => x.id.toString() === courseId.toString())[0],
        pageTitle: `Course ${courseId}`,
        path: "/instructor-course",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEnrolledCourses = (req, res, next) => {
  // const userId = "2"; //dummy
  const userId = req.params.userId;

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
      pageTitle: "Create Course",
      user: req.user,
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

    res.render("app/update-course", {
      path: "/instructor/courses/update",
      pageTitle: "Update the Course",
      course,
      user: req.user,
    });
  } catch (e) {
    console.log("exports.getUpdateInstructorCourse");
    console.log(e);
    res.redirect("/");
  }
};

exports.postUpdateInstructorCourse = async (req, res, next) => {
  console.log("course");

  try {
    const updatedCourse = req.body;

    console.log(updatedCourse);

    const stuff = await Course.findByIdAndUpdate(updatedCourse.id, {
      $set: {
        ...updatedCourse,
      },
    });
    updatedCourse;

    res.redirect("/instructor/courses");
  } catch (e) {
    console.log("exports.postUpdateInstructorCourse");
    console.log(e);
    res.redirect("/");
  }
};

exports.postDeleteInstructorCourse = async (req, res, next) => {

  try {
    const courseId = req.params.courseId;
    const result = await Course.deleteOne({_id: courseId}).then(result => console.log(result));
    
    res.redirect("/instructor/courses/");
  } catch (e) {
    console.log("exports.postDeleteInstructorCourse");
    console.log(e);
    res.redirect("/")
  }
}

exports.postCourseSignup = (req, res, next) => {
  const courseId = req.body.id;
  
  res.redirect('/user/enrolled-courses')
}
