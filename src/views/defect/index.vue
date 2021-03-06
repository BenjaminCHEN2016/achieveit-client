<template>
  <div class="app-container">
    <div class="filter-wrap mb-2">
      <el-row style="width: 100%">
        <el-col :xs="24" :sm="24" :md="12" :lg="3">
          <el-select v-model="statusSearch" placeholder="缺陷状态" @change="handleFilter">
            <el-option label="all" value="" />
            <el-option
              v-for="status in Object.keys(defectStatus)"
              :key="defectStatus[status].value"
              :label="defectStatus[status].text"
              :value="defectStatus[status].value"
            />
          </el-select>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="7" style="margin-left: 10px">
          <el-input
            v-model.trim="descSearch"
            placeholder="搜索缺陷描述"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="1" style="margin-left: 10px">
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">
            搜索
          </el-button>
        </el-col>
        <!-- <el-col :xs="24" :sm="24" :md="12" :lg="1" style="margin-left: 600px">
          <el-button
            type="primary"
            icon="el-icon-document-add"
            @click="handleNew"
          >新增缺陷
          </el-button>
        </el-col> -->
      </el-row>

    </div>

    <el-table
      :data="defectList"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{prop: 'did', order: 'descending'}"
    >
      <el-table-column prop="did" label="ID" min-width="30" align="center" sortable />
      <el-table-column prop="desc" label="缺陷描述" min-width="120" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.desc }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="projectName" label="项目名称" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="commit" label="commit" min-width="80" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link :href="row.git_repo" target="_blank" type="primary">{{ row.commit }}</el-link>
        </template>
      </el-table-column>

      <el-table-column label="git仓库地址" mid-width="100" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <el-link
            :href="row.git_repo"
            target="_blank"
            type="primary"
          >{{ row.git_repo }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" min-width="35" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag
            :type="defectStatus[row.status].type"
            disable-transitions
            effect="plain"
          >{{ defectStatus[row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="权限" min-width="100" show-overflow-tooltip align="center">
        <template slot-scope="{row}">
          <span style="margin-left: 10px">{{ defectAuthority[row.authority_desc].text }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template slot-scope="{row}">
          <el-button
            size="small"
            @click="handleEdit(row)"
          >编辑
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row.did)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      layout="prev, pager, next"
      :page-count="pageCount"
      @current-change="handleCurrentChange"
    />

  </div>
</template>

<script type="text/ecmascript-6">

import * as defectApi from '@/api/defect'

export default {

  data: function() {
    return {
      defectStatus: defectApi.defectStatus(),
      defectAuthority: defectApi.defectAuthority(),
      statusSearch: '',
      descSearch: '',
      defectList: [],
      pageCount: 1
    }
  },
  mounted() {
    this.handleFilter()
  },
  methods: {
    handleEdit(row) {
      this.$router.push({
        name: 'edit-defect',
        params: {
          did: row.did,
          row: row
        },
        statusSearch: '',
        descSearch: ''
      })
    },
    handleDelete(did) {
      this.$confirm('此操作将永久删除该缺陷, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger'
      }).then(() => {
        this.deleteDefect(did)
      }).catch(() => {
      })
    },
    deleteDefect(did) {
      defectApi.deleteDefect(did).then((response) => {
        console.log(response)
        this.$message.success('删除成功!')
        this.handleFilter()
      })
    },

    initDefectData(defects) {
      this.defectList = []
      for (const key in defects) {
        const data = defects[key]
        const defect = {
          did: data.did,
          desc: data.desc,
          commit: data.commit,
          git_repo: data.git_repo,
          project_id: data.project_id,
          projectName: data.project.name,
          status: data.status,
          authority_desc: data.authority_desc
        }
        this.defectList.push(defect)
      }
    },

    handleFilter() {
      var queryParams = {
        desc: this.descSearch,
        page: 0,
        length: 10
      }
      if (this.statusSearch !== '') {
        queryParams.status = this.statusSearch
      }
      defectApi.getDefects(queryParams).then(response => {
        console.log(response.responseMap.Defect, queryParams)
        this.pageCount = response.responseMap.page_length
        this.initDefectData(response.responseMap.Defect)
      })
    },
    handleCurrentChange(currentPage) {
      this.queryParam.page = currentPage - 1
      this.handleFilter()
    }
  }
}
</script>
