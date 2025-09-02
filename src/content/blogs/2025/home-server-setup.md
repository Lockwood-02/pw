# 🖥️ Setting Up a Home Server Computer: A Beginner’s Guide

Running your own home server can unlock media streaming, private cloud storage, file backups, home automation, and more. This guide gets you from zero to a useful, secure server with clear, copy‑paste steps.

---

## What You’ll Build
- **Reliable box** that stays on 24/7 (or on-demand with Wake‑on‑LAN).
- **Remote access** over SSH (and optionally VPN).
- **Containerized apps** with Docker & Docker Compose.
- **Backups & monitoring** so you don’t lose data or uptime.

> Tip: Start small. Add services one by one as you gain confidence.

---

## 1) Decide Your Goals
Common use‑cases:
- **Media server** (Jellyfin, Plex, Emby)
- **File storage & sync** (Nextcloud, Syncthing, TrueNAS)
- **Home automation** (Home Assistant)
- **Personal Git** (Gitea, Forgejo)
- **Web apps** (blogs, dashboards, photo albums)
- **Game servers** (Minecraft, Valheim)

Write down your top 2–3 needs—this will guide hardware and OS choices.

```html

<div>
 <h1> This is a test </h1>
</div>

```


---

## 2) Hardware Basics (Pick One)
- **Repurpose an old PC / laptop** — Cheapest, great to learn.
- **Mini‑PC (NUC, MinisForum, Beelink)** — Quiet, efficient, small.
- **Used enterprise gear (ex: Dell OptiPlex)** — Inexpensive, expandable.
- **DIY build** — Custom performance, low idle power with recent CPUs.

Key specs:
- **CPU:** Any modern dual/quad‑core is fine to start. iGPU helps with media transcode.
- **RAM:** 8 GB (minimum), **16 GB+** if running many containers/VMs.
- **Storage:** SSD for OS/apps; add HDDs for bulk (media, backups). Consider **ZFS**/**Btrfs** for snapshots.
- **Network:** Gigabit Ethernet recommended (use wired where possible).
- **Power:** Lower idle watts = lower electricity bill over time.

---

## 3) Choose an Operating System
- **Ubuntu Server LTS** — Beginner‑friendly, huge community (recommended).
- **Debian** — Ultra‑stable, lightweight.
- **Proxmox VE** — If you want VMs + LXC containers + web UI.
- **TrueNAS SCALE** — If your main goal is a NAS with a nice UI.

> If you’re new, start with **Ubuntu Server LTS**. You can always migrate later.

---

## 4) Install & Update
1) Create a bootable USB and install the OS.
2) Create a regular user during install (avoid daily use of root).
3) After first login, update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

4) Install basic tools:

```bash
sudo apt install -y vim htop curl git ufw
```

---

## 5) Secure Remote Access (SSH + Firewall)
Install and enable SSH:
```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

Harden SSH (optional but recommended):
```bash
# Create an SSH key on your laptop/desktop (not the server):
ssh-keygen -t ed25519 -C "home-server"

# Copy your public key to the server:
ssh-copy-id youruser@SERVER_IP
```

Enable a basic firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw enable
sudo ufw status
```

> Later, consider disabling password logins in `/etc/ssh/sshd_config` (set `PasswordAuthentication no`) once keys work.

---

## 6) Give It a Static IP + Hostname
Set a hostname:
```bash
sudo hostnamectl set-hostname homeserver
```

Static IP (Ubuntu/netplan example – adjust to your network):
```yaml
# /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eno1:
      dhcp4: no
      addresses: [192.168.1.50/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1, 9.9.9.9]
```
Apply it:
```bash
sudo netplan apply
```

> Alternatively, reserve a static lease for the MAC address in your router’s DHCP settings.

---

## 7) Install Docker & Docker Compose
```bash
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker

# Optional: run docker as your user (log out/in after this)
sudo usermod -aG docker "$USER"
```

Create a folder for your stacks:
```bash
mkdir -p ~/stacks && cd ~/stacks
```

---

## 8) Example App: Jellyfin (Media Server)
```yaml
# ~/stacks/jellyfin/docker-compose.yml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    ports:
      - "8096:8096"
    volumes:
      - ./config:/config
      - /path/to/media:/media:ro   # point to your media folder
    restart: unless-stopped
```
Start it:
```bash
cd ~/stacks/jellyfin
docker-compose up -d
```
Open `http://SERVER_IP:8096` in your browser.

---

## 9) Reverse Proxy & HTTPS (Optional but Nice)
Run multiple apps cleanly under one domain with automatic HTTPS:
- **Nginx Proxy Manager** (simple web UI), or
- **Traefik** (more advanced, dynamic).

With Nginx Proxy Manager you can route `https://photos.example.com` → your photo app, `https://media.example.com` → Jellyfin, etc.

---

## 10) Backups You’ll Actually Keep
- **Configs & app data**: back up your Docker volumes (e.g., `~/stacks/**/config`).
- **Files**: use **restic** or **borg** to a second disk, NAS, or cloud bucket.
- **Snapshots**: if using ZFS/Btrfs, schedule snapshots and replication.

Example: quick restic setup (to a local disk path):
```bash
sudo apt install -y restic
export RESTIC_REPOSITORY=/mnt/backup/restic-repo
export RESTIC_PASSWORD=change-me
restic init

