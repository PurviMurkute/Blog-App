import { model, Schema } from 'mongoose';

const BlogPostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
    },
    status: {
        type: String,
        enum: ["draft", "published"],
        default: "draft"
    },
    publishedAt: {
        type: Date
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
},
{
    timestamps: true
});

const BlogPost = model('BlogPost', BlogPostSchema);

export default BlogPost;