import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PenLine, LogOut, User, Pencil } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/dashboard");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/dashboard" className="flex items-center space-x-2 group">
            <div className="relative">
              <PenLine className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-primary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Chronicle Blog
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/editor"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "group")}
                >
                  <Pencil className="h-4 w-4 mr-2 transition-transform group-hover:-rotate-6" />
                  Write
                </Link>
                <Button
                  onClick={handleLogout}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "group")}
                >
                  <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:rotate-12" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "group")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={cn(buttonVariants({ variant: "default", size: "sm" }), "group")}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
