<template>
  <v-app class="app">
    <v-app-bar app class="app-bar">
      <v-spacer />
    </v-app-bar>

    <v-main class="main-content">
      <v-card tile flat>
        <v-toolbar flat dark>
          <v-toolbar-title>User Profile</v-toolbar-title>
        </v-toolbar>
        <v-tabs vertical hide-slider class="border-bottom">
          <v-tab class="v-tab--disabled tab-width my-auto">
            <v-icon left>
              mdi-account
            </v-icon>
            Address
          </v-tab>

          <v-tab-item class="border-left">
            <v-card flat tile>
              <v-card-text class="white--text">
                <v-text-field class="mt-4" dense label="Address">
                  <template #append-outer>
                    <v-btn color="primary" text depressed small>
                      Submit
                    </v-btn>
                  </template>
                </v-text-field>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
        <v-tabs vertical hide-slider>
          <v-tab class="v-tab--disabled tab-width mt-5">
            <v-icon left>
              mdi-account
            </v-icon>
            Diet
          </v-tab>

          <v-tab-item class="border-left">
            <v-card flat tile>
              <better-table
                group-by="category"
                :headers="headers"
                :group="[1, 1, 1]"
                :items="desserts"
                class="elevation-1"
                hide-default-footer
                disable-pagination
              >
                <template #group-0="{items}">
                  <span class="d-flex align-center">
                    <v-img
                      class="mr-5"
                      nax-height="30"
                      max-width="30"
                      src="http://placekitten.com/g/30/30"
                    />
                    {{ items[0].category }}
                  </span>
                </template>
                <!-- <template #group-1="{items}">
                  <span>
                    Dessert header
                  </span>
                </template> -->
                <!-- <template #group-2="{items}">
                  <span>
                    <span>
                      Dairy header
                    </span>
                  </span>
                </template> -->
              </better-table>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./App.v.ts" />

<style>
* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  scroll-behavior: smooth;
}
</style>

<style scoped>
.main-content {
  /* background-color: #333333; */
  width: 66%;
  margin-right: auto;
  margin-left: auto;
}

.tab-width {
  width: 180px;
}

.border-left {
  border-left: 1px solid #ebebeb;
}
.border-bottom {
  border-bottom: 1px solid #ebebeb;
}
.border-right {
  border-right: 1px solid #ebebeb;
}
</style>
