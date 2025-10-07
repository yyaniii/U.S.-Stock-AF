
export interface Reply {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  replyingToId?: string;
  replyingToAuthor?: string;
  bullishVotes: number;
  bearishVotes: number;
  votes: Record<string, 'bullish' | 'bearish'>;
}

export interface Post {
  id: string;
  author: string;
  ticker: string;
  title: string;
  content: string;
  createdAt: Date;
  replies: Reply[];
}