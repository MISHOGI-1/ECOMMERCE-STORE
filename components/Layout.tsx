"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function Layout({ children }: { children: React.ReactNode }) {
  const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({
    backgroundColor: "#ffffff",
  });

  useEffect(() => {
    fetch("/api/settings/background")
      .then((res) => res.json())
      .then((data) => {
        if (data.backgroundType === "image" && data.backgroundImage) {
          setBackgroundStyle({
            backgroundImage: `url(${data.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
          });
        } else {
          setBackgroundStyle({
            backgroundColor: data.backgroundColor || "#ffffff",
          });
        }
      })
      .catch(() => {
        setBackgroundStyle({ backgroundColor: "#ffffff" });
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={backgroundStyle}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

