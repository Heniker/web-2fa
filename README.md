# 2FA Manager in Browser

wip

Type checking is done by [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)

# Why yet another 2FA app?
Web-2FA works in the browser, so you can use the same app to access your 2FA codes on your phone and PC - without installing anything.

### Security

Data is encrypted and stored locally. No server is used.
The project uses native [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) to encrypt and decrypt stored information.<br/>
Security related functionality can be found in `src/services/Security.ts`

### Contributing

Set VSCode to use built-in TypeScript version.

### Similar projects

[Authenticator (browser extestion)](https://github.com/Authenticator-Extension/Authenticator)<br/>
[Aegis Authenticator (mobile app)](https://github.com/beemdevelopment/Aegis)<br/>
[KeePassXC (desktop password manager)](https://github.com/keepassxreboot/keepassxc)

<!--


The problem with WebRTC is that it's not possible to do data transfer without initial connection via Signaling server. Won't work even on the local network.
WebRTC requires 2 way communication (request & response) to initiate the connection. So scanning QR codes is not convenient to say the least.
One option (besides implementing Signaling) is to use sound - https://github.com/ggerganov/ggwave.

To aid in device discovery a signaling server is required. If you select any of the options below a request to ... will be made. Signaling server won't handle any data transfer. It is not guranteed to work if your devices are behind heavy NAT or firewall. TURN server will never be used.

Create sync code / Enter sync code

notes:
fuse.js otpauth vue-qrcode-reader
should not be part of main bundle (use lazy-loading)

todo:
test qr code support on mobile
test app with all permisions off

fix search on mobile
fix clicking on sidebar when route is active

? Hide tokens during initial render (to avoid flicker with reduced animations setting)
keyboard navigation (& esc to close any dialog)
backup & restore to/from file
Create new token suggestion if no tokens were added
Dran'n'Drop QR code image & config, backup files
ServiceWorker & fully offline usage
data sync with WebRTC
icons specific for issuer
qr scan from screen reader
reconsider usage of vue-qrcode-reader
  It does not allow to use Screen Capture API (idk why it's not supported rn)
  It uses https://github.com/Sec-ant/barcode-detector under the hood, which does all the heavy lifting
remove teleport to appbar
translations?
disable progressbar during dragging
notify user on invalid progressBarStyle setting change
research into using biometrics to unlock vault

remove usage of otpauth completely
add aria attributes to buttons, imgs, etc
icons for accounts
? custom clock & time sync?
? copy code to clipboard on `url/id` open
? Add visual tracking to qr detection

done:
steam account support
move otpauth to different lazy chunk
tokens should use single setInterval/setTimeout for each period (minor performance optimization)
handle wrong token secret
fuzzy search
handle wrong password input
handle settings updates:
  passwordKeepAlive
  theme
  progressBarStyle
copy code on click
toggle show password should remember cursor position
DnD
? simple editing on mobile
See if Sortable is better for list reordering
  https://github.com/SortableJS/Sortable
  https://vueuse.org/integrations/useSortable



edge messes up timers even when page is visible. user has to make clicks on page for it not to throttle
this makes animation timings wrong. Also token's code generation can be delayed by up to 1 second
check this
```
var lastRunTime = 0
var expectedTime = 5000
function test() {
  lastRunTime && console.log(Date.now() - lastRunTime - expectedTime)
  lastRunTime = Date.now()
  setTimeout(test, expectedTime)
}
test()
```
the solution currently implemented to remedy this is terrible
I guess microsoft prefers when its users have to suffer

-->
