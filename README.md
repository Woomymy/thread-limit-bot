# Thread limit bots

Limits threads number per user

## Setup

### With docker compose (recommended)

Create a basic docker-compose.yml file with this content:

```yaml
version: "3"

services:
  server:
    image: ghcr.io/woomymy/thread-limit-bot:latest # Use the latest version, see GH releases for tags
    environment:
      - TOKEN=<YOUR_BOT_TOKEN>
    restart: always
```

### Using the public instance

A public instance is aviable with prefix `t!`

[Link](https://discord.com/oauth2/authorize?client_id=870998713076682773&scope=bot&permissions=8)
