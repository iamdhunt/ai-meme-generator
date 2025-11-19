"use client";

import MemeGenerator from "@/components/meme-generator";
import MemeTemplates from "@/components/meme-templates";
import Tones from "@/components/tones";
import Vibes from "@/components/vibes";

export default function HomePage() {
  return (
    <main className="text-center mt-10">
      <section className="pt-10 pb-10">
        <h1 className="">LLF Meme Generator</h1>
        <p className="">Culture-coded chaos.</p>
      </section>

      <section className="pt-10 pb-10">
        <Vibes />
      </section>

      <section className="pt-5 pb-10">
        <Tones />
      </section>

      <section className="pt-10 pb-10">Caption selections go here</section>

      <section className="pt-10 pb-10">
        <MemeTemplates />
      </section>

      <section className="pt-10 pb-10">
        <MemeGenerator />
      </section>
    </main>
  );
}
