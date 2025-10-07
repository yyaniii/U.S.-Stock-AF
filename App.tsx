import React, { useState, useCallback, useMemo } from 'react';
import type { Post, Reply } from './types';
import Sidebar from './components/Sidebar';
import TopicList from './components/TopicList';
import TopicView from './components/TopicView';
import NewTopicForm from './components/NewTopicForm';
import BookmarkList from './components/BookmarkList';

// Generate a more unique anonymous name
const generateAnonymousName = () => {
  const adjectives = ['沉靜', '聰明', '勇敢', '神秘', '安靜', '智慧', '敏銳', '大膽', '迅速', '快樂'];
  const nouns = ['交易員', '分析師', '投資者', '觀察家', '經紀人', '鯊魚', '貓頭鷹', '狐狸', '獅子', '老鷹'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return `${randomAdj}的${randomNoun}${randomNumber}`;
};

const getOrSetCurrentUser = (): string => {
  try {
    const storedUser = localStorage.getItem('anonymousUser');
    if (storedUser) {
      return storedUser;
    }
    const newUser = generateAnonymousName();
    localStorage.setItem('anonymousUser', newUser);
    return newUser;
  } catch (error) {
    console.error("無法存取 localStorage。正在生成臨時使用者。", error);
    return generateAnonymousName();
  }
};


const initialPosts: Post[] = [
    {
        id: '1',
        author: '沉靜的交易員123',
        ticker: 'AAPL',
        title: '現在是否被高估了？',
        content: '隨著最近的股價飆升，我想知道蘋果 ($AAPL) 是否漲得太快了。與歷史平均水平相比，其本益比看起來有點高。您有什麼看法，特別是考慮到即將到來的產品週期？ #財報分析',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        replies: [
            { id: 'r1', author: '智慧的觀察家456', content: '我認為市場正在反映對新 AI 功能的預期。如果他們能夠實現，目前的估值可能是合理的。這是一場對未來創新的賭注。', createdAt: new Date(Date.now() - 1000 * 60 * 50), bullishVotes: 15, bearishVotes: 2, votes: { '勇敢的分析師789': 'bullish' } },
            { id: 'r2', author: '勇敢的分析師789', content: '完全同意。補充一點，他們的服務業務持續成長，這也為估值提供了支撐。', createdAt: new Date(Date.now() - 1000 * 60 * 45), replyingToId: 'r1', replyingToAuthor: '智慧的觀察家456', bullishVotes: 8, bearishVotes: 1, votes: {} }
        ]
    },
    {
        id: '2',
        author: '敏銳的投資者234',
        ticker: 'TSLA',
        title: '深入探討新電池技術',
        content: '有人看過特斯拉 ($TSLA) 最新的專利嗎？看起來他們取得了重大進展。這可能會改變遊戲規則，並可能影響像 $RIVN 這樣的其他電動車製造商。',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        replies: []
    },
    {
        id: '3',
        author: '快樂的經紀人555',
        ticker: 'NVDA',
        title: '下一步是什麼？',
        content: '在驚人的漲勢之後，輝達 ($NVDA) 是否還有上漲空間？',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        replies: []
    }
];


const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [bookmarkedPostIds, setBookmarkedPostIds] = useState<Set<string>>(new Set());
  const [currentView, setCurrentView] = useState<'list' | 'bookmarks'>('list');
  const [currentUser] = useState(getOrSetCurrentUser());
  
  const handleAddPost = useCallback((title: string, content: string, ticker: string) => {
    const newPost: Post = {
      id: new Date().toISOString(),
      author: currentUser,
      ticker,
      title,
      content,
      createdAt: new Date(),
      replies: [],
    };
    setPosts(prevPosts => [newPost, ...prevPosts].sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
    setIsCreatingPost(false);
  }, [currentUser]);

  const handleAddReply = useCallback((
    postId: string,
    content: string,
    replyingTo?: { id: string; author: string }
  ) => {
    const newReply: Reply = {
      id: new Date().toISOString(),
      author: currentUser,
      content,
      createdAt: new Date(),
      replyingToId: replyingTo?.id,
      replyingToAuthor: replyingTo?.author,
      bullishVotes: 0,
      bearishVotes: 0,
      votes: {},
    };
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, replies: [...post.replies, newReply] }
          : post
      )
    );
  }, [currentUser]);

  const handleVote = useCallback((postId: string, replyId: string, vote: 'bullish' | 'bearish') => {
    setPosts(prevPosts =>
        prevPosts.map(post => {
            if (post.id !== postId) return post;

            return {
                ...post,
                replies: post.replies.map(reply => {
                    if (reply.id !== replyId) return reply;

                    const newVotes = { ...reply.votes };
                    const existingVote = newVotes[currentUser];
                    
                    let newBullishVotes = reply.bullishVotes;
                    let newBearishVotes = reply.bearishVotes;

                    if (existingVote) {
                        if (existingVote === vote) {
                            delete newVotes[currentUser];
                            if (vote === 'bullish') newBullishVotes--;
                            else newBearishVotes--;
                        } else {
                            newVotes[currentUser] = vote;
                            if (vote === 'bullish') {
                                newBullishVotes++;
                                newBearishVotes--;
                            } else {
                                newBullishVotes--;
                                newBearishVotes++;
                            }
                        }
                    } else {
                        newVotes[currentUser] = vote;
                        if (vote === 'bullish') newBullishVotes++;
                        else newBearishVotes++;
                    }

                    return {
                        ...reply,
                        bullishVotes: newBullishVotes,
                        bearishVotes: newBearishVotes,
                        votes: newVotes,
                    };
                }),
            };
        })
    );
  }, [currentUser]);
  
  const handleHashtagClick = useCallback((hashtag: string) => {
      setSearchQuery(hashtag);
      setSelectedPostId(null);
      setCurrentView('list');
      setSelectedCompany(null);
  }, []);

  const handleToggleBookmark = useCallback((postId: string) => {
    setBookmarkedPostIds(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
            newSet.delete(postId);
        } else {
            newSet.add(postId);
        }
        return newSet;
    });
  }, []);
  
  const handleSelectCompany = useCallback((company: string | null) => {
    setCurrentView('list');
    setSelectedCompany(company);
    setSelectedPostId(null);
  }, []);
  
  const handleSelectView = useCallback((view: 'list' | 'bookmarks') => {
      setCurrentView(view);
      setSelectedPostId(null);
  }, []);


  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (currentView === 'bookmarks' || !selectedCompany) return true;
        return post.ticker === selectedCompany;
      })
      .filter(post => {
        if (!searchQuery) return true;
        const lowerCaseQuery = searchQuery.toLowerCase();
        const contentToSearch = [
          post.title,
          post.content,
          ...post.replies.map(r => r.content)
        ].join(' ').toLowerCase();
        return contentToSearch.includes(lowerCaseQuery) || contentToSearch.includes(`#${lowerCaseQuery}`);
      });
  }, [posts, searchQuery, selectedCompany, currentView]);

  const bookmarkedPosts = useMemo(() => {
    return posts.filter(post => bookmarkedPostIds.has(post.id));
  }, [posts, bookmarkedPostIds]);


  const selectedPost = posts.find(post => post.id === selectedPostId);

  const renderContent = () => {
    if (selectedPost) {
      return (
        <TopicView
          post={selectedPost}
          onBack={() => setSelectedPostId(null)}
          onAddReply={handleAddReply}
          onHashtagClick={handleHashtagClick}
          isBookmarked={bookmarkedPostIds.has(selectedPost.id)}
          onToggleBookmark={handleToggleBookmark}
          onVote={handleVote}
          currentUser={currentUser}
        />
      );
    }
    if (currentView === 'bookmarks') {
      return (
        <BookmarkList
          posts={bookmarkedPosts}
          onSelectPost={setSelectedPostId}
        />
      );
    }
    return (
      <TopicList 
        posts={filteredPosts} 
        onSelectPost={setSelectedPostId}
        onNewPostClick={() => setIsCreatingPost(true)}
      />
    );
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      <Sidebar 
        posts={posts}
        onSelectCompany={handleSelectCompany}
        selectedCompany={selectedCompany}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        currentView={currentView}
        onSelectView={handleSelectView}
      />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      {isCreatingPost && (
        <NewTopicForm 
          onAddPost={handleAddPost}
          onCancel={() => setIsCreatingPost(false)}
        />
      )}
    </div>
  );
};

export default App;