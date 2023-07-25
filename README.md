# 2FA Manager in Browser

wip

Type checking is done by [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/packages/vue-tsc)

### Security

Data is encrypted and stored locally. No server is used.
The project uses native Web Crypto API to encrypt and decrypt stored information.<br/>
Security related functionality can be found in `src/services/Security.ts`

### Similar projects

[Authenticator (browser extestion)](https://github.com/Authenticator-Extension/Authenticator)<br/>
[Aegis Authenticator (mobile app)](https://github.com/beemdevelopment/Aegis)<br/>
[KeePassXC (desktop password manager)](https://github.com/keepassxreboot/keepassxc)

<!--

todo:
handle settings updates:
  passwordKeepAlive
  progressBarStyle
setup password ttl
steam account support
Hide tokens during initial render (to avoid flicker)
qr code support
keyboard navigation (& esc to close any dialog)
data sync with WebRTC
search functionality
translations?

add aria attributes to buttons, imgs, etc
copy code to clipboard on `url/id` open
move otpauth to different lazy chunk
icons for accounts
tokens should use single setInterval/setTimeout for each period (minor performance optimization)
?show global timer if all tokens are of same period
?custom clock?

done:
handle settings updates:
  theme
copy code on click
toggle show password should remember cursor position
DnD
? simple editing on mobile

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
