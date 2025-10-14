import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface BlogCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  index: number;
}

export const BlogCard = ({ id, title, content, author, date, index }: BlogCardProps) => {
  const navigate = useNavigate();
  const preview = content.length > 150 ? content.substring(0, 150) + "..." : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card 
        className="group h-full overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-glow cursor-pointer"
        onClick={() => navigate(`/blog/${id}`)}
      >
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-3 text-muted-foreground">
            {preview}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(date).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
