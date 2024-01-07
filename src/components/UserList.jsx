import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        const usersWithPostsCount = response.data.map(async (user) => {
          const postsResponse = await axios.get(
            `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`
          );
          return {
            ...user,
            postsCount: postsResponse.data.length,
          };
        });

        Promise.all(usersWithPostsCount)
          .then((updatedUsers) => setUsers(updatedUsers))
          .catch((error) =>
            console.error("Error fetching posts count:", error)
          );
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div>
      <h1>User Directory</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>
              <div>
                <p>{user.name}</p>
                <p>Total Posts: {user.postsCount}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
