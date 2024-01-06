import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user:", error));

    axios
      .get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [userId]);

  return (
    <div>
      <Link to="/">Back to User Directory</Link>
      {user && (
        <div>
          <h2>{user.name}</h2>
          {/* Display user details and clock here */}
          {/* Display posts using the Post component */}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
