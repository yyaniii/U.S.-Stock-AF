import React, { useState, useRef, useMemo } from 'react';
import type { Post, Reply } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import StockInfo from './StockInfo';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { BookmarkSolidIcon } from './icons/BookmarkSolidIcon';
import { FireIcon } from './icons/FireIcon';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

interface TopicViewProps {
  post: Post;
  onBack: () => void;
  onAddReply: (postId: string, content: string, replyingTo?: { id: string; author: string }) => void;
  onHashtagClick: (hashtag: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (postId: string) => void;
  onVote: (postId: string, replyId: string, vote: 'bullish' | 'bearish') => void;
  currentUser: string;
}

const TopicView: React.FC<TopicViewProps> = ({ post, onBack, onAddReply, onHashtagClick, isBookmarked, onToggleBookmark, onVote, currentUser }) => {
  const [replyContent, setReplyContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; author: string } | null>(null);
  const replyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [sortOrder, setSortOrder] = useState<'time' | 'bullish'>('time');

  const hotReplies = useMemo(() => {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    return post.replies
        .filter(reply => new Date(reply.createdAt).getTime() > twentyFourHoursAgo)
        .sort((a, b) => (b.bullishVotes - b.bearishVotes) - (a.bullishVotes - a.bearishVotes))
        .slice(0, 3)
        .filter(reply => (reply.bullishVotes - reply.bearishVotes) > 0);
  }, [post.replies]);

  const sortedReplies = useMemo(() => {
    const repliesCopy = [...post.replies];
    if (sortOrder === 'bullish') {
      return repliesCopy.sort((a, b) => b.bullishVotes - a.bullishVotes);
    }
    // Default: 'time' (newest first)
    return repliesCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [post.replies, sortOrder]);


  const handleSetReplyingTo = (id: string, author: string) => {
    setReplyingTo({ id, author });
    if (replyTextareaRef.current) {
      replyTextareaRef.current.focus();
      replyTextareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onAddReply(post.id, replyContent, replyingTo ?? undefined);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center text-blue-400 hover:underline mb-4">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        回到列表
      </button>

      {/* Original Post */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <span className="block text-blue-400 font-mono text-lg">${post.ticker}</span>
              <h1 className="text-3xl font-bold text-white">{post.title}</h1>
            </div>
            <button
                onClick={() => onToggleBookmark(post.id)}
                className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label={isBookmarked ? '從書櫃移除' : '加入書櫃'}
            >
                {isBookmarked ? (
                    <BookmarkSolidIcon className="w-6 h-6 text-green-accent" />
                ) : (
                    <BookmarkIcon className="w-6 h-6" />
                )}
            </button>
        </div>
        <div className="text-sm text-gray-400 mb-4">
          由 {post.author} 發表於 {new Date(post.createdAt).toLocaleString()}
        </div>
        <div className="text-gray-200 leading-relaxed">
           <StockInfo content={post.content} onHashtagClick={onHashtagClick} />
        </div>
      </div>
      
      {/* Hot Replies */}
      {hotReplies.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-yellow-500/30">
            <h3 className="flex items-center text-xl font-bold text-yellow-400 mb-4">
                <FireIcon className="w-6 h-6 mr-2" />
                每小時熱門回覆
            </h3>
            <div className="space-y-4">
                {hotReplies.map((reply) => (
                    <div key={reply.id} className="bg-gray-700/50 p-3 rounded-md">
                        <div className="text-sm text-gray-400 mb-2">
                            <span className="font-bold text-gray-200">{reply.author}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{reply.content.substring(0, 150)}{reply.content.length > 150 ? '...' : ''}</p>
                        <div className="flex items-center text-xs space-x-4 mt-2 font-mono">
                            <span className="flex items-center text-green-400">
                                <ArrowUpIcon className="w-4 h-4 mr-1" /> {reply.bullishVotes} 看多
                            </span>
                            <span className="flex items-center text-red-400">
                                <ArrowDownIcon className="w-4 h-4 mr-1" /> {reply.bearishVotes} 看空
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}


      {/* Replies */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
            <h3 className="text-xl font-semibold text-white">
                {post.replies.length} 則回覆
            </h3>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">排序依據:</span>
                <button
                    onClick={() => setSortOrder('time')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                        sortOrder === 'time'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    時間
                </button>
                <button
                    onClick={() => setSortOrder('bullish')}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                        sortOrder === 'bullish'
                        ? 'bg-green-accent/80 text-gray-900'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    最多看多
                </button>
            </div>
        </div>

        {sortedReplies.map((reply) => {
            const userVote = reply.votes[currentUser];
            return (
                <div id={`reply-${reply.id}`} key={reply.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 ml-0 sm:ml-8">
                    <div className="text-sm text-gray-400 mb-2">
                        <span>
                            <span className="font-bold text-gray-200">{reply.author}</span>
                            <span className="mx-2">&middot;</span>
                            <span>{new Date(reply.createdAt).toLocaleString()}</span>
                        </span>
                    </div>
                    <div className="text-gray-200 mt-2 flex items-start">
                    {reply.replyingToAuthor && (
                        <a 
                        href={`#reply-${reply.replyingToId}`} 
                        className="flex-shrink-0 bg-gray-700 text-blue-300 rounded-md px-2 py-1 mr-2 text-sm font-semibold hover:bg-gray-600"
                        >
                        @{reply.replyingToAuthor}
                        </a>
                    )}
                    <div className="flex-grow min-w-0">
                        <StockInfo content={reply.content} onHashtagClick={onHashtagClick} />
                    </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 pt-3 border-t border-gray-700/50">
                        <button 
                            onClick={() => onVote(post.id, reply.id, 'bullish')}
                            className={`flex items-center space-x-1.5 text-sm transition-colors duration-200 ${
                                userVote === 'bullish' ? 'text-green-400 font-bold' : 'text-gray-400 hover:text-green-400'
                            }`}
                            aria-pressed={userVote === 'bullish'}
                        >
                            <ArrowUpIcon className="w-5 h-5" />
                            <span>看多 ({reply.bullishVotes})</span>
                        </button>
                        <button 
                            onClick={() => onVote(post.id, reply.id, 'bearish')}
                            className={`flex items-center space-x-1.5 text-sm transition-colors duration-200 ${
                                userVote === 'bearish' ? 'text-red-400 font-bold' : 'text-gray-400 hover:text-red-400'
                            }`}
                            aria-pressed={userVote === 'bearish'}
                        >
                            <ArrowDownIcon className="w-5 h-5" />
                            <span>看空 ({reply.bearishVotes})</span>
                        </button>
                        <div className="flex-grow" />
                        <button
                            onClick={() => handleSetReplyingTo(reply.id, reply.author)}
                            className="text-blue-400 hover:underline text-xs font-semibold"
                            aria-label={`回覆 ${reply.author}`}
                        >
                            回覆
                        </button>
                    </div>
              </div>
            );
        })}
      </div>

      {/* Reply Form */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <form onSubmit={handleReplySubmit}>
          <h3 className="text-xl font-semibold mb-3 text-white">新增您的回覆</h3>
          {replyingTo && (
            <div className="bg-gray-700 p-2 rounded-md mb-3 text-sm flex justify-between items-center">
              <span>
                正在回覆 <span className="font-bold text-blue-400">@{replyingTo.author}</span>
              </span>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-white font-bold text-lg leading-none px-2"
                aria-label="取消回覆"
              >
                &times;
              </button>
            </div>
          )}
          <textarea
            ref={replyTextareaRef}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="分享您的想法..."
            rows={5}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
          <button
            type="submit"
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
            disabled={!replyContent.trim()}
          >
            送出回覆
          </button>
        </form>
      </div>
    </div>
  );
};

export default TopicView;