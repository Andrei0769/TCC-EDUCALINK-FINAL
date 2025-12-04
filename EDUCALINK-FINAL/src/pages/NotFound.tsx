
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-edulink-100 text-edulink-600">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="text-5xl font-bold text-edulink-700 mb-4">404</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
          Oops! Parece que esta página não existe ou foi movida.
        </p>
        <Button asChild size="lg" className="bg-edulink-600 hover:bg-edulink-700">
          <Link to="/">
            <Home className="mr-2 h-5 w-5" />
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
