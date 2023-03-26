<template>
  <div class="login">
    <el-card>
      <h2>Login</h2>
      <el-form
        class="login-form"
        :model="model"
        :rules="rules"
        ref="form"
        @submit.native.prevent="login"
      >
        <el-form-item prop="id">
          <el-input
            v-model="model.id"
            class="w-50 m-2"
            placeholder="UserId"
            :prefix-icon="User"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="model.password"
            class="w-50 m-2"
            placeholder="Password"
            type="password"
            :prefix-icon="Lock"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            class="login-button"
            type="primary"
            native-type="submit"
            block
            >Login</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "@vue/reactivity"
import { User, Lock } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import axios from "axios"
import { useRouter } from "vue-router"

const router = useRouter()

const form = ref(null)

const validCredentials = ref({
  userid: "lightscope",
  password: "lightscope",
})
const model = ref({
  id: "",
  password: "",
})
const loading = ref(false)
const rules = ref({
  userid: [
    {
      required: true,
      message: "userid is required",
      trigger: "blur",
    },
    {
      min: 3,
      message: "userid length should be at least 3 characters",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 3,
      message: "Password length should be at least 3 characters",
      trigger: "blur",
    },
  ],
})

async function login() {
  let valid = await form.value.validate()
  if (!valid) {
    return
  }
  loading.value = true
  axios
    .post("/login", model.value)
    .then((res) => {
      // console.log(res)
      if (res !== null && res.data.state === 1) {
        ElMessage.success("Login successfull")
        router.replace({
          path: `/profile/${res.data.data[0].id}/projects`,
        })
      } else {
        ElMessage.error("userid or password is invalid")
      }
    })
    .catch((res) => {
      console.log(res)
    })
  loading.value = false
}
</script>

<style scoped>
.login {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-button {
  width: 100%;
}
.login-form {
  width: 290px;
}
.forgot-password {
  margin-top: 10px;
}
</style>

<style lang="scss">
$teal: rgb(0, 124, 137);
.el-button--primary {
  background: $teal;
  border-color: $teal;

  &:hover,
  &.active,
  &:focus {
    background: lighten($teal, 7);
    border-color: lighten($teal, 7);
  }
}
h2 {
  font-family: "Open Sans";
  letter-spacing: 1px;
  font-family: Roboto, sans-serif;
  padding-bottom: 20px;
}
a {
  color: $teal;
  text-decoration: none;
  &:hover,
  &:active,
  &:focus {
    color: lighten($teal, 7);
  }
}
.login .el-card {
  width: 340px;
  display: flex;
  justify-content: center;
}
</style>
