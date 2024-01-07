import React from "react";

const Post = ({ title, content }) => {
  return (
    <div className=" bg-gray-200 m-4 p-4 rounded-lg">
      <h3 className=" text-xl text-gray-800 font-semibold">{title}</h3>
      <p className="text-bold">{content}</p>
    </div>
  );
};

export default Post;
