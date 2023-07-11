# 2FA manager in browser

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
simple editing on mobile
setup password ttl
steam account support
search functionality
copy code on click
copy code to clipboard on `url/id` open
icons for accounts
qr code support
toggle show password should remember cursor position
move otpauth to different lazy chunk
keyboard navigation
?show global timer if all tokens are of same period

done:
DnD

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