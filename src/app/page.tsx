"use client";

import Footer from "@/components/footer";
import MemeController from "@/components/meme-controller";

export default function HomePage() {
  return (
    <>
      <main className="text-center mt-10">
        <section className="pt-10 pb-10">
          <h1 className="font-bokor text-6xl">Infinite Meme Machine 3000</h1>
          <p className="font-bebas text-2xl">Culture-coded chaos.</p>
        </section>

        <section className="pt-10 pb-10 px-8">
          <MemeController />
        </section>
      </main>

      <footer className="pt-50 pb-15">
        <Footer />
      </footer>
    </>
  );
}
