
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          The page at {location.pathname} could not be found.
        </p>
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
