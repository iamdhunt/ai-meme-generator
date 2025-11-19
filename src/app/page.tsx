"use client";

import MemeController from "@/components/meme-controller";
import MemeGenerator from "@/components/meme-generator";
import MemeTemplates from "@/components/meme-templates";

export default function HomePage() {
  return (
    <main className="text-center mt-10">
      <section className="pt-10 pb-10">
        <h1 className="">LLF Meme Generator</h1>
        <p className="">Culture-coded chaos.</p>
      </section>

      <section className="pt-10 pb-10">
        <MemeController />
      </section>

      <section className="pt-10 pb-10">Caption selections go here</section>

      <section className="pt-10 pb-10 px-4">
        <MemeTemplates />
      </section>

      <section className="pt-10 pb-10">
        <MemeGenerator />
      </section>
    </main>
  );
}
