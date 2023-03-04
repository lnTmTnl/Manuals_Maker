import { createRouter, createWebHistory } from "vue-router"
import LoginView from "@/views/LoginView.vue"
import ProfileView from "@/views/ProfileView.vue"
import ThreeEditorComponent from "@/editor/ThreeEditorComponent.vue"
import ProjectsContainer from "@/components/ProjectsContainer.vue"
import ManualsContainer from "@/components/ManualsContainer.vue"
import AccountContainer from "@/components/AccountContainer.vue"
import SettingsContainer from "@/components/SettingsContainer.vue"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/profile/:userid",
      component: ProfileView,
      children: [
        {
          path: "projects",
          name: "projects",
          component: ProjectsContainer,
        },
        {
          path: "manuals",
          name: "manuals",
          component: ManualsContainer,
        },
        {
          path: "account",
          name: "account",
          component: AccountContainer,
        },
        {
          path: "settings",
          name: "settings",
          component: SettingsContainer,
        },
      ],
    },
    {
      path: "/editor/:userid",
      name: "editor",
      component: ThreeEditorComponent,
    },
  ],
})

export default router
