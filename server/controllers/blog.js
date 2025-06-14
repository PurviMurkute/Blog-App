import BlogPost from "./../models/BlogPost.js";

const postBlogs = async (req, res) => {
  const { title, content, tags } = req.body;

  const author = req.user._id;

  const newBlog = new BlogPost({
    title,
    content,
    tags,
    author,
  });

  try {
    const savedBlogPost = await newBlog.save();

    res.status(201).json({
      success: true,
      data: savedBlogPost,
      message: "Blog post created successfully",
    });
  } catch (e) {
    res.status(400).json({
      success: false,
      data: null,
      message: e.message,
    });
  }
};

const getBlogs = async (req, res) => {
    const allBlogs = await BlogPost.find();

    return res.status(200).json({
        success: true,
        data: allBlogs,
        message: "Blogs fetched successfully" 
    })
}

export { 
    postBlogs,
    getBlogs
 };
