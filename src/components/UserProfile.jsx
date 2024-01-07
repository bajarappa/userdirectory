import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Clock from "./Clock";
import Post from "./Post";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/users/${userId}`
        );
        setUser(userResponse.data);

        const postsResponse = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
        );
        setPosts(postsResponse.data);

        const countriesResponse = await axios.get(
          "http://worldtimeapi.org/api/timezone"
        );
        const uniqueCountries = Array.from(
          new Set(
            countriesResponse.data.map((timezone) => timezone.split("/")[0])
          )
        );
        setCountries(uniqueCountries);

        // Set default country based on user's location
        const userCountry =
          user && user.address.geo.lat > 0
            ? "Northern Hemisphere"
            : "Southern Hemisphere";
        setSelectedCountry(userCountry);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserDetails();
  }, [userId, user]);

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
      {user && (
        <div>
          {/* Upper Segment */}
          <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-gray-200 m-4 p-4 rounded-lg">
            <div className="flex gap-4">
              <Link to="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold">User Profile</h1>
            </div>
            <select
              id="countrySelector"
              onChange={handleCountryChange}
              value={selectedCountry}
            >
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>{" "}
            <Clock selectedCountry={selectedCountry} />
          </div>

          <div className="flex flex-col gap-4 md:flex-row bg-gray-200 m-4 p-4 justify-between rounded-lg">
            {/* User Details */}
            <div>
              <p className="text-lg font-semibold"> {user.name}</p>
              <div className="flex">
                <p className="text-base">{user.username} | </p>
                <p>&nbsp;{user.company.catchPhrase}</p>
              </div>
            </div>
            {/* Contact Information */}
            <div className="">
              <p className="text-lg font-normal">
                {user.address.city}, {user.address.street}, {user.address.suite}
              </p>
              <div className="flex">
                <p className="text-base font-medium"> {user.email} | </p>
                <p className="text-base font-medium">&nbsp;{user.phone}</p>
              </div>
            </div>
          </div>

          {/* Posts */}
          <div>
            <h1 className="text-xl font-semibold ml-4">Posts</h1>
            <div className="grid grid-cols-1 md:grid-cols-3">
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
}
