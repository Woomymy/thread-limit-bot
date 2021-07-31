# Thread limit bots

Limits threads number per user

## Setup

### With docker compose (recommended)

Create a basic docker-compose.yml file with this content:

```yaml
version: "3"

services:
  server:
    image: woomy4680/thread-limit-bot:1.0.0 # Use the latest version, see GH releases
    environment:
      - TOKEN=<YOUR_BOT_TOKEN>
    restart: always
```
