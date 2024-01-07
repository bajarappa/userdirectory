import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Clock from "./Clock";
import Post from "./Post";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    // Fetch user details
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error("Error fetching user:", error));

    // Fetch user posts
    axios
      .get(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));

    // Fetch countries
    axios
      .get("http://worldtimeapi.org/api/timezone")
      .then((response) => setCountries(response.data))
      .catch((error) => console.error("Error fetching countries:", error));
  }, [userId]);

  const handlePostClick = (postId) => {
    const selectedPost = posts.find((post) => post.id === postId);
    setSelectedPost(selectedPost);
  };

  const closePopup = () => {
    setSelectedPost(null);
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  return (
    <div>
      <Link to="/">Back to User Directory</Link>
      {user && (
        <div>
          <h2>{user.name}</h2>

          {/* Upper Segment */}
          <div>
            <h3>Profile Page</h3>
            <label htmlFor="countrySelector">Select Country: </label>
            <select
              id="countrySelector"
              onChange={handleCountryChange}
              value={selectedCountry}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Clock selectedCountry={selectedCountry} />
          </div>

          {/* User Details */}
          <div>
            <h3>User Details</h3>
            <p>Name: {user.name}</p>
            <p>Username: {user.username}</p>
            <p>Catch Phrase: {user.company.catchPhrase}</p>
          </div>

          {/* Contact Information */}
          <div>
            <h3>Contact Information</h3>
            <p>
              Address: {user.address.city}, {user.address.street},{" "}
              {user.address.suite}
            </p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
          </div>

          {/* Posts */}
          <div>
            <h3>Posts</h3>
            <div>
              {posts.map((post) => (
                <Post
                  key={post.id}
                  title={post.title}
                  content={post.body}
                  onClick={() => handlePostClick(post.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Popup for Post Content */}
      {selectedPost && (
        <div className="popup">
          <div className="popup-content">
            <button onClick={closePopup}>Close</button>
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.body}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
