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
Once this was done, I was able to load the server! If you want to host it online, feel free to portforward your router and provide that connection with your friends. Please **TAKE CAUTION** and understand the risks of this especially on a home lab connection. You might also have a world that has existed previously that you would like to migrate to this container. with docker, this is actually very simple. First, backup your server folder, just in case. Then, you can update the yml file that we made in the last step to point towards your server folder instead. You can do this by changes the following line in the yml file:
```
services:
  minecraft:
    ...
    volumes:
      - /home/you/mc-server:/data:Z   # <── use your real path here
```
With that, you should be able to boot up the container once more and get everything working!

## Automation

Till next time,
GGs Gamers!