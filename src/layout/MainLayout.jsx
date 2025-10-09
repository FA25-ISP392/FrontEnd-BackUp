import { header as Header, footer as Footer } from "../components/ui";

export default function MainLayout({
  children,
  headerProps = {},
  showFooter = true,
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header {...headerProps} />

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
}
