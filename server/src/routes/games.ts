import { Router } from "express";

const router = Router();
const RAWG_BASE_URL = "https://api.rawg.io/api";

interface RawgGame {
  id: number;
  name: string;
  background_image: string | null;
  description: string;
  rating: number;
}

interface RawgResponse {
  results: RawgGame[];
}

router.get("/search", async (req, res) => {
    const q = req.query.q as string;
    if (typeof q !== "string" || !q.trim()) {
        res.status(400).json({ error: "Query parameter 'q' is required" });
        return;
    }

    const apiKey = process.env.RAWG_API_KEY;
    if (!apiKey) {
        res.status(500).json({ error: "Server misconfiguration: missing RAWG_API_KEY" });
        return;
    }

    try {
        const url = `${RAWG_BASE_URL}/games?key=${apiKey}&search=${encodeURIComponent(q)}`;
        const response = await fetch(url);

        if (!response.ok) {
            res.status(500).json({ error: "Failed to fetch data from RAWG API" });
            return;
        }

        const data = (await response.json()) as RawgResponse;

        const games = data.results.map(game => ({
            id: game.id,
            name: game.name,
            imageUrl: game.background_image,
            description: game.description,
            rating: game.rating,
        }));
        res.json({ games });
    } catch (error) {
        res.status(500).json({ error: "Unexpected error searching games" });
    }
});

export default router;