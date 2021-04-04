<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-form ref="listQuery" :model="listQuery" :inline="true">
        <el-form-item label="流程实例名称">
          <el-input
            v-model="listQuery.keyword"
            placeholder="请输入流程实例名称"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
          >搜索
          </el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleCreate"
          >新增
          </el-button>
        </el-col>
      </el-row>
      <br>

      <el-table
        v-loading="loading"
        border
        :data="processValueList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" prop="id" width="120" />
        <el-table-column
          label="名称"
          prop="title"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="创建者"
          prop="createBy"
          :show-overflow-tooltip="true"
          width="150"
        />
        <el-table-column
          label="当前节点"
          align="center"
          prop="state[0].label"
          width="180"
        />
        <el-table-column
          label="最后修改时间"
          align="center"
          prop="updateTime"
          width="180"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="getDetail(scope.row)"
            >查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageIndex"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />

      <el-dialog
        :title="dialogProcessVisibleName === 1 ? '新建工单' : '编辑流程'"
        :visible.sync="open"
        :fullscreen="true"
        style="margin-top: 0"
      >
        <div class="tpl-create-content">
          <el-form
            ref="ruleForm"
            :model="currentInstance"
            :rules="rules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="12">
                <el-form-item label="名称" prop="title">
                  <el-input
                    v-if="dialogProcessVisibleName === 1"
                    v-model="currentInstance.title"
                    placeholder="请输入流程名称"
                    style="width: 100%"
                  />
                  <el-input
                    v-else
                    v-model="currentInstance.title"
                    disabled
                    placeholder="请输入流程名称"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="流程模板" prop="processDefinitionId">
                  <el-select
                    v-if="dialogProcessVisibleName === 1"
                    v-model="currentInstance.processDefinitionId"
                    filterable
                    placeholder="请选择流程模板"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in definitionListDate"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                  <el-select
                    v-else
                    v-model="currentInstance.processDefinitionId"
                    disabled
                    filterable
                    placeholder="请选择流程模板"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in definitionListDate"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="变量列表" prop="variables">
              <el-table
                :data="variableList"
                style="width: 100%;border-radius: 4px;"
              >
                <el-table-column
                  label="变量名"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.name" style="margin-left: 10px" />
                  </template>
                </el-table-column>
                <el-table-column
                  label="变量值"
                  width="180"
                >
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.value" style="margin-left: 10px">{{ scope.row.value }}
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="handleVariableDelete(scope.$index)"
                    >
                      {{ scope.$index === 0 && variableList.length === 1 ? '清空' : '删除' }}
                    </el-button>
                    <el-button
                      v-show="scope.$index === variableList.length - 1"
                      size="mini"
                      type="success "
                      @click="handleVariableAdd"
                    >新增
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>

            <hr v-if="dialogProcessVisibleName !== 1">
            <br>
            <el-form-item v-if="dialogProcessVisibleName !== 1" label="审批意见">
              <el-input
                v-model="handleRemarks"
                placeholder="请输入审批意见"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>

          <div style="text-align: center; margin-top: 20px">
            <el-button v-for="item in availableFlows" :key="item.id" type="primary" @click="handleInstance(item.id)">
              {{ item.label }}
            </el-button>
            <el-button
              v-show="dialogProcessVisibleName === 1"
              type="primary"
              @click="
                dialogProcessVisibleName === 1
                  ? submitForm('ruleForm')
                  : editForm('ruleForm')
              "
            >
              {{ dialogProcessVisibleName === 1 ? '新增' : '更新' }}
            </el-button>
            <el-button @click="open = false">返回</el-button>
          </div>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getProcessInstanceList,
  getProcessInstance,
  createProcessInstance,
  updateProcessInstance,
  handleProcessInstance,
  denyProcessInstance
} from '@/api/process-instance'

import {
  getProcessDefinitionList
} from '@/api/process-definition'
import {mapGetters} from "vuex";

