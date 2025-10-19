import { motion, AnimatePresence } from 'motion/react';
import { X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAvatarColor, getAvatarInitial } from '../utils/avatarUtils';

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days}d ago`;
}

export interface Comment {
  id: string;
  x: number; // Absolute pixel position
  y: number; // Absolute pixel position
  normalizedX: number; // 0-1 relative to viewport width
  normalizedY: number; // 0-1 relative to page height
  text: string;
  author: string;
  userId?: string; // Optional for backward compatibility with old comments
  timestamp: Date;
  pagePath: string;
  status: 'open' | 'resolved' | 'hidden';
  replies: Reply[];
}

interface Reply {
  id: string;
  text: string;
  author: string;
  userId?: string; // Optional for backward compatibility with old replies
  timestamp: Date;
}

interface CommentSystemProps {
  comments: Comment[];
  onAddComment: (x: number, y: number, text: string) => void;
  onDeleteComment: (id: string) => void;
  onAddReply: (commentId: string, text: string) => void;
  onUpdatePosition: (commentId: string, x: number, y: number) => void;
  onResolveComment?: (commentId: string, resolved: boolean) => void;
  activeCommentId: string | null;
  setActiveCommentId: (id: string | null) => void;
}

export function CommentSystem({
  comments,
  onAddComment,
  onDeleteComment,
  onAddReply,
  onUpdatePosition,
  onResolveComment,
  activeCommentId,
  setActiveCommentId,
}: CommentSystemProps) {
  const [replyText, setReplyText] = useState('');
  const [draggingCommentId, setDraggingCommentId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [tempPosition, setTempPosition] = useState<{ id: string; x: number; y: number } | null>(null);
  const [isDragMoving, setIsDragMoving] = useState(false);
  const [mouseDownPos, setMouseDownPos] = useState<{ x: number; y: number } | null>(null);
  const [justDroppedId, setJustDroppedId] = useState<string | null>(null);

  const handleReply = (commentId: string) => {
    if (replyText.trim()) {
      onAddReply(commentId, replyText);
      setReplyText('');
    }
  };

  const handleMouseDown = (e: React.MouseEvent, commentId: string, commentX: number, commentY: number) => {
    e.stopPropagation();
    e.preventDefault();
    
    setDraggingCommentId(commentId);
    setIsDragMoving(false);
    setMouseDownPos({ x: e.clientX, y: e.clientY });
    setDragOffset({
      x: e.clientX - commentX,
      y: e.clientY - commentY + window.scrollY
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingCommentId) return;

    // Check if mouse has moved significantly (more than 5px) to differentiate from click
    if (mouseDownPos && !isDragMoving) {
      const deltaX = Math.abs(e.clientX - mouseDownPos.x);
      const deltaY = Math.abs(e.clientY - mouseDownPos.y);
      if (deltaX > 5 || deltaY > 5) {
        setIsDragMoving(true);
      }
    }

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y + window.scrollY;

    setTempPosition({
      id: draggingCommentId,
      x: newX,
      y: newY
    });
  };

  const handleMouseUp = () => {
    const wasMoving = isDragMoving;
    const commentId = draggingCommentId;
    
    if (!draggingCommentId) {
      setDraggingCommentId(null);
      setTempPosition(null);
      setIsDragMoving(false);
      setMouseDownPos(null);
      return;
    }

    // Save the new position only if it was actually dragged
    if (wasMoving && tempPosition) {
      onUpdatePosition(draggingCommentId, tempPosition.x, tempPosition.y);
      // Show drop animation
      setJustDroppedId(draggingCommentId);
      setTimeout(() => setJustDroppedId(null), 500);
    }
    
    // Reset states
    setDraggingCommentId(null);
    setTempPosition(null);
    setIsDragMoving(false);
    setMouseDownPos(null);

    // Only trigger click/open if it wasn't a drag
    if (!wasMoving && commentId) {
      setTimeout(() => {
        const isActive = activeCommentId === commentId;
        setActiveCommentId(isActive ? null : commentId);
      }, 0);
    }
  };

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (!draggingCommentId) return;

    const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);
    const mouseUpHandler = () => handleMouseUp();

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, [draggingCommentId, dragOffset]);

  // Calculate smart positioning for comment thread
  const getThreadPosition = (comment: Comment) => {
    const threadWidth = 380;
    const threadHeight = 400; // Approximate max height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;
    
    // Check available space
    const spaceRight = viewportWidth - comment.x;
    const spaceLeft = comment.x;
    const spaceBelow = viewportHeight - (comment.y - scrollY);
    
    // Determine horizontal position - prefer right side
    let horizontal: 'left' | 'right' = 'left';
    if (spaceRight < threadWidth + 50 && spaceLeft > threadWidth + 50) {
      horizontal = 'right';
    }
    
    // Determine vertical position
    let vertical: 'top' | 'bottom' = 'bottom';
    if (spaceBelow < threadHeight && comment.y - scrollY > threadHeight) {
      vertical = 'top';
    }
    
    return { horizontal, vertical };
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {comments
          .filter(comment => comment.status !== 'resolved' && comment.status !== 'hidden') // Hide resolved and hidden comments
          .map((comment) => {
          const isActive = activeCommentId === comment.id;
          const isDragging = draggingCommentId === comment.id;
          const justDropped = justDroppedId === comment.id;
          
          // Use temp position if dragging, otherwise use comment position
          const displayX = tempPosition?.id === comment.id ? tempPosition.x : comment.x;
          const displayY = tempPosition?.id === comment.id ? tempPosition.y : comment.y;
          
          const position = isActive ? getThreadPosition({ ...comment, x: displayX, y: displayY }) : { horizontal: 'left' as const, vertical: 'bottom' as const };

          return (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: justDropped ? [1, 1.2, 1] : 1,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                scale: justDropped ? { duration: 0.5, times: [0, 0.5, 1] } : { duration: 0.2 }
              }}
              className={`absolute pointer-events-auto ${isDragging && isDragMoving ? 'z-30' : ''}`}
              style={{ left: displayX, top: displayY }}
              data-comment-id={comment.id}
            >
              {/* Comment Pin */}
              <button
                onMouseDown={(e) => handleMouseDown(e, comment.id, displayX, displayY)}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all border-2 border-white ${
                  isDragging && isDragMoving 
                    ? 'cursor-grabbing scale-110 opacity-70 shadow-xl' 
                    : justDropped
                    ? 'shadow-2xl'
                    : 'cursor-grab hover:scale-105 hover:shadow-xl'
                }`}
                style={{ 
                  backgroundColor: getAvatarColor(comment.userId),
                  transform: isDragging && isDragMoving ? 'rotate(3deg)' : 'rotate(0deg)'
                }}
              >
                <span className="text-white font-['Gaegu'] text-[13px]">{getAvatarInitial(comment.userId)}</span>
              </button>

              {/* Comment Thread */}
              {isActive && !isDragging && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute w-[320px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e5e7f0]"
                  style={{
                    [position.vertical === 'bottom' ? 'top' : 'bottom']: '45px',
                    [position.horizontal]: '0',
                  }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 flex items-center justify-between border-b border-[#e5e7f0]">
                    <span className="text-[#474747] font-['Gaegu'] text-[16px]">
                      Thread
                    </span>
                    <div className="flex items-center gap-1">
                      {onResolveComment && (
                        <button
                          onClick={() => {
                            onResolveComment(comment.id, true);
                            setActiveCommentId(null);
                          }}
                          className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 bg-[#4caf50] text-white hover:bg-[#45a049] transition-colors"
                          title="Resolve and hide this comment"
                        >
                          <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                          <span className="font-['Gaegu'] text-[13px]">
                            Resolve
                          </span>
                        </button>
                      )}
                      <button
                        onClick={() => setActiveCommentId(null)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-[#f5f5f7] transition-colors"
                      >
                        <X className="w-4 h-4 text-[#8c8fa6]" />
                      </button>
                    </div>
                  </div>

                  {/* Comments - scrollable with max height */}
                  <div className="max-h-[300px] overflow-y-auto">
                    {/* Original Comment */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getAvatarColor(comment.userId) }}
                        >
                          <span className="text-white font-['Gaegu'] text-[13px]">
                            {getAvatarInitial(comment.userId)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[#474747] font-['Gaegu'] text-[15px]">
                              {comment.author}
                            </span>
                            <span className="text-[#8c8fa6] font-['Gaegu'] text-[13px]">
                              {getRelativeTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-[#474747] font-['Gaegu'] text-[14px] leading-[1.5] break-words">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="px-4 py-3 border-t border-[#e5e7f0]">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: getAvatarColor(reply.userId) }}
                          >
                            <span className="text-white font-['Gaegu'] text-[13px]">
                              {getAvatarInitial(reply.userId)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-[#474747] font-['Gaegu'] text-[15px]">
                                {reply.author}
                              </span>
                              <span className="text-[#8c8fa6] font-['Gaegu'] text-[13px]">
                                {getRelativeTime(reply.timestamp)}
                              </span>
                            </div>
                            <p className="text-[#474747] font-['Gaegu'] text-[14px] leading-[1.5] break-words">
                              {reply.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply Input */}
                  <div className="p-4 border-t border-[#e5e7f0]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && replyText.trim()) {
                            e.preventDefault();
                            handleReply(comment.id);
                          }
                        }}
                        maxLength={500}
                        className="flex-1 px-3 py-2 border border-[#e5e7f0] rounded-lg font-['Gaegu'] text-[14px] text-[#474747] placeholder:text-[#b8bbd2] focus:outline-none focus:ring-2 focus:ring-[#8774ff] focus:border-transparent transition-all"
                      />
                      <button
                        onClick={() => handleReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-[#8774ff] rounded-lg font-['Gaegu'] text-[14px] text-white hover:bg-[#7563ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
