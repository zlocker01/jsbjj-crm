import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import NewsletterModal from "@/components/landing-page/newsletter-modal";

const layoutUser = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-col min-h-screen justify-between dark:bg-darkGradientBg">
      <Header />
      <main className="mt-20">{children}</main>
      <Footer />
      <NewsletterModal />
    </div>
  );
};

export default layoutUser;
