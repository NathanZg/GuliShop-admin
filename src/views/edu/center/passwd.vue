<template>
  <div class="app-container">
    <el-form
      ref="passwordForm"
      :model="user"
      :rules="passwordRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">修改密码</h3>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="user.password"
          name="password"
          auto-complete="on"
          placeholder="password"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="updateUseInfo"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import userApi from "@/api/acl/user";
import { isvalidUsername } from "@/utils/validate";
export default {
  computed: {
    ...mapGetters(["id"]),
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };

    return {
      user: {
        id: "",
        password: "",
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      loading: false,
      pwdType: "password",
      redirect: undefined,
      passwordRules: {
        password: [
          { required: true, trigger: "blur", validator: validatePass },
        ],
      },
    };
  },
  created() {
    this.user.id = this.id;
  },
  methods: {
    //显示密码
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    //退出登陆
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    //修改信息
    updateUseInfo() {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          userApi.updateById(this.user).then((reseponse) => {
            if (reseponse.code == 20000) {
              this.$message({
                type: "success",
                message: "修改成功!",
              });
              this.logout();
            } else {
              this.$message({
                type: "error",
                message: "修改失败,也许是用户名不可用，请更换用户名!",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //取消修改返回
    cancel() {
      this.$router.push({ path: "/" });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>