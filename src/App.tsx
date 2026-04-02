import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Home = lazy(() => import("@/pages/Home"));
const Blog = lazy(() => import("@/pages/Blog"));
const Article = lazy(() => import("@/pages/Article"));
const Legal = lazy(() => import("@/pages/Legal"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ArticleKitDemo = lazy(() => import("@/pages/ArticleKitDemo"));
const ArticleEkoDrive = lazy(() => import("@/pages/ArticleEkoDrive"));
const ArticleFakeLicense = lazy(() => import("@/pages/ArticleFakeLicense"));
const ArticlePractical = lazy(() => import("@/pages/ArticlePractical"));
const ArticleDictionary = lazy(() => import("@/pages/ArticleDictionary"));
const ArticleCosts = lazy(() => import("@/pages/ArticleCosts"));
const ArticleExamErrors = lazy(() => import("@/pages/ArticleExamErrors"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050B14]">
      <div className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function LayoutContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      {!isHome && <Header />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Article />} />
          <Route path="/legal" element={<Navigate to="/legal/terms" replace />} />
          <Route path="/legal/:tab" element={<Legal />} />
          <Route path="/blog/kit" element={<ArticleKitDemo />} />
          <Route path="/blog/ekonomichnoe-vozhdenie" element={<ArticleEkoDrive />} />
          <Route path="/blog/poddelnyye-prava-ispaniya" element={<ArticleFakeLicense />} />
          <Route path="/blog/prakticheskiy-ekzamen" element={<ArticlePractical />} />
          <Route path="/blog/slovar-dgt" element={<ArticleDictionary />} />
          <Route path="/blog/tseny-na-prava" element={<ArticleCosts />} />
          <Route path="/blog/oshibki-ekzamen-vozhdeniya" element={<ArticleExamErrors />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LayoutContent />
    </BrowserRouter>
  );
}
