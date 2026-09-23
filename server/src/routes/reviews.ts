import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    res.status(401).json({ error: "Not logged in" });
    return;
  }
  next();
}

router.get("/:gameId", async (req, res) => {
  const { gameId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { gameId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ reviews });
});

router.post("/:gameId", requireAuth, async (req, res) => {
  const { gameId } = req.params;
  const { text } = req.body as { text?: unknown };

  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "Review text is required" });
    return;
  }

  try {
    const review = await prisma.review.create({
      data: {
        userId: req.session.userId!,
        gameId,
        text: text.trim(),
      },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: "Failed to save review" });
  }
});

router.delete("/:reviewId", requireAuth, async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review || review.userId !== req.session.userId) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    await prisma.review.delete({ where: { id: reviewId } });
    res.json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;