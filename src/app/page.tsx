"use client";

import MemeGenerator from "@/components/MemeGenerator";

export default function HomePage() {
  return (
    <main className="text-center mt-10">
      <section>
        <h1 className="">LLF Meme Generator</h1>
        <p className="">Culture-coded chaos.</p>
        <p className="">
          Pick a meme template, choose a vibe like Late-Stage Capitalism or Alt
          Culture, and let the bot create the chaos.
        </p>
      </section>

      <section>Topic buttons go here</section>

      <section>Caption selections go here</section>

      <section>Image templates go here</section>

      <section>
        <MemeGenerator />
      </section>
    </main>
  );
}
