# Homelab_0.2
11-18-2025
Welcome back! I see you are actually interested in this journey or are looking for some guidance and I am glad I can be of service. Lets dig in >:)

The first thing I did was update my **Fedora** to version **43** and update everything else I had. I also backed up all my stuff in case I broke it all (which is very likely). Next, I looked up what I needed to install for the container service. I ended up choosing **Docker** for its large documentation and popular usage. I followed the [documentation](https://docs.fedoraproject.org/en-US/quick-docs/installing-docker/) that Fedora provides regarding the installation and setup process.

Once Docker is setup and the user is created, we can test it out with a simple command:
```
sudo docker run hello-world
```
This output lets us know that it is set up and working and will print out an image. Now that this is working, I want to start setting up the **minecraft server**. The goal is to create a container that will always be running the minecraft server and can also have automatic backups and restarts available when needed.

## Setup Container
First, we need to create a folder to host our server. Initially, I was confused on what exactly this was. Was it a container? Was it just a folder? Well I found out. What I created initially is just a folder. We will be docking it to the docker with our yml file. For now, I just ran the following commands:
```
sudo mkdir -p /opt/minecraft
sudo chown -R $USER:$USER /opt/minecraft
```
This created the folder and gave permissions to the user. Next, I created a docker-compose file. This is where the magic happens. 
```
nano /opt/minecraft/docker-compose.yml
```
Here is what is contained in the file for reference:
```
services:
  minecraft:
    image: itzg/minecraft-server:latest
    container_name: minecraft
    ports:
      - "25565:25565"
    environment:
      EULA: "TRUE"
      TYPE: "PAPER"
      MEMORY: "6G"
      MAX_PLAYERS: "20"
      DIFFICULTY: "normal"
      ENABLE_COMMAND_BLOCK: "true"
      ONLINE_MODE: "true"     # change to false for cracked
      TZ: "America/Chicago"
    volumes:
      - ./data:/data:Z
    restart: unless-stopped
```
This gives us a server that is always running off of 6GB of RAM as well as utilizing PaperMC (my choice of server hosting). You can add some other stuff here but for now this is the simple file to get a basic server going. Once you have created this, you can run the command:
```
docker compose up -d
```
This makes Docker look into the folder for a yml file and run that. the "**-d**" means **discrete** mode where it is running in the background. You can also pull up the logs with the command:
```
docker logs -f minecraft
```
When running it the first time, I was unable to get it to work properly. This was due to a permission error with the data directory. I needed to run the following commands to fix it:
```
# Close the container
docker compose down

# Make sure the folder exists
sudo mkdir -p /opt/minecraft/data

# Give it to your user (or to uid 1000, which the container uses)
sudo chown -R $USER:$USER /opt/minecraft/data
chmod -R u+rwX,go+rX /opt/minecraft/data
```
Once this was done, I was able to load the server! If you want to host it online, feel free to portforward your router and provide that connection with your friends. Please **TAKE CAUTION** and understand the risks of this especially on a home lab connection. You might also have a world that has existed previously that you would like to migrate to this container. With docker, this is actually very simple. First, backup your server folder, just in case. Then, you can update the yml file that we made in the last step to point towards your server folder instead. You can do this by changes the following line in the yml file:
```
services:
  minecraft:
    ...
    volumes:
      - /home/you/mc-server:/data:Z   # <── use your real path here
```
With that, you should be able to boot up the container once more and get everything working! Also, you will need to make sure your **server.properties** files align with one another to avoid errors. 

## Portainer
If you want to make it visible on the portainer site (if you opted to use portainer), you might not notice it immediately as you should. Portainer will scan other containers connected to the socket and automatically pull it in. Sometimes, this does not happen though. If this is the case, you simply can add it manually through the wizard. On your portainer home menu, there should be an option to add an environment. Stick with the default docker comprise and choose the socket option. Once inside of that, add the following line to the socket url:
```
/var/run/docker.sock
```
**NOTE:** If you have not altered the SELinux permissions yet, this operation will fail. You **must** change them to either permissive across the system or allow it for just this instance.

Once you have done this, a new **local** environment will appear on your home screen. Click on that and it will show you the containers running on your system and one of those should be the minecraft server! Now you can go inside and inspect its usage and nerd things like that. 

## Automation
One of the reasons I wanted to get the server setup on a container using Docker (aside from saying I could do it), was to be able to automate better in a controlled space. The main things I wanted to do for now were to set up an **auto-start** on system reboot, create **automated backups**, and to have **scheduled server restarts**.

Thankfully for **auto-start**, this is not an issue at all. Docker is a **_background daemon_** meaning that it is always running even on reboot. So we can just add a line to our yml file that reads:
```
restart: unless-stopped
```
Next, we want to set up **automated backups**. The approach I am taking is to set a systemd timer. This is more reliable than some other services but there are definitely other options if you do not feel comfortable with this approach. We will be making three files: a timer, a service, and a script. You can think of it like a chain: [TIMER] → triggers → [SERVICE] → executes → [SCRIPT]. First, lets make the script.
```
sudo nano /opt/minecraft/backup.sh
```
Here is what the file contains:
```
#!/bin/bash

TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_DIR="/opt/minecraft/backups" 
DATA_DIR="/opt/minecraft/data" # Put server path here if already existing

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/mc-backup-$TIMESTAMP.tar.gz" -C "$DATA_DIR" .

# delete backups older than 30 days
find "$BACKUP_DIR" -type f -mtime +30 -delete
```
Save that and set execute permissions:
```
sudo chmod +x /opt/minecraft/backup.sh
```

Next, we need to create the systemd service.
```
sudo nano /etc/systemd/system/mc-backup.service
```
Here is what the file contains:
```
[Unit]
Description=Minecraft Backup

[Service]
Type=oneshot
ExecStart=/opt/minecraft/backup.sh
```

Now we can make the timer.
```
sudo nano /etc/systemd/system/mc-backup.timer
```
You know the drill:
```
[Unit]
Description=Weekly Minecraft Backup

[Timer]
OnCalendar=Sun 04:00
Persistent=true

[Install]
WantedBy=timers.target
```
Now we can enable it and check its status:
```
# Enable
sudo systemctl enable --now mc-backup.timer

# Check Status
systemctl list-timers | grep mc-backup
```
And there we go! You should recieve an output similar to this:

[INSERT IMAGE HERE]

I would also recommend making a backup right now to check that everything is set up properly. We can do this with a few steps:
```
# Run manual backup
sudo systemctl start mc-backup.service

# Check location of backups
ls /opt/minecraft/backups

# You should see something like this
# mc-backup-2025-011-20_04-00.tar.gz

# Extract it temporarily to confirm
mkdir /tmp/testbackup
tar -xzf /opt/minecraft/backups/mc-backup-*.tar.gz -C /tmp/testbackup
```
Inside of that, you should see the contents of your server. Go in and look around to make sure everything looks like it needs to.

Finally lets get to **scheduled server restarts**. This one is similar to the backups but much simpler. We are going to set a timer but all our script will do is run the built in docker restart command. Lets create the script first.
```
sudo nano /opt/minecraft/restart.sh
```
Here is what the file contains:
```
#!/bin/bash
docker restart minecraft
```
And then we can make it an executable:
```
sudo chmod +x /opt/minecraft/restart.sh
```

Next, we create the service file that points to our script.
```
sudo nano /etc/systemd/system/mc-restart.service
```
Blah blah file contents:
```
[Unit]
Description=Restart Minecraft Server

[Service]
Type=oneshot
ExecStart=/opt/minecraft/restart.sh
```

Now we can create the timer.
```
sudo nano /etc/systemd/system/mc-restart.timer
```
file:
```
[Unit]
Description=Daily Minecraft Restart

[Timer]
OnCalendar=04:00
Persistent=true

[Install]
WantedBy=timers.target
```

And now we can enable it and get regularly scheduled restarts.
```
sudo systemctl enable --now mc-restart.timer
```

Okay for now that should be enough yapping and coding. For now, we can probably end this blog. At this point you are either tired of reading or raging at code errors (I know it all too well). Going forward, I want to create a discord bot that will notify me of any crashes, errors and updates. If I continue with that development, I will create a post detailing all the steps I took. But for now, I think this post is over. I hope you enjoy the automated containerized minecraft server!

Till next time,
GGs Gamers!