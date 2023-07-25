# Services

Services are semi-singleton classes that implement shared component logic.

Services are "semi-singletons" because a single instance is created NOT for the whole runtime, but rather for each `Vue.createApp`.<br/>
This makes Services, for all intents and purposes similar to singletons, if your application uses only one `Vue.createApp`. The differences, however, are important to understand, as you should not expect Vue to have a single app.<br/>
This also allows for easy usage in SSR.

Services are used instead of statefull `useSomething()` functions because Services can be used outside Vue app if required. Services can be tested more easily. Also, state management can sometimes feel easier within classes. (If none of this apply to your case, consider using statefull `use` functions instead.)

Service instances are constructed in `src/main.ts`.

Each service must have a static `token` property of type `unique Symbol`, which is used to provide service instance to components (via `Vue.inject`) and other services (using `Vue.createApp().runWithContext(() => Vue.inject(symbol))`).

Services may `inject` other services, but injected value will be undefined at the time when constructor is called. This behavior is enforced because proper sync construction order can not be easily guaranteed. Hence service injection should be non synchronous (use `queueMicrotask`)

Services may provide reactive data to components within `reactive` property.<br/>
Reactive data may be declared as readonly, but please abstain from implementing FLUX pattern (specifically mutations) via services. If you think you need actual state management - use other solutions.<br/>
Services are not storage interfaces (aka Redux/Vuex), `reactive` data can (and should) be manipulated directly from within components if necessary (e.g. on user-triggered action). A rule of thumb for data manipulation - if data needs to be changed in a similar way in 2 or more components - define Service method for that (or handle data changes within Service). Otherwise mutate data directly.

Reactive data should not be exposed in properties other than `reactive`.
