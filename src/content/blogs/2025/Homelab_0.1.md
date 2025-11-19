# Homelab_0.1
11-18-2025
If you have read my previous post (**NixOS_Rice.md**), you should know that I have a second pc that is running **Fedora Linux**. I have been enjoying it quite a bit but I would like to take things further with it. I knew in the past when making the second pc that there was such a thing as **selfhosting**. This was always an interest of mine but I was much too afraid to tackle it at the time. With having spent more time in Linux, I thought I might try to go ahead and set up a homelab. 

My father has something similar setup for media (things like **Plex** and such) that we use at home. I wanted to do something similar, but expand upon it. I wanted to still be able to host the minecraft server of course as well as being able to run some VMs to experiment with. Alongside this blog, I will be recording my experience messing with setting up a homelab to hopefully help others out there who might not know about this blog. I also want to show that it is not a simple straightforward task that is impossible to fail. There are a lot of people out there who watch tech videos that become discouraged because they might think that someone has a better skillset than them and can accomplish what they took forever to do in just a short amount of time. There is a great [video](https://www.youtube.com/watch?v=Uu2FQ2hW4_o) by **PrimeAgen** that covers something of this sort with the recent tech journey that PewDiePie has taken. If you ever feel you have imposter syndrome (as I have many times), please take some time to watch that video. 

To give you an idea of what I am working with, below is a list of the specs that I will be using for this home lab setup:
```
OS: Fedora Linux 43 (KDE Plasma Desktop Edition) x86_64
Kernel: Linux 6.17.7-300.fc43.x86_64
Shell: bash 5.3.0
Display (MSI G2712): 1920x1080 @ 165 Hz in 27" [External]
DE: KDE Plasma 6.5.2
CPU: Intel(R) Core(TM) i7-9700K (8) @ 4.90 GHz
GPU: NVIDIA GeForce GTX 1070 Ti [Discrete]
Memory: 4.49 GiB / 31.25 GiB (14%)
Disk (/): 86.05 GiB / 930.51 GiB (9%) - btrfs
```
According to some online research, this appears to be a pretty good setup. I must note as well, you do not _need_ a super modern setup. From what I can tell, my system is a little overkill as it is scraps from an older gaming setup. You can definitely perform just as fine on some older hardware. I encourage you really to start with something old or cheap to see if you would be interested in something like this. If you find you do, then upgrading becomes a more enticing option. But for now, we are sticking with my old gaming setup.

To give some context on what I want to do with my home lab (since really you can do so so much), is to host a minecraft server first and foremost, then host some virtual development environment that I can mess around in. As I have said in some previous posts, I really want to get into pen testing and cracking down on understanding networking, threats, and defense mechanisms. Having these virtual environments gives me a playground to mess around in. I also want to host some media but that is not the main priority for now.

Before we begin this adventure, I want to set up something that will make management much easier. In my research, I kept coming across something called **Portainer**. This _supposedly_ will give us a UI that lets us manage our Docker containers _as a container_. We can start with this command:
```
docker volume create portainer_data

docker run -d \
  -p 9000:9000 \
  --name portainer \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```
I want to break down what all this means as it is a little odd for a command.
**docker run -d**: This creates a new container and the "-d" at the end means _run detached_.
**-p 9000:9000**: This maps the port 9000 on your PC to port 9000 inside the container. You need this to access the UI at http://localhost:9000.
**--name portainer**: This just names the container _portainer_. This way, when we need to start/stop, we can just say "docker start/stop portainer".
**-v /var/run/docker.sock:/var/run/docker.sock**: This mounts the docker socket. We need to do this to give Portainer control of Docker itself.
**-v portainer_data:/data**: This maps the volume we just created earlier to Portainer's internal /data directory. This is where Portainer stores settings, users, templates, and container management metadata. It keeps all the configs even if the container is recreated.
**portainer/portainer-ce:latest**: This is the image we are running. In this case, its the latest.

Now that all of that is explained, lets actually run the damn thing. If all goes well, here is what it should look like:

[INSERT IMAGE HERE]

With all of this in mind, lets begin our home lab setup.... in the next blog >:)

Till next time,
GGs Gamers!