# FREE-BUILDER

The published site for **www.freebuilder.net**. Built by `build/release.py` (in the private `nearby-source` repo); the folders below are what the release produces.

| Folder | What lives there |
|---|---|
| `/` | The FREE//BUILDER homepage (L&D practice) |
| `tools/` | Practice tools for pairs and groups: listen, swap, repair, twotruths, prompt, museum, manual, teachback, questions, discovery, dial, decide, diagnose, cost, room, thanks, design |
| `labs/` | Larger demos: coach, cq, sales, launchpad |
| `programmes/` | Programmes and concepts: circles, managers, rituals, facilitator, frontline, impact |
| `notes/` | Short pieces: adapted, ai, ai-use |
| `kit/`, `guide/`, `privacy/` | Starter kit, facilitator pack, privacy page |
| `nearby/` | **Nearby**, the town. Each place is a folder: next-door, borrowed-pages, say-hello, handoff, neighbours-brew, same-song, plant-a-friend, two-candles, late-light, lie-back, come-home, station, mended, hold-on, slow-clock, miso-and-yuzu |
| `learn/` | Language rooms: cat, es, yue, chengyu, cymraeg |
| `fbkit/`, `vendor/`, `fonts/` | Shared code, third-party scripts and fonts, served from this site (no CDNs) |

Old addresses (`/game/…`, `/listen/`, `/language_learning/…`, …) are small redirect pages, and `404.html` forwards anything deeper. The map from old to new is `build/migrate/paths.json` in the source repo.

Editing here on GitHub is fine: the release checks for your commits before it publishes.
