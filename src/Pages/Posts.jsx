import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import useFetch from "../Hooks/useFetch";
import { FaUser } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../Store/Slices/post";

const Posts = () => {
  const { data, isLoading } = useFetch("/posts");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPosts(data));
  }, [data, dispatch]);

  const posts = useSelector((store) => store.post.posts);

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!text) return toast("Text is required", { type: "error" });

    setLoading(true);
    try {
      const { data } = await axios.post("/posts", { text });
      dispatch(setPosts([data, ...posts]));
    } catch (error) {
      console.log(error);
      const errors = error?.response?.data?.errors;
      if (errors?.length > 0) {
        errors.forEach((err) => {
          toast(err.msg, { type: "error" });
        });
      }
    } finally {
      setLoading(false);
      setText("");
    }
  }

  return (
    <section>
      <Container>
        <h1 className="text-info display-4 fw-bold">Posts</h1>
        <p className="fs-4">
          <FaUser /> Welcome to the community
        </p>
        <p className="bg-info text-white py-3 fs-5 px-4">Say Something...</p>
        <Form className="d-grid gap-3 my-3" onSubmit={handleCreatePost}>
          <Form.Control
            value={text}
            onChange={(e) => setText(e.target.value)}
            as="textarea"
            placeholder="Create a Post"
          />
          <Button type="submit" className="w-25" variant="dark" disabled={loading}>
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </Form>
        {isLoading ? (
          <Spinner />
        ) : (
          posts && (
            <div>
              <ul className="p-0">
                {posts.map((post) => {
                  return (
                    <div className="card my-3" key={post._id}>
                      <div className="card-body">
                        <li className="list-group-item d-flex align-items-center px-5 gap-5">
                          <div className="d-flex flex-column align-items-center justify-content-center w-25 text-center gap-3">
                            <img
                              src={post.avatar}
                              width={100}
                              className="rounded-circle"
                              alt=""
                            />
                            <h4 className="text-info">{post.name}</h4>
                          </div>
                          <div className="d-flex flex-column gap-3">
                            <h5>{post.text}</h5>
                            <small className="text-secondary">Posted on {post.date.slice(0, 10)}</small>
                            <Link to={`/posts/${post._id}`}>
                            <button className="btn btn-primary text-light">
                              Disscussion {" "}
                                    <span className="px-1 bg-white text-primary rounded-1">{post.comments.length}</span>
                            </button>
                          </Link>
                          </div>
                          
                        </li>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
          )
        )}
      </Container>
    </section>
  );
};

export default Posts;
