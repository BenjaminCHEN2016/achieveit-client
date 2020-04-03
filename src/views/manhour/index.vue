<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">

      <div style="display: flex">
        <el-select v-model="queryParams.status" placeholder="审核状态" class="mr-2" @change="handleFilter">
          <el-option label="所有状态" value="" />
          <el-option
              v-for="status in Object.keys(manhourStatus)"
              :key="status"
              :label="manhourStatus[status].text"
              :value="manhourStatus[status].value"
            />
        </el-select>
        <el-date-picker
              v-model="selectedDate"
              type="date"
              placeholder="日期查询"
              @keyup.enter.native="handleFilter"
            />
        <!-- <el-input v-model="queryParams.date" placeholder="日期查询" clearable style="width: 200px;" class="mr-3" @keyup.enter.native="handleFilter" /> -->
        <el-button icon="el-icon-search" type="primary" size="small" style="margin-left: 10px" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>

    <el-card>
      <m-table
        :data="manhourList"
        :columns="columns"
      />
    </el-card>

     <el-pagination
      small
      background
      :current-page="currentPage"
      :page-size="queryParams.length"
      layout="total, jumper, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import * as manhourApi from '@/api/manhour'
import MTable from '@/components/MTable'
const dayjs = require('dayjs')

export default {
  name: 'ManhourList',
  components: {MTable },
  data() {
    return {
      manhourStatus: manhourApi.manhourStatus(),
      manhourList: [],
      columns: [{
        prop: 'mid',
        label: 'id'
      }, {
        prop: 'projectName',
        label: '所属项目'
      }, {
        prop: 'fid',
        label: '功能名称'
      },{
        prop: 'activityName',
        label: '活动名称'
      },{
        prop: 'startTime',
        label: '开始时间'
      },{
        prop: 'endTime',
        label: '结束时间'
      },{
        prop: 'status',
        label: '状态'
      },{
        prop: 'options',
        label: '操作',
        width: 230,
        align: 'center',
        icon: 'edit',
        options: [
          {
            type: 'primary',
            label: '编辑',
            // icon: 'square-edit-outline',
            event: this.handleEdit
          },
          {
            type: 'danger',
            label: '删除',
            event: this.handleDelete
          },
        ]
      }],
      
      //todo: date: '' causes 400 error
      queryParams: {
        page: 0,
        length: 20,
        date: '2020-03-24'
      },
      
    selectedDate:'', //日期filter使用
    currentPage: 1

    }
  },

  mounted() {
      this.handleFilter()
  },

  computed: {
    total: function() {
      return  this.manhourList
        .filter(data => !this.queryParams.date 
        || data.date.includes(this.queryParams.date)).length
    }
  },

  methods: {

   initManhourData(manhours) {
      this.manhourList = []
      for (const key in manhours) {
        const data = manhours[key]
        const m = {
          mid: data.mid,
          fid: data.fid,
          pid: data.employeeProject.project_id,
          projectName: data.employeeProject.project.name,
          activity_aid: data.activity.aid,
          activityName: data.activity.def1 + " - " + data.activity.def2,
          startTime: dayjs(data.starttime).format('YYYY-MM-DD HH:mm'),
          endTime: dayjs(data.endtime).format('YYYY-MM-DD HH:mm'),
          date: data.date,
          status: data.status,
        }
        this.manhourList.push(m)
      }
    },

    handleEdit(row){
      this.$router.push('/manhour/edit/' + row.mid)
    },

    handleDelete(row) {
      this.$confirm('此操作将永久删除该工时, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.deleteManhour(row.mid)
      }).catch(() => {
      })
    },
    deleteManhour(mid) {
      manhourApi.deleteManhour(mid).then(() => {
        this.$message('删除成功!')
        this.handleFilter()
      })
    },

    handleFilter() {
        // 若选择了日期filter，则转变一下日期格式
        if(this.selectedDate != ''){
            this.queryParams.date = dayjs(this.selectedDate).format('YYYY-MM-DD')
        }
        manhourApi.getManhour(this.queryParams).then(response => {
        //   console.log(this.selectedDate, this.queryParams)
          this.initManhourData(response.responseMap.Manhour)
      })
    },
     handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
  }
}

</script>