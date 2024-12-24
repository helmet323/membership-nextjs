import React from "react";

// Define the types for the props
interface Comment {
  text: string;
  author: string;
}

interface CarouselProps {
  comments: Comment[];
  currentCommentIndex: number;
  handleNextComment: () => void;
  handlePrevComment: () => void;
}

export default function Carousel({
  comments = [],
  currentCommentIndex = 0,
  handleNextComment,
  handlePrevComment,
}: CarouselProps) {
  const comment = comments[currentCommentIndex];

  return (
    <div className="flex justify-center items-center gap-4 flex-nowrap relative">
      {/* Left Arrow */}
      <button
        onClick={handlePrevComment}
        aria-label="Previous comment"
        className="z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-300"
      >
        &lt;
      </button>

      {/* Comment Display */}
      <div className="flex flex-col justify-center items-center max-w-3xl w-11/12 p-8 shadow-lg rounded-xl bg-white h-36 text-center transition-transform duration-300 ease-in-out ">
        {comment ? (
          <>
            <p className="text-gray-800 mb-4 text-lg">{`"${comment.text}"`}</p>
            <p className="text-gray-600 font-bold">{`- ${comment.author}`}</p>
          </>
        ) : (
          <p className="text-gray-400 italic">No comments available.</p>
        )}
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNextComment}
        aria-label="Next comment"
        className="z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-300"
      >
        &gt;
      </button>
    </div>
  );
}
