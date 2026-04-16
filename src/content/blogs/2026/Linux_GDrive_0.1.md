# Linux_GDrive
2-04-2026
For my second PC setup, I have a keyboard that I absolutely love to type on. I wanted to write my DnD campaign on it without moving it to my main pc because I am lazy. I keep my DnD notes in an **Obsidian** vault in my **Google Drive** folder. This way, I can move between my laptop and PC and still have all of my notes synced up without needing to buy the premium features that Obsidian has. Unfortunately, Linux does not have the Google Drive app. Instead, they have something called **Rclone**. This is a third party application that mounts to your drive (and other storage connections if you wish), and acts just like the Google Drive folder.

# Setup
First, we need to install the software. I am using **Fedora Linux** so my install looks like this:
```
sudo dnf install rclone 
```
Once we get it installed, we nee to tell Rclone "Hey, this Google account is my cloud storage". Next we run:
```
rclone config
```
Then we follow the prompts. I just named my drive gdrive to keep it simple. It will ask you to sign into your google account to get things set up. Once you do that you should be good to go but we are going to mount the drive to a folder. To first check if it connected properly, run the command:
```
rclone ls gdrive:
```
If you see your files lilsted, your drive is connected!

# Mounting
Now that we have connected and confirmed, lets actually make a folder to store it all in. Place a folder wherever you want and name it what you want (in my case I just put a folder called GoogleDrive in my home directory). Then we can run a command to mount our rclone connection to the folder we just made. Note, in order to have the contents appear in the folder, you need to actually run the command below and keep it running in the background. We will also setup automatic activation here in a minute. Here is the command to mount and run:
```
rclone mount gdrive: ~/GoogleDrive --vfs-cache-mode full
```
Now when you go to the folder location, all of your files should be there. We can now open Obsidian and direct it to the folder path that you have set up and it should all be there!

# Automation
Instead of running it with the terminal open, you can run the following command:
```
rclone mount gdrive: ~/GoogleDrive --vfs-cache-mode full --daemon
```
We can also set it up so that it will run when we log in. Lets first create a service file and fill it in with the data below:
```
mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/rclone-gdrive.service

# And fill it in with the data

[Unit]
Description=Rclone Google Drive Mount
After=network-online.target

[Service]
Type=notify
ExecStart=/usr/bin/rclone mount gdrive: %h/GoogleDrive --vfs-cache-mode full
ExecStop=/bin/fusermount -u %h/GoogleDrive
Restart=on-failure

[Install]
WantedBy=default.target
```
Now we enable it with the following commands:
```
systemctl --user daemon-reload
systemctl --user enable rclone-gdrive
systemctl --user start rclone-gdrive
```
Now when you log in, the process will start up and you are good to go!

Till next time,
GGs gamers!