# MR\_ROBOT\_2.4
09-04-2025
In my many, _many_ rewatches of this show, I always just saw the hacking portion and watched in awe. For this rewatch, however, I decided to do some more learning about the different topics and ideas that are presented. In this episode, Elliot logs onto Ray's computer (I won't get into spoiler territory) and logs into what I assume to be his home machine with PuTTY and connected to an IRC channel that consisted of only him and Darlene. Neglecting the fact that it would mean he would have had to have his pc running the entire time he was gone in order to connect to his system, I decided to try and replicate the series of events myself.

## Setup
I recently built a second pc which runs Fedora 42 linux. I keep it on practically 24/7 due to a minecraft server that demands that attention. This allows me to connect to it whenever I want. This makes it a perfect target device for what we will be experimenting with. The device we will be connecting onto the target machine with is my personal laptop (**an ASUS Zenbook**) that is running NixOS. I am setting this up using **OpenVPN** which would allow me to to tunnel into my home network from my laptop and SSH into my Fedora box even outisde my home Wi-Fi. This also opens up the option to route all my traffic through my home IP for privacy. OpenVPN is **open-source**, battle-tested, and well supported on both operating systems so it was a natural choice (its also just the best).

## Preparing the Target
Before even getting to the VPN just yet, I had to make sure that my Fedora box was ready for remote connections. Fedora by default most of the time comes with the ssh tools we will be using but just in case I always like to make sure they are downloaded.
```
sudo dnf install -y openssh-server
sudo systemctl enable sshd # To enable on boot
sudo systemctl start sshd
```
Next we need to adjust the firewall and make sure we can allow ssh services to pass through without issue.
```
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload
```

OpenVPN needs certificates and keys to handle encryption, so I installed both:
```
sudo dnf install -y openvpn easy-rsa
```
With Easy-RSA, I initialized a PKI and generated:
- A [Certificate Authority](https://www.digicert.com/blog/what-is-a-certificate-authority) (ca.crt)
- Server certificate and key (server.crt, server.key)
- [Diffie-Hellman parameters](https://wiki.openssl.org/index.php/Diffie-Hellman_parameters) (dh.pem)
- A client certificate and key for my laptop (mylaptop.crt, mylaptop.key)

## Configuring the OpenVPN Server
I copied Fedora's sample server config into place:
```
sudo mkdir -p /etc/openvpn/server
# some secret code that I shall not share but imagine copying server.conf to a secure location
```
Then edited the **server.conf** so the certificate paths pointed to the right files and added modern ciphers:
```
ca /secret/location/ca.crt
cert /secret/location/server.crt
key /secret/location/server.key
dh /secret/location/dh.pem

data-ciphers AES-256-GCM
data-ciphers-fallback AES-256-CBC
```
One thing that I completely missed the first time I was setting this up was pushing the LAN subet to clients so they could reach the machines inside my network. Without this change, I was unable to connect to the tunnel properly. Inside the **server.conf** file, I needed to add this line (or update the template if you are using that):
```
push "route <IP.INFORMATION.NONO> 255.255.255.0"
```
Once this was complete, you can attempt to run the command:
```
sudo systemctl start openvpn-server@server
# And if there are no errors you can enable this on boot with
sudo systemctl enable openvpn-server@server
```

## Port Forwarding and Networking
Since my Fedora box sits behind a home router, I needed to forward the UDP port 1194 from the router to my Fedora machines LAN IP. Without this, my client on the internet wouldn't be able to reach the OpenVPN service. The firewall also needed [masquerading](https://tldp.org/HOWTO/IP-Masquerade-HOWTO/ipmasq-background2.1.html) (to allow for more privacy on the internet). 
```
sudo firewall-cmd --permanent --add-masquerade
sudo firewall-cmd --permanent --add-interface=tun0 --zone=public
sudo firewall-cmd --reload
```

## Client Setup on NixOS
I am still a beginner in the NixOS environment so my system still feels very _fragile_ with the duct tape ricing I have done with it. Thankfully, NixOS allows for multiple iterations so if anything were to go wrong, I can just go back to a working version and start from there. Anyways, on my laptop, I installed OpenVPN in the environment packages and rebuilt the os. Then I created a **client.ovpn** file with this base configuration:
```
client
dev tun
proto udp
remote <MY_PUBLIC_IP> 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
data-ciphers AES-256-GCM
data-ciphers-fallback AES-256-CBC
verb 3

ca ca.crt
cert mylaptop.crt
key mylaptop.key
```
**NOTE:** You need to copy over the ca.crt, mylaptop.crt, and mylaptop.key in order to have the credentials to the vpn. You can do this with the scp command from your client device. If you have fastfetch installed, you need to enable it only on interactive terminals or an error will occur saying the text returned was too long.
**ANOTHER NOTE:** The **client.ovpn** _needs_ to be in the same folder as the **ca.crt**, **mylaptop.crt**, and **mylaptop.key** files (or whatever you decided to call them).

Then to connect to the vpn simply run the command and pray it works:
```
sudo openvpn --config ~/client.ovpn
```
If everything goes smoothly, somewhere in the connection strings that will appear you should see **Initialization Sequence Completed** which means the tunnel is live and you can connect via ssh (ssh user@public.ip.address)!


## Testing and Debugging
As I mentioned up further back, I had an issue when attempting to connect for the first time. First, the **Initialization Sequence Completed** would not appear and it would keep retrying. I found out that you need to put your crt and key files in a secure location (not just downloads/openvpn) in order for it to connect properly. Once that was completed, I got the dialogue I was looking for but when running the ssh command to connect to the Fedora box, it appeared to hang. This is when I realized that I needed to add the **push "route ..."** command that I mentioned before. After that was added I was able to get a prompt asking for the password into the ssh and I could connect. 

# Lessons Learned
I am still relatively new to the Linux environment so all of this was pretty much new to me. With the assistance of a lot of documentation and AI, I was able to complete this setup with _reasonable_ ease. I am sure there is probably a much easier and more efficient way to accomplish the same goal and perhaps in the future I will look into min/maxing that process. The whole atmosphere is still daunting and I feel like at any moment I can break everything beyond repair and end up spending a [linux evening](https://fabiensanglard.net/a_linux_evening/) fixing it all. That is one _great_ thing about NixOS that I kept seeing online, and have experience myself, that it is very easy to rollback to an older iteration that works properly. Here are some more key points that I learned throughout this process:
- OpenVPN works great, but every piece of the puzzle (certs, config, firewall, routing, port forwarding) needs to be in place. Miss one and you’ll be scratching your head.
- Tools like tcpdump are invaluable for figuring out where traffic is being dropped.
- NixOS as a client worked fine with a simple .ovpn file — no need for extra modules unless I want to run it as a service.
- Fastfetch/neofetch banners on the server can break scp/sftp if they output during non-interactive sessions (I hit that too!).

# What's Next?
Now that I have a working VPN:
- I can SSH into my Fedora server from anywhere.
- I can extend the config to route all traffic through my home internet if I want a personal “VPN provider.”
- I might even simplify this whole setup with WireGuard or Tailscale next, since they avoid the need for router port forwarding.

For now though, it feels great to have built my own secure pipeline back home — just like something Elliot would spin up in Mr. Robot. 🕶️
With that, my first _real_ blogpost is complete. Next I will be diving into the IRC rabbithole (if there even is one) to try and discover exactly how the **Dark Army** would communicate. 

Till next time,
GG's gamers!