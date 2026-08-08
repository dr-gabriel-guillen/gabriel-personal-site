import type { Metadata } from "next";
import { DisambiguationPage } from "@/components/disambiguation-page";
import { alternatesFor } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Which Gabriel Guillén? — Gabriel Guillen-Gonzalez, California attorney #361094",
  description:
    "Several people share this name. I am the California attorney, State Bar licence #361094, founder of Guillen-Gonzalez Law PC in San Jose — not the Middlebury linguistics professor and not the physicians who share the name.",
  alternates: alternatesFor("/disambiguation"),
};

export default function Page() {
  return <DisambiguationPage lang="en" />;
}
