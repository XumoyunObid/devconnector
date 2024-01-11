import { Spinner,Button, Table } from "react-bootstrap";
import useFetch from "../Hooks/useFetch";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaUser, FaUserTie } from "react-icons/fa6";

const Dashboard = () => {
    const { data: profile, isLoading } = useFetch("/profile/me");

    return isLoading ? (
        <Spinner />
    ) : profile ? (
        <div className="container py-4">
            <h1 className="text-info display-3 fw-bold">Dashboard</h1>
            <p className="fs-4">
                <FaUser /> Welcome {profile.user.name}
            </p>
            <div className="d-flex gap-3">
                <Link
                    to={"edit-profile"}
                    className="bg-light px-3 py-2 text-decoration-none text-reset border"
                >
                    <span className="px-1 rounded-circle bg-info">
                        <FaUser />
                    </span>{" "}
                    Edit Profile
                </Link>
                <Link
                    to={"edit-profile"}
                    className="bg-light px-3 py-2 text-decoration-none text-reset border"
                >
                    <span className="px-1 rounded-circle bg-info">
                        <FaUserTie />
                    </span>{" "}
                    Add Experinece
                </Link>
                <Link
                    to={"edit-profile"}
                    className="bg-light px-3 py-2 text-decoration-none text-reset border"
                >
                    <span className="px-1 rounded-circle bg-info">
                        <FaGraduationCap />
                    </span>{" "}
                    Add Education
                </Link>
            </div>

            <div className="my-3">
                <h2>Experience Credentials</h2>
                <Table className="w-50">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                        </tr>
                    </thead>
                    {/* <tbody>
            <tr>
              <th></th>
              <th></th>
              <th></th> 
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th> 
            </tr>
          </tbody> */}
                </Table>
            </div>
            <div className="my-5">
                <h2>Education Credentials</h2>
                <Table className="w-50">
                    <thead>
                        <tr>
                            <th>School</th>
                            <th>Degree</th>
                            <th>Years</th>
                        </tr>
                    </thead>
                    {/* <tbody>
            <tr>
              <th></th>
              <th></th>
              <th></th> 
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th></th> 
            </tr>
          </tbody> */}
                </Table>
            </div>
            <Button variant="danger">
                <FaUser /> - Delete My Account
            </Button>
        </div>
    ) : (
        <>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to="/create-profile" className="btn btn-primary my-1">
                Create Profile
            </Link>
        </>
    );
};

export default Dashboard;
