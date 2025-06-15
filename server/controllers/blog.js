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
  const author = req.user?._id; //here safe navigation operator (?) is used that if user then give id else dont

  //if author is not provided, fetch all published blog
  //if author id is provided, fetch all published blogs and authors draft blogs also

  /* const allBlogs = await BlogPost.find();

    const filteredBlogs = allBlogs.filter((blog) => {
      if(blog.status === "published"){
        return true;
      }else if(author && blog.author.toString() === author.toString()){
        return true;
      }else{
        return false;
      }
    }) */

      let blogs = [];

      if(author){
        blogs = await BlogPost.find({
          $or: [
            {status: "published"},
            {status: "draft", author}
          ]
        }).populate("author", "_id name email")
      }else{
        blogs = await BlogPost.find({status: "published"}).populate("author", "_id name email")
      }

  if (blogs.length === 0) {
    return res.status(404).json({
      success: false,
      data: null,
      message: "No blogs found",
    });
  }

  return res.status(200).json({
    success: true,
    data: blogs,
    message: "Blogs fetched successfully",
  });
};

export { postBlogs, getBlogs };