# Back up important folders:
restic backup ~/stacks /srv/data

# List snapshots:
restic snapshots
```

Cron a nightly backup:
```bash
crontab -e
# every day at 3:30am
30 3 * * * RESTIC_PASSWORD=change-me RESTIC_REPOSITORY=/mnt/backup/restic-repo /usr/bin/restic backup /home/youruser/stacks /srv/data
```

> Test restores! A backup you’ve never restored is only a hypothesis.

---

## 11) Remote Access Without Port Forwards (Safer)
Use a mesh VPN:
- **Tailscale** (easiest) or **WireGuard** (DIY).  
This gives your devices a secure private network so you can reach the server anywhere without exposing services to the internet.

Tailscale example:
```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```
Then connect from your laptop using the Tailscale IP.

---

## 12) Monitoring & Maintenance
- **System**: `htop`, `glances`, `df -h`, `journalctl -p err -n 100`
- **Docker**: `docker ps`, `docker logs <name>`, `docker stats`
- **Updates**:
```bash
sudo apt update && sudo apt upgrade -y
docker pull jellyfin/jellyfin && docker-compose up -d
```

Optional web monitors: **Uptime Kuma**, **Grafana + Prometheus**, **Netdata**.

---

## 13) Best Practices (Checklist)
- [ ] Use SSH keys, disable password auth after confirming keys work
- [ ] Separate OS SSD and data disks
- [ ] Back up configs + data, automate, and test restores
- [ ] Keep apps in Docker for easy upgrades/rollbacks
- [ ] Prefer VPN over public port forwards; if exposing, use HTTPS + strong auth
- [ ] Document your setup (a README in `~/stacks/` is gold)

---

## 14) Troubleshooting Quick Wins
- **Can’t reach server?** Check IP, cable, and `ufw status`. Try `ping SERVER_IP`.
- **App won’t start?** `docker logs <container>` and verify volume paths exist.
- **Port conflict?** Change the left‑hand port mapping in `ports:` (e.g., `8097:8096`).
- **Slow file transfers?** Use wired Ethernet; avoid old USB drives for data disks.
- **Disk filling up?** `docker system prune` (careful) and clean old logs/backups.

---

## Glossary (Fast)
- **NAS**: Network‑Attached Storage (file server).
- **RAID**: Redundancy across disks (not a backup). Still make backups.
- **ZFS/Btrfs**: Filesystems with snapshots and checksumming.
- **Reverse Proxy**: Front door that routes web requests to internal apps.
- **Compose**: YAML file describing multi‑container apps.

---

### You’re Ready
You now have a secure, updateable home server foundation. Add one service at a time, keep notes, and enjoy owning your stack.
