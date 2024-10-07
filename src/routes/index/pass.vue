<template>
  <Teleport to="#app-overlay-portal">
    <section :class="$style.scrim" class="d-flex justify-center align-center">
      <v-card :width="display.smAndDown ? '90%' : 400" class="pb-2">
        <v-card-title class="d-flex justify-center mt-3 mb-1 text-h4">
          Provide password
        </v-card-title>

        <v-card-text>
          <!-- <v-form> -->
          <ProvideValue v-slot="slot" :isPassVisible="false" :selectionStart="0">
            <v-text-field
              ref="passInputRef"
              v-model="password"
              class="mt-3"
              density="default"
              label="Decryption password"
              :autofocus="true"
              :append-inner-icon="slot.isPassVisible ? mdiEye : mdiEyeOff"
              :rules="[(v) => !!v || 'Password is required']"
              :type="slot.isPassVisible ? 'text' : 'password'"
              @click:append-inner="
                () => {
                  slot.isPassVisible = !slot.isPassVisible
                  const component = passInputRef as any
                  const selectionStart = component.selectionStart
                  window.requestAnimationFrame(() => {
                    component.$el.querySelector('input').selectionStart = selectionStart
                  })
                }
              "
              @keyup.enter="onPasswordAccept"
            ></v-text-field>
          </ProvideValue>
          <!-- </v-form> -->
        </v-card-text>

        <v-card-actions class="mt-n2 d-flex justify-space-around">
          <v-btn
            class="px-10"
            color="deep-purple-accent-1"
            variant="tonal"
            @click="onPasswordAccept"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </section>
  </Teleport>
  <SnackbarNotification v-model="isError" variant="tonal" color="red">
    <span class="text-h6 d-flex justify-center">Decryption Error</span>
  </SnackbarNotification>
  <SnackbarNotification v-model="isPasswordCreated" variant="tonal" color="green">
    <span class="text-h6 d-flex justify-center">Password created</span>
  </SnackbarNotification>
</template>

<script lang="ts">
import * as v from 'vue'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import { ProvideValue } from '@/util'
import { useRouter } from 'vue-router'
import { SnackbarNotification } from '@/components/Notification'
import { useStore } from '@/store'

export default v.defineComponent({
  components: { ProvideValue, SnackbarNotification },
  setup(props, ctx) {
    const store = useStore()
    const router = useRouter()
    const password = v.ref('')

    const isError = v.ref(false)
    const isPasswordCreated = v.ref(false)

    const onPasswordAccept = async () => {
      const result = await store.security.setupSecureContext(password.value)
      console.log('result')
      console.log(result)
      if (result === 'new_iv') {
        isPasswordCreated.value = true
      }

      if (result) {
        router.push({ name: '' + require.resolve('@/routes/index.vue') })
        isError.value = false
      } else {
        password.value = ''
        isError.value = true
      }
    }

    return {
      isError,
      isPasswordCreated,

      password,
      onPasswordAccept,
      passInputRef: v.ref<v.Component>(),

      mdiEyeOff,
      mdiEye,
    }
  },
})
</script>

<style scoped>
:deep(.v-input__details) {
  margin-bottom: 0;
}
</style>
<style module>
.scrim {
  composes: scrim from './style.module.css';
}
</style>
