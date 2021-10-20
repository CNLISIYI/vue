<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="10">
        <!-- 表单 -->
        <el-form ref="form" :model="articleForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="articleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input type="textarea" v-model="articleForm.content"></el-input>
          </el-form-item>
          <el-form-item label="封面">
            <!-- <el-radio-group>
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group> -->
          </el-form-item>
          <el-form-item label="频道">
            <!--
              v-model="articleForm.channel_id" 相当于
              v-bind:value="articleForm.channel_id"
                绑定一个名字叫 value 的数据给子组件
              v-on:input="articleForm.channel_id = $event"
                默认监听子组件的 input 自定义事件，事件发生以后，将事件参数赋值给你绑定的数据
             -->
            <article-channel v-model="articleForm.channel_id"></article-channel>
            <!--
              在组件上 v-model
                数据会影响视图
                视图也会影响数据
             -->
            <!-- <el-select v-model="articleForm.channel_id" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select> -->
          </el-form-item>
        </el-form>
        <!-- /表单 -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'

export default {
  name: 'AppPublish',
  components: {
    ArticleChannel
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        channel_id: 3, // 频道
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        }
      }
    }
  },

  methods: {
    async handlePublish (draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.articleForm
        })
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      } catch (err) {
        this.$message.error('发布失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
