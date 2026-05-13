import React, { useState, useRef, useEffect } from "react";
import { FigJamBackground } from "./components/FigJamBackground";
import { IconNavigation } from "./components/IconNavigation";
import { HomeSection } from "./components/HomeSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { MotionPlaygroundSection } from "./components/MotionPlaygroundSection";
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
// Firebase imports
import { db, auth } from "./utils/firebase/client";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  orderBy,
  query
} from "firebase/firestore";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getUserId } from "./utils/avatarUtils";

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
  // Authenticate anonymously for Firestore access & Handle Auth State
  const [user, setUser] = useState<any>(null);

  const sectionsRef = {
    home: useRef<HTMLDivElement>(null),
    projects: useRef<HTMLDivElement>(null),
    motion: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    contact: useRef<HTMLDivElement>(null),
  };

  const handleToggleDrawingMode = () => {
    setIsDrawingMode((prev) => {
      const next = !prev;

      if (next) {
        setPendingComment(null);
        setIsCommentMode(false);
      }

      return next;
    });
  };

  const handleCloseDrawingMode = () => {
    setIsDrawingMode(false);
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


  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is authenticated:", currentUser.uid);
        setUser(currentUser);
      } else {
        console.log("User is not authenticated, signing in...");
        signInAnonymously(auth).catch((error) =>
          console.error("Authentication failed:", error)
        );
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Real-time listener for comments - Only runs when user is authenticated
  useEffect(() => {
    if (!user) return;

    setIsLoadingComments(true);
    const q = query(collection(db, "comments"), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parsedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle Firestore Timestamp
          timestamp: data.timestamp?.toDate() || new Date(),
          replies: (data.replies || []).map((r: any) => ({
            ...r,
            timestamp: r.timestamp?.toDate ? r.timestamp.toDate() : new Date(r.timestamp)
          }))
        } as Comment;
      });
      setComments(parsedComments);
      setIsLoadingComments(false);
    }, (error) => {
      console.error("Failed to subscribe to comments:", error);
      setIsLoadingComments(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddComment = async (x: number, y: number, text: string) => {
    try {
      // Validate inputs
      if (!text || !text.trim()) {
        alert("Please enter a comment");
        return;
      }

      if (typeof x !== "number" || typeof y !== "number" || isNaN(x) || isNaN(y)) {
        console.error("Invalid coordinates:", { x, y });
        alert("Invalid position. Please try again.");
        return;
      }

      const normalizedX = x / window.innerWidth;
      const normalizedY = y / document.documentElement.scrollHeight;
      const userId = getUserId();

      if (!userId) {
        alert("Failed to identify user. Please try again.");
        return;
      }

      const newComment = {
        x,
        y,
        normalizedX,
        normalizedY,
        text: text.trim(),
        userId,
        author: userName === "me" ? "anonymous" : userName || "anonymous",
        pagePath: window.location.pathname || "/",
        timestamp: serverTimestamp(),
        status: 'open',
        replies: []
      };

      console.log("Attempting to add comment:", newComment);
      const docRef = await addDoc(collection(db, "comments"), newComment);

      console.log("✅ Comment posted successfully with ID:", docRef.id);
      setPendingComment(null);
      setIsCommentMode(false);

    } catch (error) {
      console.error("❌ Failed to add comment:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message, error.stack);
      }
      alert("Failed to post comment. Check console for details.");
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await deleteDoc(doc(db, "comments", id));
      if (activeCommentId === id) {
        setActiveCommentId(null);
      }
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleAddReply = async (commentId: string, text: string) => {
    try {
      const userId = getUserId();
      console.log("Attempting to add reply to comment:", commentId);
      const commentRef = doc(db, "comments", commentId);

      // We need to fetch the comment first to append to replies 
      // or use arrayUnion if we structured it that way, but arrayUnion with objects is tricky if we want exact equality.
      // Better to read-modify-write for complex objects or just push a new object with ID.
      // Ideally replies should be a subcollection, but for now we keep the existing structure (array of objects).

      // Let's use a transaction or just simple update for MVP
      const commentDoc = comments.find(c => c.id === commentId);
      if (!commentDoc) return;

      const newReply = {
        id: crypto.randomUUID(),
        text: text.trim(),
        userId,
        author: userName === "me" ? "anonymous" : userName || "anonymous",
        timestamp: new Date() // We store as Date in local, but Firestore prefers Timestamps. 
        // Ideally we should use Timestamp for consistency, but let's stick to what works for the UI.
        // We will cast it to any to bypass the type check for the update, Firestore will convert Date to Timestamp automatically.
      };

      const updatedReplies = [...(commentDoc.replies || []), newReply];

      await updateDoc(commentRef, {
        replies: updatedReplies
      });

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
      const normalizedX = x / window.innerWidth;
      const normalizedY = y / document.documentElement.scrollHeight;

      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        x,
        y,
        normalizedX,
        normalizedY
      });

    } catch (error) {
      console.error("Failed to update position:", error);
      // Real-time listener will handle revert automatically
    }
  };

  const handleResolveComment = async (commentId: string, resolved: boolean) => {
    try {
      if (activeCommentId === commentId && resolved) {
        setActiveCommentId(null);
      }

      // If resolving, we just delete it based on previous logic? 
      // The previous logic had a "resolve" endpoint AND a "delete" endpoint.
      // But the UI only showed "Resolve" button which called onResolveComment -> calls DELETE endpoint.
      // So effectively resolve == delete in the old code for the backend.
      // But the old code also had a status 'resolved' in the interface.
      // Let's implement true 'resolve' (hide) data-wise, or just delete if that's what the user wants.
      // Looking at old code: onResolveComment called DELETE endpoint.
      // So I will stick to DELETE for now to match behavior.

      await deleteDoc(doc(db, "comments", commentId));

    } catch (error) {
      console.error("Failed to resolve comment:", error);
    }
  };

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

    // TODO: Migrate user-joined notification to Firebase Functions or keep as simple log?
    // For now we skip the backend call or we can create a 'visitors' collection in Firestore
    try {
      await addDoc(collection(db, "visitors"), {
        userName: name,
        timestamp: serverTimestamp()
      });
      console.log("✅ User-joined logged to Firestore");
    } catch (error) {
      console.warn("⚠️ User-joined log failed:", error);
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

      if (isDrawingMode) {
        return;
      }

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
        handleToggleDrawingMode();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleDrawingMode, isCommentMode, isDrawingMode, pendingComment]);

  // If admin mode is active, show admin panel only
  if (showAdmin) {
    return <AdminPanel />;
  }

  return (
    <div
      className={`relative isolate w-full min-h-screen flex flex-col ${isCommentMode
        ? "cursor-crosshair"
        : !isDrawingMode && userName && userCursorColor
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
      {userName && userCursorColor && !showAdmin && !isCommentMode && !isDrawingMode && (
        <CursorFollower name={userName} color={userCursorColor} />
      )}

      {/* Collaborative Cursors - show other users' cursors (z-60) */}
      {userName && userCursorColor && (
        <CollaborativeCursors
          userName={userName}
          userColor={userCursorColor}
          isActive={!showAdmin && !isCommentMode && !isDrawingMode}
        />
      )}

      {/* Main content wrapper for comments to stick to */}
      <main
        className="relative w-full"
        onClick={handlePageClick}
      >
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

        <div ref={sectionsRef.motion}>
          <MotionPlaygroundSection />
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
        onToggleDrawingMode={handleToggleDrawingMode}
      />

      {/* Drawing Canvas */}
      <DrawingCanvas
        isOpen={isDrawingMode}
        onClose={handleCloseDrawingMode}
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
