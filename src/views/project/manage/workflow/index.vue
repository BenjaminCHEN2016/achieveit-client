<template>
  <div class="block">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            placement="top"
            :type="activity.type"
            size="large"
            :timestamp="activity.timestamp"
          >
            <el-card>
              <h4>{{ activity.content }}</h4>
              <p>{{ activity.employeeName }} 提交于 {{ activity.timestamp }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-col>
      <el-col :span="12">
        <el-card>
          <p>你的角色为：{{ roles[0] }}</p>
<!--          <p>{{ whatTodo }}</p>-->
          <div v-if="whatTodo.indexOf(-1) !== -1">
            <el-tag type="success">
              <span style="font-size: medium">你的Workflow暂时无可操作的内容</span>
            </el-tag>
          </div>
          <div v-if="whatTodo.indexOf(1) !== -1">
            <p>项目审批</p>
            <el-button type="success" @click="triggerWorkflow('agree')">审批通过</el-button>
            <el-button type="danger" @click="triggerWorkflow('disagree')">审批不通过</el-button>
          </div>
          <div v-if="whatTodo.indexOf(2) !== -1">
            <p>项目配置</p>
            <el-form ref="projectForm" :model="configureForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="Git仓库" prop="git_repo">
                <el-input v-model="configureForm.git_repo" />
              </el-form-item>
              <el-form-item label="系统根目录" prop="server_root">
                <el-input v-model="configureForm.server_root" />
              </el-form-item>
              <el-form-item label="电子邮件列表" prop="mail_list">
                <el-input v-model="configureForm.mail_list" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('config')">配置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="whatTodo.indexOf(3) !== -1">
            <p>指定项目EPG</p>
            <el-form ref="epgForm" :model="epgForm" label-position="left" label-width="100">
              <el-form-item label="项目EPG" prop="epg_eid">
                <el-select v-model="epgForm.epgs" multiple class="selector" filterable placeholder="请选择EPG" style="width: 300px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('epg')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="whatTodo.indexOf(4) !== -1">
            <p>指定项目QA</p>
            <el-form ref="qaForm" :model="qaForm" label-position="left" label-width="100">
              <el-form-item label="项目QA" prop="qa_eid">
                <el-select v-model="qaForm.qas" multiple class="selector" filterable placeholder="请选择QA" style="width: 300px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('qa')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="whatTodo.indexOf(5) !== -1">
            <p>拉入项目成员</p>
            <el-form ref="peopleForm" :model="peopleForm" label-position="left" label-width="100">
              <el-form-item label="项目RD Leader" prop="rd_leader_eid">
                <el-select v-model="peopleForm.members.rd_leader" class="selector" filterable placeholder="请选择RD Leader" style="width: 300px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="项目RD" prop="rd_eid">
                <el-select v-model="peopleForm.members.rd" multiple class="selector" filterable placeholder="请选择RD" style="width: 300px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="项目QA" prop="qa_eid">
                <el-select v-model="peopleForm.members.qas" class="selector" multiple filterable placeholder="请选择QA" style="width: 300px">
                  <el-option
                    v-for="item in members"
                    :key="item.eid"
                    :label="item.name"
                    :value="item.eid"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_member')">指定</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="whatTodo.indexOf(6) !== -1">
            <p>成员配置权限配置</p>
            <el-button type="success" @click="triggerWorkflow('pm_authority')">启动配置</el-button>
          </div>
          <div v-if="whatTodo.indexOf(7) !== -1">
            <p>初始化功能列表</p>
            <el-button type="success" @click="triggerWorkflow('pm_function')">配置功能列表</el-button>
          </div>
          <div v-if="whatTodo.indexOf(8) !== -1">
            <p>配置全部完成，可以启动项目</p>
            <el-button type="success" @click="triggerWorkflow('pm_start')">启动项目</el-button>
          </div>
          <div v-if="whatTodo.indexOf(9) !== -1">
            <p>启动交付项目</p>
            <el-button type="success" @click="triggerWorkflow('pm_submitting')">交付项目</el-button>
          </div>
          <div v-if="whatTodo.indexOf(10) !== -1">
            <p>交付结束</p>
            <el-button type="success" @click="triggerWorkflow('pm_submitted')">完成交付</el-button>
          </div>
          <div>
            <el-form v-if="whatTodo.indexOf(11) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件1">
                <el-input v-model="archiveForm[1]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 1)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(12) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件2">
                <el-input v-model="archiveForm[2]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 2)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(13) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件3">
                <el-input v-model="archiveForm[3]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 3)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(14) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件4">
                <el-input v-model="archiveForm[4]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 4)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(15) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件5">
                <el-input v-model="archiveForm[5]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 5)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(16) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件6">
                <el-input v-model="archiveForm[6]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 6)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(17) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件7">
                <el-input v-model="archiveForm[7]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 7)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(18) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件8">
                <el-input v-model="archiveForm[8]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 8)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(19) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件9">
                <el-input v-model="archiveForm[9]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 9)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(20) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件10">
                <el-input v-model="archiveForm[10]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 10)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(21) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件11">
                <el-input v-model="archiveForm[11]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 11)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(22) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件12">
                <el-input v-model="archiveForm[12]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 12)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(23) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件13">
                <el-input v-model="archiveForm[13]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 13)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(24) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件14">
                <el-input v-model="archiveForm[14]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 14)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(25) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件15">
                <el-input v-model="archiveForm[15]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 15)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(26) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件16">
                <el-input v-model="archiveForm[16]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 16)">配置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-if="whatTodo.indexOf(27) !== -1" ref="archiveForm" :model="archiveForm" label-position="left" label-width="100" width="'300">
              <el-form-item label="归档文件17">
                <el-input v-model="archiveForm[17]" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="triggerWorkflow('pm_archive', 17)">配置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-if="whatTodo.indexOf(28) !== -1">
            <p>确认项目归档</p>
            <el-button type="success" @click="triggerWorkflow('configurer_archive_done')">审批通过</el-button>
          </div>
          <div>
            <img src="@/assets/pivot_dribbble.gif" class="emptyGif">
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchProjectByPid } from '@/api/project'
import { fetchWorkflowTimeline, pushWorkflow } from '@/api/workflow'
import { generateWhatToDo } from '@/utils/workflow'
import { getByTitle } from '@/api/user'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Workflow',
  // eslint-disable-next-line vue/require-prop-types
  props: ['pid'],
  data() {
    return {
      archiveForm: {
        1: '项目基础数据表',
        2: '项目提案书',
        3: '项目报价书',
        4: '项目估算表(功能点)',
        5: '项目计划书',
        6: '项目过程裁剪表',
        7: '项目成本管理表',
        8: '项目需求变更管理表',
        9: '项目风险管理表',
        10: '客户验收问题表',
        11: '客户验收报告',
        12: '项目总结',
        13: '最佳经验和教训',
        14: '开发工具',
        15: '开发模板(设计模板，测试模板)',
        16: '各阶段检查单',
        17: 'QA 总结'
      },
      peopleForm: {
        members: {
          rd_leader: '',
          rd: [],
          qa: []
        }
      },
      qaForm: {
        qas: []
      },
      epgForm: {
        epgs: []
      },
      configureForm: {
        git_repo: 'www.github.com',
        server_root: 'achieveit_G03',
        mail_list: 'achieveit_G03@ecnu.edu.cn'
      },
      projectData: '',
      activityTemplate: {
        'applying': {
          name: 'applying',
          content: '项目已开始审批',
          timestamp: '',
          size: 'large',
          type: 'primary'
        },
        'rejected': {
          name: 'rejected',
          content: '立项拒绝',
          timestamp: '',
          size: 'large',
          type: 'danger'
        },
        'approved': {
          name: 'approved',
          content: '项目审批已经通过、等待PM/QA/EPG配置与初始化',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'started': {
          name: 'started',
          content: '配置与项目初始化完成、项目已经开始',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'delivering': {
          name: 'delivering',
          content: '项目正在交付中',
          timestamp: '',
          size: 'large',
          type: 'primary'
        },
        'submitted': {
          name: 'delivering',
          content: '项目已经交付完成，可以进行归档',
          timestamp: '',
          size: 'large',
          type: 'success'
        },
        'achieved': {
          name: 'achieved',
          content: '项目已经完成归档',
          timestamp: '',
          size: 'large',
          type: 'success'
        }
      },
      whatTodo: [],
      activities: [],
      members: []
    }
  },
  computed: {
    ...mapGetters([
      'eid',
      'roles'
    ])
  },
  created() {
    this.fetchProjectData()
    this.populateMembers()
  },
  methods: {
    populateMembers() {
      getByTitle('member').then(response => {
        this.members = response.responseMap.employees
      })
    },
    async fetchProjectData() {
      this.projectData = (await fetchProjectByPid(this.pid)).responseMap.Project
      this.activities = await this.generateTimeline(this.projectData.workflow.wid)
      this.whatTodo = generateWhatToDo(this.projectData.workflow.flowbits, this.roles[0])
      for (let i = 1; i <= 17; i++) {
        this.archiveForm[i] = this.projectData.name + ' ' + this.archiveForm[i]
      }
    },
    async generateTimeline(wid) {
      const ret = []
      const workflowtl = (await fetchWorkflowTimeline(wid)).responseMap.timelines
      for (const it of workflowtl) {
        const tmp = this.activityTemplate[it.operation]
        tmp.timestamp = parseTime(it.add_time)
        tmp.employeeName = it.employee.name
        ret.push(tmp)
      }
      return ret
    },
    triggerWorkflow(op, args) {
      let data = {}
      switch (op) {
        case 'agree':
          data = {}
          break
        case 'disagree':
          data = {}
          break
        case 'config':
          data = this.configureForm
          break
        case 'epg':
          data = this.epgForm
          break
        case 'qa':
          data = this.qaForm
          break
        case 'pm_member':
          data = this.peopleForm
          break
        case 'pm_authority':
          data = {}
          break
        case 'pm_function':
          data = { 'function': { '001000': '测试一下', '001001': '二级 1-1', '002000': '一级 2', '002001': '二级 2-2', '002002': '二级 2-1', '003000': '一级 3', '003001': 'test', '004000': '一级 4' }}
          break
        case 'pm_start':
          data = {}
          break
        case 'pm_submitting':
          data = {}
          break
        case 'pm_submitted':
          data = {}
          break
        case 'pm_archive':
          data.archive_id = args - 1
          data.content = this.archiveForm[args]
          break
        case 'configurer_archive_done':
          break
        default:
          this.$message.error('裂开了')
      }
      data.todo = op
      pushWorkflow(this.projectData.workflow.wid, this.eid, data).then(async(response) => {
        this.whatTodo = generateWhatToDo(response.responseMap.workflow.flowbits, this.roles[0])
        this.$notify({
          title: 'WorkFlow操作',
          message: '操作成功，WorkFlow推进至后序操作',
          type: 'success',
          duration: 0
        })
        this.activities = await this.generateTimeline(this.projectData.workflow.wid)
      }).catch(() => {
        this.$notify.error({
          title: 'WorkFlow操作',
          message: '网络错误或WorkFlow外发生错误'
        })
      })
      console.log(this.projectData.workflow.wid, this.eid, data)
    }
  }
}
</script>

<style scoped>
  .emptyGif {
    width: 100%;
  }
</style>
