release:
	bun install --frozen-lockfile
	bun run build:js
	bun run build:mac -- --publish never

config:
	cat ~/Library/Application\ Support/Meru/config.json