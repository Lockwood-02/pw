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

With all of this in mind, lets begin our home lab setup.... in the next blog >:)

Till next time,
GGs Gamers!