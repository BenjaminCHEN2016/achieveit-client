<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">
      <el-row style="width: 100%">
        <el-col :xs="24" :sm="24" :md="12" :lg="3">
          <el-select v-model="status" placeholder="到期状态">
            <el-option label="全部" value="" />
            <el-option
              key="0"
              label="未到期"
              value="0"
            />
            <el-option
              key="1"
              label="已到期"
              value="1"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="7" style="margin-left: 10px">
          <el-input
            v-model.trim="search"
            placeholder="搜索设备名称"
            clearable
          />
        </el-col>
      </el-row>
    </div>

    <el-table
      :data="tableData"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'poid', order: 'descending'}"
    >
      <el-table-column prop="poid" label="ID" width="70" align="center" sortable />
      <el-table-column prop="property_desc" label="设备名称" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.property_desc }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="projectName" label="项目名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="expire_time" label="到期时间" align="center" sortable show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.expire_time }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="employeeName" label="租借人ID" min-width="50" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.employee_id }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="is_intact" label="设备状态" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag
            :type="row.is_intact | intactTypeFilter"
            effect="plain"
          >{{ row.is_intact | intactFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="expired" label="到期状态" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag
            :type="row.expired | expiredTypeFilter"
            effect="plain"
          >{{ row.expired | expiredFilter }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button
            size="small"
            :disabled="row.expired || eid!=row.employee_id"
            @click="handleUpdate(row)"
          >更新
          </el-button>
          <el-button
            size="small"
            type="primary"
            :disabled="row.expired || eid!=row.employee_id"
            @click="handleReturn(row)"
          >归还
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      small
      background
      :current-page="currentPage"
      :page-size="length"
      layout="total, jumper, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script>
import * as propertyApi from '@/api/property'
import { mapGetters } from 'vuex'
const dayjs = require('dayjs')

export default {
  name: 'Defect',
  filters: {
    intactFilter(is_intact) {
      const intactMap = {
        true: '完好',
        false: '有损坏'
      }
      return intactMap[is_intact]
    },
    intactTypeFilter(is_intact) {
      const intactMap = {
        true: 'success',
        false: 'danger'
      }
      return intactMap[is_intact]
    },
    expiredFilter(expired) {
      const expiredMap = {
        true: '已到期',
        false: '未到期'
      }
      return expiredMap[expired]
    },
    expiredTypeFilter(expired) {
      const expiredMap = {
        true: 'danger',
        false: 'success'
      }
      return expiredMap[expired]
    }
  },
  props: { pid: String },
  data: function() {
    return {
      poList: [],
      status: '',
      search: '',
      currentPage: 1,
      length: 10
    }
  },
  computed: {
    tableData: function() {
      return this.poList
        .filter(data => !this.status || (data.expired && this.status === '1') || (!data.expired && this.status === '0'))
        .filter(data => !this.search || data.property_desc.toLowerCase().includes(this.search.toLowerCase()))
        .slice((this.currentPage - 1) * this.length, this.currentPage * this.length)
    },
    total: function() {
      return this.poList
        .filter(data => !this.status || (data.expired && this.status === '1') || (!data.expired && this.status === '0'))
        .filter(data => !this.search || data.property_desc.toLowerCase().includes(this.search.toLowerCase()))
        .length
    },
    ...mapGetters([
      'eid'
    ])
  },
  mounted() {
    this.getPoList()
  },
  methods: {
    getPoList() {
      propertyApi.getPropertyByProjectId(this.pid).then(response => {
        this.initPoList(response.responseMap.properties)
      })
    },
    initPoList(properties) {
      this.poList = []
      for (const key in properties) {
        const data = properties[key]
        const p = {
          poid: data.poid,
          property_id: data.property_id,
          project_id: data.project_id,
          property_desc: data.property.desc,
          projectName: data.project.name,
          expire_time: dayjs(data.expire_time).format('YYYY-MM-DD HH:mm:ss'),
          is_intact: data.is_intact,
          expired: data.expired,
          employee_id: data.employee_id
        }
        this.poList.push(p)
      }
    },
    handleUpdate(row) {
      this.$router.push({
        name: 'property-edit',
        params: {
          poid: row.poid,
          row: row
        }
      })
    },
    handleReturn(row) {
      this.$confirm('确定归还' + row.property_desc + '?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success'
      }).then(() => {
        this.queryParams.expire_time = dayjs().toISOString()
        this.queryParams.is_intact = row.is_intact
        propertyApi.updateOccupy(row.poid, this.queryParams).then(response => {
          this.$message.success('归还成功!')
          this.getPoList()
        })
      }).catch(() => {
      })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    }
  }
}

</script>
