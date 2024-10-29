## Web3 Unleashed

Basic Next.js application to be used in a stream for Web3 Unleashed.

Branches will be created with stages for the rest of the implementation

## Instructions:

You are presented with a Next.js application that has a basic layout and a Context Provider. Your goal is to learn how to use the Metamask API to make this an application that users can interact with.

Few notes about the initial setup and constraints:

- You do not need any additional dependencies.
- The context provider is already setup so that any react code under [components](app/components/) and [pages](./pages/) can access the context using a hook.
- The context uses a reducer to manage state, so you can dispatch actions to update the state. Feel free to edit and add to the reducer as needed.
- Next.js runs in multiple environments, you will have to remember that Metamask is only available in the browser, so you will need to check for that before using it.

Have fun!

### 1 Basics: connecting the user

This is the time to get familiar with how to work with a Next.js application and Metamask.

- Verify if the user has Metamask installed or not. If not, link to the Metamask website. (hint: use the `window.ethereum` object)
- If the user has Metamask installed, offer the user to connect their wallet and save this information in the context. (hint: use the `window.ethereum.request` method)

### 2. Novice: use the Metamask API to get information about the user

- Now that the user can connect, display the wallet address, balance of the wallet.

### 3. Intermediate: Two way communication with Metamask

- Listen to changes in the wallet address and balance and update the UI accordingly.
- Add an option to add a new token to the wallet.

### 4. Bonus/Advanced: UX goodies

- Persist the wallet address and balance in the local storage.
- Add a button to disconnect the wallet.

### 5. Cleaning Up:

- removing event listeners if people disconnect

---
# You-Get

[You-Get](https://you-get.org/) is a tiny command-line utility to download media contents (videos, audios, images) from the Web, in case there is no other handy way to do it.

Here's how you use `you-get` to download a video from [YouTube](https://www.youtube.com/watch?v=jNQXAC9IVRw):

```console
$ you-get 'https://www.youtube.com/watch?v=jNQXAC9IVRw'
site:                YouTube
title:               Me at the zoo
stream:
    - itag:          43
      container:     webm
      quality:       medium
      size:          0.5 MiB (564215 bytes)
    # download-with: you-get --itag=43 [URL]

Downloading Me at the zoo.webm ...
 100% (  0.5/  0.5MB) ├██████████████████████████████████┤[1/1]    6 MB/s

Saving Me at the zoo.en.srt ... Done.
```
---
# yt-dlp
[yt-dlp](https://github.com/yt-dlp/yt-dlp.git)  is a feature-rich command-line audio/video downloader with support for [thousands of sites](supportedsites.md). The project is a fork of [youtube-dl](https://github.com/ytdl-org/youtube-dl) based on the now inactive [youtube-dlc](https://github.com/blackjack4494/yt-dlc).