export default {
  name: 'Process',
  components: {},
  data() {
    return {
      // 表明当前用户的头
      wfCurrentUserHeader: 'WF-CURRENT-USER',

      queryParams: {
        pageIndex: 1,
        pageSize: 10
      },

      // 变量列表
      variableList: [],

      // 变量表示
      variableEditStatus: [],

      // 审批意见
      handleRemarks: '',

      // 可选的审批
      availableFlows: [],
      currentState: {},
      currentInstance: {},

      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 是否显示弹出层
      open: false,
      definitionListDate: [],
      dialogProcessVisibleName: 1,
      processValueList: [],
      listQuery: {
        limit: 10,
        offset: 0,
        keyword: ''
      },
      lang: 'zh',
      rules: {
        processDefinitionId: [
          {
            required: true, message: '请选择流程模板', trigger: 'blur, change'
          }
        ],
        title: [
          {
            required: true, message: '请输入流程名称', trigger: 'blur, change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  watch: {
    ruleForm() {
      console.log('值改变了', this.currentInstance)
    }
  },
  created() {
    this.queryParams.pageIndex = 1
    this.queryParams.pageSize = 10
    this.getList()
  },
  methods: {
    handleInstance(flowId) {
      if (flowId === 'deny') {
        this.denyInstance(flowId)
      } else {
        this.handleInstanceInternal(flowId)
      }
    },

    // 审批
    handleInstanceInternal(flowId) {
      const payload = {
        edgeId: flowId,
        processInstanceId: this.currentInstance.id,
        remarks: this.handleRemarks,
        variables: this.variableList.filter(it => it.name !== '').map(it => {
          if (!isNaN(it.value)) {
            it.value = parseFloat(it.value)
          } else if (it.value.toLowerCase() === 'false' || it.value.toLowerCase() === 'true') {
            it.value = !!it.value
          }

          return it
        })
      }
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }

        handleProcessInstance(payload, this.currentUser.id).then(response => {
          this.getList()
          this.open = false
          this.$message({
            type: 'success',
            message: '已成功执行操作: ' + (this.availableFlows.find(it => it.id === flowId).label || '')
          })
        })
      })
    },

    // 否决
    denyInstance(flowId) {
      const payload = {
        nodeId: this.currentState.id,
        processInstanceId: this.currentInstance.id,
        remarks: this.handleRemarks
      }
      this.$refs['ruleForm'].validate(valid => {
        if (!valid) {
          return
        }

        denyProcessInstance(payload, this.currentUser.id).then(response => {
          this.getList()
          this.open = false
          this.$message({
            type: 'success',
            message: '已否决'
          })
        })
      })
    },

    handleVariableDelete(index) {
      const newList = []
      for (let i = 0; i < this.variableList.length; i++) {
        if (i === index) {
          continue
        }
        newList.push(this.variableList[i])
      }

      this.variableList = newList
      if (this.variableList.length === 0) {
        this.handleVariableAdd()
      }
    },

    handleVariableAdd() {
      this.variableList.push({
        name: '',
        value: ''
      })
    },

    // 获取任务列表
    getDefinitionList() {
      const payload = {
        limit: 9999,
        offset: 0,
        type: 2
      }
      getProcessDefinitionList(payload).then(response => {
        this.definitionListDate = response.data.data
      })
    },

    /** 查询流程列表 */
    getList() {
      this.loading = true
      this.listQuery.limit = this.queryParams.pageSize
      this.listQuery.offset = (this.queryParams.pageIndex - 1) * this.queryParams.pageSize

      // 1=我的待办
      this.listQuery.type = 1

      getProcessInstanceList(this.listQuery, this.currentUser.id).then(response => {
        this.processValueList = response.data.data
        this.total = response.data['totalCount']
        this.loading = false
      })
    },

    getProcessInitData() {
      this.getDefinitionList()
    },

    handleCreate() {
      this.variableList = []
      this.handleVariableAdd()

      this.getProcessInitData()
      this.currentInstance = {}
      this.availableFlows = []
      this.currentState = {}
      this.handleRemarks = ''
      this.dialogProcessVisibleName = 1
      this.open = true
    },

    getDetail(row) {
      this.dialogProcessVisibleName = 2
      this.getProcessInitData()
      this.open = true

      getProcessInstance(row.id, this.currentUser.id).then(response => {
        this.currentInstance = response.data
        this.variableList = response.data.variables
        if (!this.variableList || this.variableList.length === 0) {
          this.handleVariableAdd()
        }
        // 处理可操作的按钮
        this.currentState = response.data.state.find(it => it.processor.includes(this.currentUser.id + ''))
        this.availableFlows = this.currentState['availableEdges'] || []
        this.availableFlows.push({
          label: '否决',
          sort: 999,
          id: 'deny'
        })
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return
        }

        this.currentInstance.variables = this.variableList.filter(it => it.name !== '').map(it => {
          if (!isNaN(it.value)) {
            it.value = parseFloat(it.value)
          } else if (it.value.toLowerCase() === 'false' || it.value.toLowerCase() === 'true') {
            it.value = !!it.value
          }

          return it
        })

        createProcessInstance(this.currentInstance, this.currentUser.id).then(response => {
          this.getList()
          this.open = false
        })
      })
    },
    editForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateProcessInstance({
            id: this.currentInstance.id,
            name: this.currentInstance.name
          }, this.currentUser.id).then(response => {
            this.getList()
            this.open = false
          })
        }
      })
    },
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.queryParams.pageSize = 10
      this.getList()
    },
    handleSelectionChange() {
    },
    handleClone(row) {
      this.$confirm(`确认克隆流程 < ${row.name} > ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
        .then(() => {
          // cloneProcess(row.id).then(() => {
          //   this.getList()
          //   this.$message({
          //     type: 'success',
          //     message: '流程已克隆!'
          //   })
          // })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
