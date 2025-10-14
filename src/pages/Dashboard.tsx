import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { BlogCard } from "@/components/BlogCard";
import { listBlogs } from "@/services/blogs";
import type { Blog } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    listBlogs().then(setBlogs);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Discover Stories
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore thoughts, ideas, and knowledge from our community
          </p>
        </motion.div>

        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground mb-6">No blogs yet. Be the first to write!</p>
            <Button
              onClick={() => navigate(user ? "/editor" : `/login?from=${encodeURIComponent('/editor')}`)}
              className="gradient-primary hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Write Your First Blog
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, index) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                author={blog.author}
                date={blog.date}
                index={index}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8"
      >
        <Button
          onClick={() => navigate(user ? "/editor" : `/login?from=${encodeURIComponent('/editor')}`)}
          className="h-14 w-14 rounded-full gradient-primary shadow-glow hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        >
          <PlusCircle className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </motion.div>
    </div>
  );
};

export default Dashboard;
