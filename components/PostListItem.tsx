import React from 'react';
import type { Post } from '../types';
import Avatar from './Avatar';

const PostListItem: React.FC<{ post: Post; onSelectPost: (id: string) => void }> = ({ post, onSelectPost }) => {
  const ticker = post.ticker;
  return (
    <div
      onClick={() => onSelectPost(post.id)}
      className="bg-gray-800 p-4 rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out hover:bg-gray-700 border border-gray-700 flex items-center space-x-4"
    >
      <div className="flex-shrink-0">
        <Avatar name={post.author} />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-md font-bold text-gray-100 truncate">{post.title}</h3>
        <div className="flex items-center text-sm text-gray-400 mt-1 flex-wrap">
          <span>{post.author}</span>
          <span className="mx-1.5">&middot;</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          {ticker && (
            <>
              <span className="mx-1.5">&middot;</span>
              <span className="bg-gray-600 text-gray-200 text-xs font-mono font-bold px-2 py-1 rounded">
                {ticker}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostListItem;