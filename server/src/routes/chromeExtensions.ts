import { type Request, type Response, Router } from "express";
import { logger } from "../config/logger.js";
import {
	chromeExtensionUrl,
	extractChromeUsers,
	isValidChromeExtensionId,
} from "../core/chromeExtensionUsers.js";
import { asyncHandler } from "../middleware/errorHandler.js";

const router: Router = Router();

const CACHE_TTL_MS = 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 8_000;
const STORE_HEADERS = {
	"user-agent":
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
	"accept-language": "en-US,en;q=0.9",
};

type CacheEntry = { users: number; fetchedAt: number };
const cache = new Map<string, CacheEntry>();

async function fetchUserCount(id: string): Promise<number | null> {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
	try {
		const response = await fetch(chromeExtensionUrl(id), {
			headers: STORE_HEADERS,
			signal: controller.signal,
		});
		if (!response.ok) {
			return null;
		}
		const html = await response.text();
		return extractChromeUsers(html);
	} catch (error) {
		logger.warn(
			`chrome-extension users fetch failed for ${id}: ${
				error instanceof Error ? error.message : String(error)
			}`,
		);
		return null;
	} finally {
		clearTimeout(timer);
	}
}

router.get(
	"/:id/users",
	asyncHandler(async (req: Request, res: Response) => {
		const idParam = req.params.id;
		const id = typeof idParam === "string" ? idParam : "";
		if (!isValidChromeExtensionId(id)) {
			return res
				.status(400)
				.json({ success: false, error: "Invalid extension id" });
		}

		const cached = cache.get(id);
		if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
			res.setHeader("X-Cache", "HIT");
			res.setHeader("Cache-Control", "public, max-age=3600");
			return res.json({ success: true, id, users: cached.users });
		}

		const users = await fetchUserCount(id);
		if (users === null) {
			res.setHeader("X-Cache", "MISS");
			return res
				.status(502)
				.json({ success: false, error: "Could not read user count" });
		}

		cache.set(id, { users, fetchedAt: Date.now() });
		res.setHeader("X-Cache", "MISS");
		res.setHeader("Cache-Control", "public, max-age=3600");
		return res.json({ success: true, id, users });
	}),
);

export default router;
