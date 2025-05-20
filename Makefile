release:
	bun install --frozen-lockfile
	bun run build:js
	bun run build:mac -- --publish never