import { Router } from "express";
import { prisma } from "../db";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
    if (!req.session.userId) {
        res.status(401).json({ error: "Not logged in" });
        return;
    }
    next();
}

// list saved games for the logged-in user
router.get("/", requireAuth, async (req, res) => {
    const savedGames = await prisma.savedGame.findMany({
        where: { userId: req.session.userId },
        include: { game: true }
    });
    res.json({ savedGames: savedGames.map((sg) => sg.game) });
});

// save a game for the logged-in user
router.post("/", requireAuth, async (req, res) => {
    const { rawgId, name, imageUrl, description } = req.body as {
        rawgId?: unknown;
        name?: unknown;
        imageUrl?: unknown;
        description?: unknown;
    };

    if (typeof rawgId !== "number" || typeof name !== "string") {
        res.status(400).json({ error: "rawgId and name are required" });
        return;
    }

    try {
        const game = await prisma.game.upsert({
            where: { rawgId },
            update: {},
            create: {
                rawgId,
                name,
                imageUrl: typeof imageUrl === "string" ? imageUrl : null,
                description: typeof description === "string" ? description : null,
            }
        });

        await prisma.savedGame.upsert({
            where: { userId_gameId: { userId: req.session.userId!, gameId: game.id } },
            update: {},
            create: { userId: req.session.userId!, gameId: game.id }
        });

        res.status(201).json({ game });
    } catch (error) {
        res.status(500).json({ error: "Failed to save game" });
    }
});

// remove a game from the logged-in user's collection
router.delete("/:gameId", requireAuth, async (req, res) => {
    const { gameId } = req.params;

    try {
        await prisma.savedGame.delete({
            where: {
                userId_gameId: {
                    userId: req.session.userId!,
                    gameId,
                },
            },
        });

        res.json({ status: "ok" });
    } catch (error) {
        res.status(404).json({ error: "Game not found in collection" });
    }
});

export default router;