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
      <h1 className="text-4xl text-center my-10">Directory</h1>
      <ul className="grid grid-cols-1 md:grid-cols-3">
        {users.map((user) => (
          <li key={user.id} className="bg-gray-200 p-4 m-4 rounded-lg">
            <Link to={`/user/${user.id}`}>
              <div className="flex justify-between">
                <p>
                  Name: <span className="font-medium">{user.name}</span>{" "}
                </p>
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
