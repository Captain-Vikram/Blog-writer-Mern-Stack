import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/auth";
import { createBlog, getBlog, updateBlog } from "@/services/blogs";

const Editor = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const blogId = params.get("id");

  // Load existing blog if editing (once)
  useEffect(() => {
    if (!blogId) return;
    let ignore = false;
    getBlog(blogId).then((b) => {
      if (b && !ignore) {
        setTitle(b.title);
        setContent(b.content);
      }
    });
    return () => {
      ignore = true;
    };
  }, [blogId]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const currentUser = getCurrentUser();
    const author = currentUser?.username || "Anonymous";
    if (blogId) {
      await updateBlog(blogId, { title, content });
    } else {
      await createBlog({ title, content, author });
    }

    toast.success("Blog published successfully!");
    navigate("/dashboard");
  };

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
          </div>

          <Card className="border-border bg-card shadow-card">
            <CardHeader>
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Write Your Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter a captivating title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background border-border focus:border-primary transition-colors text-lg h-12"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-lg">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="bg-background border-border focus:border-primary transition-colors min-h-[400px] resize-none text-base leading-relaxed"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {content.length} characters
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-primary hover:opacity-90 transition-opacity font-semibold"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {blogId ? "Update" : "Publish"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          {(title || content) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Preview
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {title && (
                    <h2 className="text-2xl font-bold">{title}</h2>
                  )}
                  {content && (
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {content}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Editor;
