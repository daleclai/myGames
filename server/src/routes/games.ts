import { Router } from "express";

const router = Router();
const RAWG_BASE_URL = "https://api.rawg.io/api";

interface RawgGame {
    id: number;
    name: string;
    background_image: string | null;
    description_raw?: string | null;
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
            imageUrl: game.background_image
        }));
        res.json({ games });
    } catch (error) {
        res.status(500).json({ error: "Unexpected error searching games" });
    }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const apiKey = process.env.RAWG_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfiguration: missing RAWG_API_KEY" });
    return;
  }

  try {
    const url = `${RAWG_BASE_URL}/games/${id}?key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      res.status(404).json({ error: "Game not found" });
      return;
    }

    const game = await response.json() as {
      id: number;
      name: string;
      background_image: string | null;
      description_raw?: string | null;
    };

    res.json({
      id: game.id,
      name: game.name,
      imageUrl: game.background_image,
      description: game.description_raw ?? null,
    });
  } catch (error) {
    res.status(500).json({ error: "Unexpected error fetching game details" });
  }
});


export default router;