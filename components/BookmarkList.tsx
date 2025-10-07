import React from 'react';
import type { Post } from '../types';
import PostListItem from './PostListItem';
import { BookmarkIcon } from './icons/BookmarkIcon';

interface BookmarkListProps {
  posts: Post[];
  onSelectPost: (postId: string) => void;
}

const BookmarkList: React.FC<BookmarkListProps> = ({ posts, onSelectPost }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center space-x-3">
        <BookmarkIcon className="w-7 h-7 text-gray-400" />
        <h1 className="text-2xl font-bold text-gray-100">我的書櫃</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold">尚無任何收藏</h3>
          <p className="mt-2">您可以從話題頁面將感興趣的討論加入收藏。</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} onSelectPost={onSelectPost} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkList;
