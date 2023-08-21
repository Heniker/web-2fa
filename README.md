# 2FA Manager in Browser

wip

Type checking is done by [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)

### Security

Data is encrypted and stored locally. No server is used.
The project uses native Web Crypto API to encrypt and decrypt stored information.<br/>
Security related functionality can be found in `src/services/Security.ts`

### Contributing

Set VSCode to use built-in TypeScript version

### Similar projects

[Authenticator (browser extestion)](https://github.com/Authenticator-Extension/Authenticator)<br/>
[Aegis Authenticator (mobile app)](https://github.com/beemdevelopment/Aegis)<br/>
[KeePassXC (desktop password manager)](https://github.com/keepassxreboot/keepassxc)

<!--

todo:
test qr code support

handle settings updates:
  progressBarStyle
steam account support
Hide tokens during initial render (to avoid flicker)
keyboard navigation (& esc to close any dialog)
fuzzy search functionality
data sync with WebRTC
icons specific for issuer
Dran'n'Drop QR code image & config, backup files
reconsider usage of vue-qrcode-reader
  It does not allow to use Screen Capture API (idk why it's not supported rn)
  It uses https://github.com/Sec-ant/barcode-detector under the hood, which does all the heavy lifting
translations?
show global timer if all tokens are of same period
Add visual tracking to qr detection


add aria attributes to buttons, imgs, etc
move otpauth to different lazy chunk, maybe allow Services to be lazy-loaded
icons for accounts
tokens should use single setInterval/setTimeout for each period (minor performance optimization)
? custom clock & time sync?
? copy code to clipboard on `url/id` open

done:
handle wrong password input
handle settings updates:
  passwordKeepAlive
  theme
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
