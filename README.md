# Vue 3 + Vuetify development template

### But we have vue cli... ?
Yes, but I do not like to be reliant on tools that set up my development environment for me.

Also in my tests this config produces lower size production builds than vue/cli with the same options.
(this may have changed in recent vue/cli updates. Haven't tested that.)

### Troubleshooting
You might want to add this rules to your VSCode config:

```
"vetur.experimental.templateInterpolationService": true,
"vetur.validation.template": false,
```

While it's not actually required to disable `vetur.validation.template`, but you might need to set up `vetur.format`
accordingly.