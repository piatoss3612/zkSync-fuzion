import type { Metadata } from "next";
import { Baloo_2 } from "next/font/google";
import Providers from "./providers";
import "@rainbow-me/rainbowkit/styles.css";
import Layout from "@/components/layout";

const baloo2 = Baloo_2({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fuzion",
  description:
    "Deploy and Integrate your zkSync paymaster in an easy way with Fuzion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={baloo2.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
