import React from 'react';
import type { Post } from '../types';
import Avatar from './Avatar';
import { PlusIcon } from './icons/PlusIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import PostListItem from './PostListItem';


interface TopicListProps {
  posts: Post[];
  onSelectPost: (postId: string) => void;
  onNewPostClick: () => void;
}

const PostCard: React.FC<{ post: Post; onSelectPost: (id: string) => void }> = ({ post, onSelectPost }) => {
  const ticker = post.ticker;
  return (
    <div
      onClick={() => onSelectPost(post.id)}
      className="bg-gray-800 p-5 rounded-lg shadow-lg cursor-pointer transition duration-300 ease-in-out hover:bg-gray-700 border border-gray-700 h-full flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-bold text-gray-100 mb-2">{post.title}</h3>
        <div className="text-sm text-gray-400 mb-3">
          <span>{post.author}</span>
          <span className="mx-1.5">&middot;</span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      {ticker && (
        <span className="self-start bg-gray-600 text-gray-200 text-xs font-mono font-bold px-2 py-1 rounded">
          {ticker}
        </span>
      )}
    </div>
  );
};

const TopicList: React.FC<TopicListProps> = ({ posts, onSelectPost, onNewPostClick }) => {
  const hotPosts = posts.slice(0, 2);
  const recentPosts = posts.slice(2);

  return (
    <div className="space-y-10">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
            <DocumentTextIcon className="w-7 h-7 text-gray-400" />
            <h1 className="text-2xl font-bold text-gray-100">討論話題</h1>
         </div>
        <button
            onClick={onNewPostClick}
            className="flex items-center space-x-2 bg-green-accent/10 hover:bg-green-accent/20 text-green-accent font-bold py-2 px-4 rounded-md transition duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            <span>新貼文</span>
          </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <h3 className="text-xl">尚無任何話題。</h3>
          <p>成為第一個發起討論的人！</p>
        </div>
      ) : (
        <>
          {hotPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-4 tracking-wider font-mono">熱門洞察</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hotPosts.map((post) => (
                  <PostCard key={post.id} post={post} onSelectPost={onSelectPost} />
                ))}
              </div>
            </div>
          )}

          {recentPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold text-gray-100 mb-4 tracking-wider font-mono">近期討論</h2>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <PostListItem key={post.id} post={post} onSelectPost={onSelectPost} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopicList;