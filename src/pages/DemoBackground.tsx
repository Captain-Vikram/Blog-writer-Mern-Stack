import { Navbar } from "@/components/Navbar";
import { BackgroundPaths } from "@/components/ui/background-paths";

const DemoBackground = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BackgroundPaths title="Background Paths" />
    </div>
  );
};

export default DemoBackground;
