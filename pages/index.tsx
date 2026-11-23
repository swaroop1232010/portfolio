import Head from "next/head";

import { profile } from "../data/content";
import { useMotion } from "../components/v2/useMotion";
import {
  Nav,
  Hero,
  Work,
  About,
  Cursor,
  Contact,
  Marquee,
  Writing,
  Services,
  Preloader,
  Experience,
} from "../components/v2/Sections";

export default function Home() {
  useMotion();
  const description =
    "Swaroop Reddy — Senior Full Stack Engineer (9+ years). Java, Spring Boot, React, Next.js, Kafka, and AI agents & RAG built into real products.";
  return (
    <>
      <Head>
        <title>{`${profile.name} — Senior Full Stack & AI Engineer`}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={`${profile.name} — Senior Full Stack & AI Engineer`} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="images/v2/rag-reranker.webp" />
        <meta name="theme-color" content="#0a0d0b" />
      </Head>
      <Preloader />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Work />
        <Services />
        <Writing />
        <Contact />
      </main>
    </>
  );
}
