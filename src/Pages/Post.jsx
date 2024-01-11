import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { FaThumbsDown, FaThumbsUp, FaX } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import useFetch from "../Hooks/useFetch";
import {
    deleteComment,
    deletePost,
    likePost,
    setPosts,
    unlikePost,
    updateComments,
} from "../Store/Slices/post";

const Post = () => {
    const { postId } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const posts = useSelector((store) => store.post.posts);
    const user = useSelector((store) => store.user);

    const post = posts.find((p) => p._id === postId);

    useEffect(() => {
        if (!post) {
            setIsLoading(true);
            axios
                .get(`/posts/${postId}`)
                .then(({ data }) => {
                    dispatch(setPosts([data]));
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [post, postId, dispatch]);

    async function handleLike() {
        const { data } = await axios.put(`/posts/like/${post._id}`);
        dispatch(likePost({ postId: post._id, likes: data }));
    }

    async function handleUnlike() {
        const { data } = await axios.put(`/posts/unlike/${post._id}`);
        dispatch(unlikePost({ postId: post._id, likes: data }));
    }

    async function handleDelete() {
        await axios.delete(`/posts/${post._id}`);
        dispatch(deletePost(postId));
        navigate("/posts");
    }

    async function handleAddComment(e) {
        e.preventDefault();

        if (!comment) return toast("Comment is required", { type: "error" });

        const { data } = await axios.post(`/posts/comment/${postId}`, {
            text: comment,
        });

        dispatch(updateComments({ postId, comments: data }));

        setComment("");
    }

    async function handleDeleteComment(commentId) {
        await axios.delete(`/posts/comment/${postId}/${commentId}`);

        dispatch(deleteComment({ commentId, postId }));
    }

    if (!postId) return <Navigate to="/posts" />;

    return isLoading ? (
        <Spinner />
    ) : (
        post && (
            <div className="container mt-5">
                <Link to="/posts">
                    <button className="btn btn-secondary">Back to Posts</button>
                </Link>
                <div className="card mt-3">
                    <div className="card-body d-flex align-items-center px-5 gap-5">
                        <div>
                            <img
                                src={post.avatar}
                                width={100}
                                className="rounded-circle"
                                alt=""
                            />
                            <h4 className="text-info">{post.name}</h4>
                        </div>
                        <div className="d-flex flex-column gap-3">
                            <div>
                                <h5>{post.text}</h5>
                                <small className="text-secondary">
                                    Posted on {post.date.slice(0, 10)}
                                </small>
                            </div>

                            <div className="d-flex gap-3">
                                <Button
                                    className="d-flex align-items-center"
                                    variant="light"
                                    disabled={post.likes.find(
                                        (like) => like.user === user?._id
                                    )}
                                    onClick={handleLike}
                                >
                                    <FaThumbsUp /> {post.likes.length}
                                </Button>
                                <Button
                                    variant="light"
                                    disabled={
                                        !post.likes.find(
                                            (like) => like.user === user?._id
                                        )
                                    }
                                    onClick={handleUnlike}
                                >
                                    <FaThumbsDown />
                                </Button>
                                <Button variant="primary">
                                    Disscuss {" "}
                                    <span className="px-1 bg-white text-primary rounded-1">{post.comments.length}</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                {post.user === user?._id && (
                    <Button variant="danger" onClick={handleDelete}>
                        <FaX />
                    </Button>
                )}
                <h3 className="my-2 bg-primary p-2 text-white">Leave a comment</h3>
                <div>
                    <Form
                        className="d-grid gap-3 my-3"
                        onSubmit={handleAddComment}
                    >
                        <Form.Control
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            as="textarea"
                            placeholder="Comment on Post"
                        />
                        <Button type="submit" variant="dark" className="w-25">
                            Submit
                        </Button>
                    </Form>
                </div>
                <ul className="list-group">
                    {post.comments.map((comment) => (
                        <li
                            key={comment._id}
                            className="list-group-item d-flex align-items-center gap-4 my-3 border"
                        >
                            <div className="d-flex flex-column px-5 text-center gap-2">
                                <img
                                    src={comment.avatar}
                                    width={100}
                                    className="rounded-circle"
                                    alt=""
                                />
                                <h4 className="text-info">{comment.name}</h4>
                            </div>
                            <div className="d-flex flex-column gap-3 align-items-start justify-content-center">
                                <h5>{comment.text}</h5>
                                <small className="text-secondary">
                                    Posted on {comment.date.slice(0, 10)}
                                </small>
                                {comment.user === user?._id && (
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleDeleteComment(comment._id)
                                    }
                                >
                                    <FaX />
                                </Button>
                            )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )
    );
};

export default Post;
