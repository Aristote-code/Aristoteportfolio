import React, { useState, useRef, useEffect } from "react";
import { FigJamBackground } from "./components/FigJamBackground";
import { IconNavigation } from "./components/IconNavigation";
import { HomeSection } from "./components/HomeSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { AboutSection } from "./components/AboutSection";
import { ContactSection } from "./components/ContactSection";
import { CommentSystem, Comment } from "./components/CommentSystem";
import { CommentInput } from "./components/CommentInput";
import { AdminPanel } from "./components/AdminPanel";
import { NamePromptDialog } from "./components/NamePromptDialog";
import {
  CursorFollower,
  getUserCursorColor,
} from "./components/CursorFollower";
import { CollaborativeCursors } from "./components/CollaborativeCursors";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { projectId, publicAnonKey } from "./utils/supabase/info";
import { getUserId } from "./utils/avatarUtils";
import { Pencil } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isCommentMode, setIsCommentMode] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [pendingComment, setPendingComment] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [userCursorColor, setUserCursorColor] = useState<string>("");
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const ref = sectionsRef[section as keyof typeof sectionsRef];
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleToggleCommentMode = () => {
    setIsCommentMode(!isCommentMode);
    setPendingComment(null);
  };

  const handlePageClick = (e: React.MouseEvent) => {
    if (!isCommentMode) return;

    // Don't allow new comment if there's already a pending comment
    if (pendingComment) return;

    // Don't place comment if clicking on existing comments or navigation
    const target = e.target as HTMLElement;
    if (target.closest("[data-comment]") || target.closest("nav")) {
      return;
    }

    const x = e.clientX;
    const y = e.clientY + window.scrollY;

    setPendingComment({ x, y });
  };

  // Load comments from database
  const loadComments = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/comments`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );
      const data = await response.json();
      if (data.comments) {
        // Convert timestamp strings to Date objects
        const parsedComments = data.comments.map((c: any) => ({
          ...c,
          timestamp: new Date(c.timestamp),
          replies:
            c.replies?.map((r: any) => ({
              ...r,
              timestamp: new Date(r.timestamp),
            })) || [],
        }));
        setComments(parsedComments);
      }
    } catch (error) {
      console.error("Failed to load comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async (x: number, y: number, text: string) => {
    try {
      // Validate inputs before sending
      if (!text || !text.trim()) {
        alert("Please enter a comment");
        return;
      }

      if (
        typeof x !== "number" ||
        typeof y !== "number" ||
        isNaN(x) ||
        isNaN(y)
      ) {
        console.error("Invalid coordinates:", { x, y });
        alert("Invalid position. Please try again.");
        return;
      }

      // Calculate normalized coordinates
      const normalizedX = x / window.innerWidth;
      const normalizedY = y / document.documentElement.scrollHeight;
      const userId = getUserId();

      if (!userId) {
        console.error("Failed to get userId");
        alert("Failed to identify user. Please try again.");
        return;
      }

      const payload = {
        commentId,
        text: text.trim(),
        userId: userId,
        authorName: userName === "me" ? "anonymous" : userName || "anonymous",
        pagePath: window.location.pathname || "/",
      };
      const url = `https://${projectId}.supabase.co/functions/v1/server/comments`;
      console.log("🔵 Posting comment to:", url);
      console.log("📦 Payload:", payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("📬 Response status:", response.status, response.statusText);

      let data;
      try {
        data = await response.json();
        console.log("📄 Response data:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse response JSON:", parseError);
        const text = await response.text();
        console.error("📄 Response text:", text);
        alert("Server returned invalid response. Check console for details.");
        return;
      }

      if (response.ok && data.comment) {
        console.log("✅ Comment posted successfully");
        // Add to local state with parsed timestamp
        const newComment = {
          ...data.comment,
          timestamp: new Date(data.comment.timestamp),
          replies: [],
        };
        setComments([...comments, newComment]);
        setPendingComment(null);
        setIsCommentMode(false);
      } else {
        console.error("❌ Server error:", data);
        alert(
          data.error || "Failed to post comment. Check console for details."
        );
      }
    } catch (error) {
      console.error("❌ Failed to add comment:", error);
      alert("Failed to post comment. Check console for details.");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/comments/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== id));
        if (activeCommentId === id) {
          setActiveCommentId(null);
        }
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleAddReply = async (commentId: string, text: string) => {
    try {
      const userId = getUserId();

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            userId,
            authorName:
              userName === "me" ? "anonymous" : userName || "anonymous",
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.comment) {
        // Update local state with parsed timestamps
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...data.comment,
                timestamp: new Date(data.comment.timestamp),
                replies: data.comment.replies.map((r: any) => ({
                  ...r,
                  timestamp: new Date(r.timestamp),
                })),
              };
            }
            return comment;
          })
        );
      } else {
        alert(data.error || "Failed to post reply");
      }
    } catch (error) {
      console.error("Failed to add reply:", error);
      alert("Failed to post reply. Please try again.");
    }
  };

  const handleUpdatePosition = async (
    commentId: string,
    x: number,
    y: number
  ) => {
    try {
      // Calculate normalized coordinates
      const normalizedX = x / window.innerWidth;
      const normalizedY = y / document.documentElement.scrollHeight;

      // Optimistically update local state first
      setComments(
        comments.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              x,
              y,
              normalizedX,
              normalizedY,
            };
          }
          return comment;
        })
      );

      // Then update backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/comments/${commentId}/position`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            x,
            y,
            normalizedX,
            normalizedY,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        console.error("Failed to update position:", data.error);
        // Reload comments to revert optimistic update
        loadComments();
      }
    } catch (error) {
      console.error("Failed to update position:", error);
      // Reload comments to revert optimistic update
      loadComments();
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    try {
      // Close the active comment if it's being resolved
      if (activeCommentId === commentId && resolved) {
        setActiveCommentId(null);
      }

      // If resolving, permanently delete from local state immediately
      if (resolved) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      }

      // Try to delete from backend
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/server/comments/${commentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        // If endpoint fails, that's ok - we already removed it from local state
        if (
          !response.ok &&
          response.status !== 404 &&
          response.status !== 403
        ) {
          const data = await response.json();
          console.warn("Failed to delete comment from backend:", data.error);
        }
      } catch (fetchError) {
        console.log("Comment deleted locally, backend may need manual cleanup");
      }
    } catch (error) {
      console.error("Failed to resolve comment:", error);
    }
  };

  // Load comments and check for deep link
  useEffect(() => {
    loadComments();

    // Check for deep link to specific comment
    const urlParams = new URLSearchParams(window.location.search);
    const commentId = urlParams.get("comment");
    if (commentId) {
      // Wait for comments to load, then open the specific comment
      setTimeout(() => {
        setActiveCommentId(commentId);
        // Find and scroll to the comment
        const commentElement = document.querySelector(
          `[data-comment-id="${commentId}"]`
        );
        if (commentElement) {
          commentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 500);
    }
  }, []);

  // Check for existing user name and show prompt if needed
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
      setUserCursorColor(getUserCursorColor());
    } else {
      // Set default "me" for cursor display if no name provided
      setUserName("me");
      setUserCursorColor(getUserCursorColor());
      // Show name prompt after a short delay
      setTimeout(() => setShowNamePrompt(true), 1000);
    }
  }, []);

  // Handle name submission
  const handleNameSubmit = async (name: string) => {
    localStorage.setItem("userName", name);
    setUserName(name);
    setUserCursorColor(getUserCursorColor());
    setShowNamePrompt(false);

    // Send "user joined" notification email to admin
    try {
      const url = `https://${projectId}.supabase.co/functions/v1/server/user-joined`;
      console.log("🔵 Sending user-joined notification to:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: name,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log(
        "📬 User-joined response:",
        response.status,
        response.statusText
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ User-joined notification sent:", data);
      } else {
        const errorData = await response.json();
        console.warn("⚠️ User-joined notification failed:", errorData);
      }
    } catch (error) {
      console.log("❌ User joined notification error:", error);
      // Don't show error to user, this is a background operation
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.entries(sectionsRef);
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const [key, ref] of sections) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(key);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check URL hash for admin access
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === "#admin") {
        setShowAdmin(true);
      } else {
        setShowAdmin(false);
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Ctrl+Shift+A to open admin panel (works even when typing)
      if (e.ctrlKey && e.shiftKey && e.key === "A") {
        e.preventDefault();
        window.location.hash = "#admin";
        return;
      }

      // ESC should always work to exit comment mode or close pending comment
      if (e.key === "Escape") {
        if (pendingComment) {
          setPendingComment(null);
        } else if (isCommentMode) {
          setIsCommentMode(false);
        }
        return;
      }

      // Don't trigger 'C' shortcut if user is typing in an input or textarea
      if (isTyping) {
        return;
      }

      // Toggle comment mode when 'C' or 'c' is pressed
      if (e.key === "c" || e.key === "C") {
        setIsCommentMode((prev) => !prev);
        setPendingComment(null);
      }

      // Toggle drawing mode when 'D' or 'd' is pressed
      if (e.key === "d" || e.key === "D") {
        setIsDrawingMode((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommentMode, pendingComment]);

  // If admin mode is active, show admin panel only
  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div
      className={`relative w-full ${
        isCommentMode
          ? "cursor-crosshair"
          : userName && userCursorColor
          ? "custom-cursor-active"
          : ""
      }`}
    >
      <FigJamBackground />

      {/* Name Prompt Dialog */}
      {showNamePrompt && !showAdmin && (
        <NamePromptDialog onSubmit={handleNameSubmit} />
      )}

      {/* Cursor Follower - hide when in comment mode or admin panel */}
      {userName && userCursorColor && !showAdmin && !isCommentMode && (
        <CursorFollower name={userName} color={userCursorColor} />
      )}

      {/* Collaborative Cursors - show other users' cursors (z-60) */}
      {userName && userCursorColor && (
        <CollaborativeCursors
          userName={userName}
          userColor={userCursorColor}
          isActive={!showAdmin && !isCommentMode}
        />
      )}

      {/* Main content wrapper for comments to stick to */}
      <main className="relative w-full min-h-full" onClick={handlePageClick}>
        {/* Comment System */}
        <CommentSystem
          comments={comments}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onAddReply={handleAddReply}
          onUpdatePosition={handleUpdatePosition}
          onResolveComment={handleResolveComment}
          activeCommentId={activeCommentId}
          setActiveCommentId={setActiveCommentId}
        />

        {/* Pending Comment Input */}
        {pendingComment && (
          <CommentInput
            x={pendingComment.x}
            y={pendingComment.y}
            onSubmit={(text) =>
              handleAddComment(pendingComment.x, pendingComment.y, text)
            }
            onCancel={() => setPendingComment(null)}
          />
        )}

        {/* Loading Indicator (z-40) */}
        {isLoadingComments && (
          <div className="fixed top-8 right-8 bg-white px-4 py-2 rounded-lg shadow-lg border border-[#e5e7f0] z-40">
            <p className="font-['Gaegu'] text-[14px] text-[#8c8fa6]">
              Loading comments...
            </p>
          </div>
        )}

        {/* Sections */}
        <div ref={sectionsRef.home}>
          <HomeSection />
        </div>

        <div ref={sectionsRef.projects}>
          <ProjectsSection />
        </div>

        <div ref={sectionsRef.about}>
          <AboutSection />
        </div>

        <div ref={sectionsRef.contact}>
          <ContactSection />
        </div>
      </main>

      {/* Icon Navigation - Fixed position */}
      <IconNavigation
        activeSection={activeSection}
        onNavigate={handleNavigate}
        isCommentMode={isCommentMode}
        onToggleCommentMode={handleToggleCommentMode}
        isDrawingMode={isDrawingMode}
        onToggleDrawingMode={() => setIsDrawingMode(!isDrawingMode)}
      />

      {/* Drawing Canvas */}
      <DrawingCanvas
        isOpen={isDrawingMode}
        onClose={() => setIsDrawingMode(false)}
      />

      {/* Admin Access Button - Hidden in bottom right corner */}
      <button
        onClick={() => (window.location.hash = "#admin")}
        className="fixed bottom-4 right-4 w-3 h-3 bg-transparent hover:bg-[#8774ff]/10 rounded-full transition-colors z-10"
        aria-label="Open admin panel"
        title="Admin access"
      />

      {/* Comment Mode Indicator (z-40) */}
      {isCommentMode && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
          <div className="bg-[#8774ff] text-white px-6 py-3 rounded-full shadow-lg animate-in fade-in slide-in-from-top-2">
            <p className="font-['Gaegu'] text-[18px] leading-[21.6px]">
              Click anywhere to add a comment
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
