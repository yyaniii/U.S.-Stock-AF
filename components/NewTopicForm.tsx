import React, { useState, useRef, useEffect } from 'react';
import { validateTicker } from '../services/geminiService';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface NewTopicFormProps {
  onAddPost: (title: string, content: string, ticker: string) => void;
  onCancel: () => void;
}

const NewTopicForm: React.FC<NewTopicFormProps> = ({ onAddPost, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [ticker, setTicker] = useState('');
  
  const [isValidating, setIsValidating] = useState(false);
  const [isTickerValid, setIsTickerValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>('此欄位為必填項。');
  const debounceTimeoutRef = useRef<number | null>(null);
  const validatedTickerRef = useRef<string | null>(null);

  useEffect(() => {
    const currentTicker = ticker.trim().toUpperCase();

    if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
    }

    if (currentTicker) {
        if (currentTicker === validatedTickerRef.current) {
            return;
        }

        setIsValidating(true);
        setIsTickerValid(null);
        setValidationMessage(`正在驗證代號 ${currentTicker}...`);

        debounceTimeoutRef.current = window.setTimeout(async () => {
            const isValid = await validateTicker(currentTicker);
            validatedTickerRef.current = currentTicker;
            setIsValidating(false);
            setIsTickerValid(isValid);
            if (isValid) {
                setValidationMessage(`代號 ${currentTicker} 有效。`);
            } else {
                setValidationMessage(`${currentTicker} 不是一個有效的美國股市代號。`);
            }
        }, 800);
    } else {
        validatedTickerRef.current = null;
        setIsValidating(false);
        setIsTickerValid(null);
        setValidationMessage('此欄位為必填項。');
    }

    return () => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
    };
  }, [ticker]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim() && ticker.trim() && isTickerValid) {
      onAddPost(title, content, ticker.trim().toUpperCase());
      setTitle('');
      setContent('');
      setTicker('');
    }
  };

  const isSubmitDisabled = !title.trim() || !content.trim() || !ticker.trim() || isValidating || isTickerValid !== true;

  const renderValidationStatus = () => {
    if (isValidating) {
        return (
            <div className="flex items-center text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                <span>{validationMessage}</span>
            </div>
        );
    }
    if (isTickerValid === true) {
        return (
            <div className="flex items-center text-green-400">
                <CheckCircleIcon className="w-5 h-5 mr-1" />
                <span>{validationMessage}</span>
            </div>
        );
    }
    if (isTickerValid === false) {
        return (
            <div className="flex items-center text-red-400">
                <XCircleIcon className="w-5 h-5 mr-1" />
                <span>{validationMessage}</span>
            </div>
        );
    }
    if (!ticker.trim() && validationMessage) {
        return <div className="text-sm text-gray-400">{validationMessage}</div>;
    }
    return null;
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl border border-gray-700">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">建立新話題</h2>
          
          <div className="mb-4">
            <label htmlFor="ticker" className="block text-sm font-medium text-gray-300 mb-1">美國股市代號</label>
            <input
              type="text"
              id="ticker"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="例如：AAPL, GOOGL, TSLA"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="mt-2 text-sm h-5">
                {renderValidationStatus()}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">標題</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：關於最新財報的想法"
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">內容</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="分享您的分析、問題或新聞。您可以提及 $AAPL 或 $TSLA 等股票以啟用 AI 摘要功能。"
              rows={8}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              取消
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitDisabled}
            >
              發表
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTopicForm;