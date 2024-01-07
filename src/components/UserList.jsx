import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-center my-10">User Directory</h1>
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
