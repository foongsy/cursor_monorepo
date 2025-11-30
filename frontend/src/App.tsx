import { Routes, Route } from "react-router-dom";
import { HomePage, ArticleDetailPage, CategoryPage } from "@/pages";

function App(): React.JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/article/:id" element={<ArticleDetailPage />} />
      <Route path="/category/:name" element={<CategoryPage />} />
    </Routes>
  );
}

export default App;
