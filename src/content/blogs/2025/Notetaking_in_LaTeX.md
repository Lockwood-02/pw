# Notetaking\_in\_LaTeX
09-18-2025
Up until about two years ago, I had never heard of **LaTeX**. It wasn't until I started my graduate studies that I became aware of its presence. If you did not know, LaTeX is "a document preparation system that's particularly well-suited for creating high-quality technical and scientific documents, especially those containing mathematical equations". In essence, it is a programming language for plain text. It can be used to format documents to appear concise and professional (especially compared to things like _word_). I used a website called Overleaf to utilize LaTeX when writing my thesis. I must say, it was very nice to use. I could not imagine writing that same thesis is word and how much of a pain that would have been. With a little bit of setup, LaTeX makes everything so much more consistent and clean. 

## Preamble
I am wanting to switch from Overleaf (nothing wrong with it, but some things are locked behind a paywall) and swap to taking notes in **VSCode**. As you might now know, I am running a **Mint Linux** machine. This will also be the first time I set up LaTeX in VSCode so everything is new in this setup. Im sure it would be fairly similar in other distros but for things like Windows, I think it will be quite different (in an easier, good way). I am following a guide laid out in this [github repo](https://github.com/blxkex/Latex-Notes-Templates) which provides two templates for LaTeX. The user does mention a setup in Arch, Windows, and MacOS but as I said before, we will be setting up on Lint, as I like to call it.

## Setup
Firstly, I have to install **texlive**. This will install all the packages, compilers, etc., that I would need.
```
sudo apt update
sudo apt install texlive-full
```
Next, I installed extensions for VSCode, these being **LaTeX Workshop**, and **HyperSnips**. If you follow HyperSnips setup guide, they instruct the use of, in our case, a latex.hsnips file. I'll be a gem and put the link for the file [here](https://github.com/sleepymalc/VSCode-LaTeX-Inkscape/blob/main/VSCode-setting/Snippets/latex.hsnips). You should download this file in your respective OS location for the extension. Below are the locations but I would highly recommend also following the README from the repo just listed.
```
Windows: %APPDATA%\Code\User\globalStorage\draivin.hsnips\hsnips\(language).hsnips
Mac: $HOME/Library/Application Support/Code/User/globalStorage/draivin.hsnips/hsnips/(language).hsnips
Linux: $HOME/.config/Code/User/globalStorage/draivin.hsnips/hsnips/(language).hsnips
```
After this, you can clone the repo to get a taste of what LaTeX is all about and see it in action.
```
git clone https://github.com/blxkex/Latex-Notes-Templates.git
cd Latex-Notes-Templates
```
These templates give you a basic understanding of what we will be trying to accomplish in our own notetaking sessions. I am going to work on my own preamble.sty file to give a basic format that I enjoy with the knowledge I have learned from this repository.

## Setup Cont.
The first thing I did was set up a github repository. This way, no matter where I am, I have access to these notes and can make changes from anywhere with a connection (or save some changes locally and update when connected). Next, I knew that LaTeX created a lot of output files based on the experimenting that I did with the repository, so I added the **.gitignore** to ignore the random trash that it outputs. 

Next, I created a local **settings.json** file that would act as the repositories settings with LaTeX. This allowed me to also store all of the output files into an "out" folder within the notebook it is contained in. This just helps declutter the VSCode sidebar with a bunch of files and keeps it neat. You can find my settings file [here](https://github.com/Lockwood-02/LaTeX-Journal/blob/main/.vscode/settings.json) if you'd like.

After that, I just made three sample notebooks for three different subjects. I tested out the LaTeX Workshop functionality and got everything working with the preamble. Below is what the file structure looks like:
```
LaTeX-Journal/
├─ README.md
├─ .gitignore
├─ preamble/
│  └─ journal-preamble.sty
├─ .vscode/
│  └─ settings.json
├─ Mathematics/
│  └─ Calculus/
│     ├─ main.tex
|     ├─ out/
|     |  └─ *bunch of junk
|     |  └─ main.pdf (This is the final note)
│     └─ images/
|        └─ example.jpg
├─ Cyber-Security/
│  └─ Blue-team-notes/
│     ├─ main.tex
│     └─ images/
└─ Astro-Physics/
   └─ Intro/
      ├─ main.tex
      └─ images/
```

When it comes to actually taking notes with LaTeX, I am quite inexperienced. This was more of a setup guide for you the reader (who is possibly me in the future after I forgot how to do this), and a starting point to my more _professional_ style notetaking. There are still some things that I want to incorporate into the LaTeX note taking style I am adopting such as graph and drawing integration, but that will come from later articles. For now, that Is all I have for you.

Till next time,
GGs gamers!