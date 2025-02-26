# Patreon Whitelist Bot for Discord

This bot is designed to sync Patreon roles with a game server whitelist using Discord roles. It connects to a database, reads role information, and updates the whitelist accordingly. This ensures that Patreon supporters get their respective in-game benefits.

## Features
- Sync Patreon roles to Discord and whitelist them in a game server
- Assign Steam64 IDs to users automatically
- Admin role synchronization for special permissions
- Supports buddy whitelisting for select Patreon tiers
- Web-based endpoint to serve the whitelist to the game server

## Installation
### Requirements
- Node.js
- A running MySQL or MariaDB database
- A Discord bot token
- A server with an open port for the web API

### Setup
1. Clone this repository.
2. Install dependencies using `npm install discord.js sequelize mysql2`.
3. Configure the environment variables in the script:
   - Replace `YOUR_SERVER_IP`, `YOUR_PORT`, `YOUR_DISCORD_BOT_TOKEN`, and `YOUR_DATABASE_URL` with your actual values.
4. Run the bot using `node bot.js`.

## Configuration
- **Buddy Count**: Determines how many friends a user can whitelist based on their Patreon tier.
- **Admin IDs**: Defines admin roles that have access to management functions.
- **Reverse ID Mapping**: Converts role IDs into readable role names for logging and display.

## Usage
- The bot listens for Discord role changes and updates the database accordingly.
- A web request to `/patreonwhitelist` will return the current whitelist in the required format.
- Users can link their Steam64 ID via Discord interaction buttons.

## Security Considerations
- Ensure that sensitive information, such as database credentials and bot tokens, are stored securely.
- Do not expose the database to public access.
- Use Discord role permissions to limit access to the admin panel.

## License
This project is open-source and can be modified to suit your needs.

