import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Trash2, Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { getBlog } from "@/services/blogs";
import type { Blog } from "@/types";
import { getCurrentUser } from "@/services/auth";
import { deleteBlog } from "@/services/blogs";
import { toast } from "sonner";

const BlogReader = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (!id) return;
    getBlog(id).then((b) => {
      if (b) setBlog(b);
      else navigate("/dashboard");
    });
  }, [id, navigate]);

  const [deleting, setDeleting] = useState(false);

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate("/dashboard")}
              className={cn(buttonVariants({ variant: "outline" }), "group")}
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Button>
            {currentUser && blog.authorId && currentUser.id === blog.authorId && (
              <div className="flex gap-2">
                <Button
                  className={buttonVariants({ variant: "outline" })}
                  onClick={() => navigate(`/editor?id=${blog.id}`)}
                >
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button
                  className={buttonVariants({ variant: "destructive" })}
                  disabled={deleting}
                  onClick={async () => {
                    try {
                      setDeleting(true);
                      await deleteBlog(blog.id);
                      toast.success("Blog deleted");
                      navigate("/dashboard", { replace: true });
                    } catch (e: any) {
                      toast.error(e?.message || "Failed to delete blog");
                    } finally {
                      setDeleting(false);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> {deleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            )}
          </div>

          <Card className="border-border bg-card shadow-card">
            <CardContent className="p-8 md:p-12">
              <article className="space-y-6">
                <header className="space-y-4 border-b border-border pb-6">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {blog.title}
                  </h1>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{blog.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </header>

                <div className="prose prose-invert max-w-none">
                  <p className="text-base md:text-lg leading-relaxed whitespace-pre-wrap text-foreground/90">
                    {blog.content}
                  </p>
                </div>
              </article>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default BlogReader;
