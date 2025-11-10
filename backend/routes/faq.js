import { Router } from "express";
import { faqs } from "../data/faqs.js";

const router = Router();

const normalize = (str = "") => str.toLowerCase();

const scoreFaq = (faq, queryTokens) => {
  if (!queryTokens.length) return 0;

  const question = normalize(faq.question);
  const answer = normalize(faq.answer);
  const tags = faq.tags?.map(normalize) ?? [];

  let score = 0;

  queryTokens.forEach((token) => {
    if (!token) return;
    if (question.includes(token)) score += 3;
    if (answer.includes(token)) score += 2;
    if (tags.some((tag) => tag.includes(token))) score += 1;
  });

  return score;
};

router.get("/", (_req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.json({ faqs });
});

router.get("/search", (req, res) => {
  const query = req.query.q;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Missing search query parameter 'q'" });
  }

  const normalizedTokens = normalize(query)
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const scoredFaqs = faqs
    .map((faq) => ({ faq, score: scoreFaq(faq, normalizedTokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ faq }) => faq);

  const results = scoredFaqs.length > 0 ? scoredFaqs : faqs.slice(0, 3);

  res.set("Cache-Control", "no-store, no-cache, must-revalidate");
  res.json({
    query,
    results,
    fallback: scoredFaqs.length === 0,
  });
});

export default router;
