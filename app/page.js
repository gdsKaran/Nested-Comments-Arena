"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [comments, setComments] = useState([]);
  const textRef = useRef(null);

  const addComment = (newComment, parentId = null) => {
    const comment = {
      id: Date.now(),
      text: newComment,
      replies: [],
      parentId: parentId,
    };
    if (parentId === null) {
      setComments((prevComments) => [...prevComments, comment]);
    } else {
      setComments((prevComments) => {
        const addReply = (commentList) => {
          return commentList.map((c) => {
            if (c.id === parentId) {
              return { ...c, replies: [...c.replies, comment] };
            } else if (c.replies.length > 0) {
              return { ...c, replies: addReply(c.replies) };
            }
            return c;
          });
        };
        return addReply(prevComments);
      });
    }
    textRef.current.value = "";
  };

  const commentHandler = () => {
    const newComment = textRef.current.value;
    addComment(newComment);
  };

  function Comments({ comment, onReply }) {
    const [replyForm, setReplyForm] = useState(false);
    const replyRef = useRef(null);
    const replyHandler = () => {
      const replyComment = replyRef.current.value;
      onReply(replyComment, comment.id);
      replyRef.current.value = ""; // Clear the reply input after submission
    };
    return (
      <div className="mt-4 pl-4 border-l border-gray-400">
        <p>{comment.text}</p>
        <button
          className="text-sm text-indigo-500 hover:underline mt-2"
          onClick={() => setReplyForm(!replyForm)}
        >
          reply
        </button>
        {replyForm && (
          <div className="mt-2">
            <textarea
              ref={replyRef}
              rows="2"
              placeholder="Write your reply..."
              className="w-1/4 bg-gray-200 rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 text-gray-700 transition-all duration-300"
            />
            <button
              onClick={replyHandler}
              className="flex flex-col bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Post Reply
            </button>
          </div>
        )}
        {comment.replies.length > 0 && (
          <div className="mt-4 pl-4">
            {comment.replies.map((reply) => (
              <Comments key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full lg:flex flex-col">
        <h1 className="text-3xl font-bold ">Comments</h1>
        <textarea
          ref={textRef}
          rows="4"
          placeholder="Write your comment..."
          className="mt-4 w-1/3 bg-gray-200  rounded text-black focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 text-gray-700 transition-all duration-300"
        />
        <div className="mt-4  justify-end">
          <button
            onClick={commentHandler}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Post Comment
          </button>
        </div>
        <div className="comments-section">
          {/* Render your comments here */}
          {comments.map((i) => (
            <Comments key={i.id} comment={i} onReply={addComment} />
          ))}
        </div>
      </div>
    </main>
  );
}
