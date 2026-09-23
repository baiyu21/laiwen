<template>
  <div class="trademark-electronic-wrapper">
    <div class="body-part-search">
      <div class="filter-form">
        <el-form :model="queryParams" ref="queryForm" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="项目编号" prop="projectNumber">
                <el-input
                  v-model="queryParams.projectNumber"
                  placeholder="请输入项目编号"
                  clearable
                  class="filter-item"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="申请号" prop="applicationNumber">
                <el-input
                  v-model="queryParams.applicationNumber"
                  placeholder="请输入申请号"
                  clearable
                  class="filter-item"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册号" prop="registrationNumber">
                <el-input
                  v-model="queryParams.registrationNumber"
                  placeholder="请输入注册号"
                  clearable
                  class="filter-item"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="处理状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="请选择处理状态"
                  clearable
                  class="filter-item"
                >
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="来文类型" prop="documentType">
                <el-select
                  v-model="queryParams.documentType"
                  placeholder="请选择来文类型"
                  clearable
                  class="filter-item"
                >
                  <el-option
                    v-for="item in documentTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称" prop="projectName">
                <el-input
                  v-model="queryParams.projectName"
                  placeholder="请输入项目名称（案件名称）"
                  clearable
                  class="filter-item"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户名称" prop="customerName">
                <el-input
                  v-model="queryParams.customerName"
                  placeholder="请输入客户名称"
                  clearable
                  class="filter-item"
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="part-search-buttons">
          <el-button type="primary" @click="handleSearch">
            <el-icon><SearchIcon /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">
            <el-icon><RefreshIcon /></el-icon>
            重置
          </el-button>
        </div>
      </div>
    </div>

    <div class="body-part-content">
      <div class="part-table-header">
        <div class="part-table-title">
          <span>商标电子来文</span>
        </div>
        <div class="part-table-actions">
          <el-button type="primary" @click="handleRestoreNotImported">恢复未导入</el-button>
          <el-button type="primary" @click="handleMoveToNoProcess">转入无需处理</el-button>
          <el-button type="primary" @click="handleImportToSystem">导入系统</el-button>
          <el-button type="primary" @click="handleMatchProject">匹配项目</el-button>
          <el-button type="primary" @click="handleExportTable">
            <el-icon><DownloadIcon /></el-icon>
            导出表格
          </el-button>
          <el-button type="primary" @click="handleUploadReceipt">
            <el-icon><DownloadIcon /></el-icon>
            上传回执
          </el-button>
        </div>
      </div>

      <el-table
        ref="dataTable"
        v-loading="loading"
        :data="tableData"
        border
        row-key="id"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column label="序号" align="center" width="60">
          <template #default="scope">
            {{ scope.$index + 1 + (queryParams.pageNum - 1) * queryParams.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="项目编号" prop="projectNo" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="申请号" prop="applicationNo" min-width="130" align="center" show-overflow-tooltip />
        <el-table-column label="注册号" prop="registrationNo" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="案件名称" prop="caseName" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column label="案件代码" prop="caseCode" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="客户名称" prop="customerName" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="来文类型" prop="sourceType" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="状态" prop="status" width="100" align="center" />
        <el-table-column label="机构代码" prop="agencyCode" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="关联案件ID" prop="caseId" width="110" align="center" />
      </el-table>

      <el-pagination
        v-show="total > 0"
        :total="total"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="receiptDialogVisible"
      title="上传回执"
      width="520px"
      destroy-on-close
      @closed="resetReceiptDialog"
    >
      <el-form label-width="100px">
        <el-form-item label="ZIP 包" required>
          <input
            ref="receiptZipInputRef"
            type="file"
            accept=".zip,application/zip"
            class="receipt-file-input"
            @change="onReceiptZipChange"
          />
          <span v-if="receiptZip?.name" class="receipt-file-name">{{ receiptZip.name }}</span>
        </el-form-item>
        <el-form-item label="Excel 表" required>
          <input
            ref="receiptExcelInputRef"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            class="receipt-file-input"
            @change="onReceiptExcelChange"
          />
          <span v-if="receiptExcel?.name" class="receipt-file-name">{{ receiptExcel.name }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="receiptDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="receiptUploading" @click="submitReceiptUpload">
          上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { TrademarkIncomingAPI } from '@/api/trademarkincoming'

defineOptions({ name: 'TrademarkElectronicPage' })

const route = useRoute()

const loading = ref(false)
const ids = ref([])
const dataTable = ref(null)
const total = ref(0)
const tableData = ref([])

const queryParams = reactive({
  pageNum: 1,
  pageSize: 10,
  projectNumber: '',
  applicationNumber: '',
  registrationNumber: '',
  status: '',
  documentType: '',
  projectName: '',
  customerName: '',
})

const documentTypeOptions = [
  { label: '受理通知书', value: '受理通知书' },
  { label: '初审合格通知', value: '初审合格通知' },
  { label: '驳回通知书', value: '驳回通知书' },
  { label: '续展核准通知书', value: '续展核准通知书' },
]

const statusOptions = [
  { label: '未处理', value: '未处理' },
  { label: '处理中', value: '处理中' },
  { label: '已完成', value: '已完成' },
]

const ensureSelection = () => {
  if (!ids.value || ids.value.length === 0) {
    ElMessage.warning('请先在表格中勾选要操作的来文')
    return false
  }
  return true
}

const getList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      projectNo: queryParams.projectNumber || undefined,
      applicationNo: queryParams.applicationNumber || undefined,
      registrationNo: queryParams.registrationNumber || undefined,
      status: queryParams.status || undefined,
      sourceType: queryParams.documentType || undefined,
      caseName: queryParams.projectName || undefined,
      customerName: queryParams.customerName || undefined,
    }

    const res = await TrademarkIncomingAPI.getList(params)
    const list = Array.isArray(res.data) ? res.data : []
    tableData.value = list
    total.value = list.length
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error(error?.message || '获取数据失败')
    tableData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNum = 1
  getList()
}

const handleSearch = () => {
  handleQuery()
}

const handleReset = () => {
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  queryParams.projectNumber = ''
  queryParams.applicationNumber = ''
  queryParams.registrationNumber = ''
  queryParams.status = ''
  queryParams.documentType = ''
  queryParams.projectName = ''
  queryParams.customerName = ''
  handleSearch()
}

const handleSizeChange = () => {
  getList()
}

const handleCurrentChange = () => {
  getList()
}

const handleSelectionChange = (selection) => {
  ids.value = selection.map((item) => item.id)
}

const handleRestoreNotImported = async () => {
  if (!ensureSelection()) return
  loading.value = true
  try {
    const res = await TrademarkIncomingAPI.restoreProcesses()
    ElMessage.success(res?.message || `已恢复未导入来文，共 ${ids.value.length} 条`)
    getList()
  } catch (error) {
    ElMessage.error(error?.message || '恢复未导入失败')
  } finally {
    loading.value = false
  }
}

const collectMoveNoNeedPayload = () => {
  const rows = dataTable.value?.getSelectionRows?.() ?? []
  const ids = rows
    .map((r) => r.id)
    .filter((id) => id != null && id !== '')
  const projectNos = rows
    .map((r) => r.projectNo ?? r.projectNumber)
    .map((v) => (v != null && v !== '' ? String(v).trim() : ''))
    .filter(Boolean)
  return { ids, projectNos }
}

const handleMoveToNoProcess = async () => {
  if (!ensureSelection()) return
  const { ids: selectedIds, projectNos } = collectMoveNoNeedPayload()
  if (selectedIds.length === 0) {
    ElMessage.warning('所选记录缺少有效 id，无法转入无需处理')
    return
  }
  loading.value = true
  try {
    const res = await TrademarkIncomingAPI.moveNoNeed({
      ids: selectedIds,
      project_no: projectNos,
    })
    ElMessage.success(res?.message || `已转入无需处理，共 ${selectedIds.length} 条`)
    getList()
  } catch (error) {
    ElMessage.error(error?.message || '转入无需处理失败')
  } finally {
    loading.value = false
  }
}

const handleImportToSystem = async () => {
  if (!ensureSelection()) return
  loading.value = true
  try {
    const res = await TrademarkIncomingAPI.importProcesses()
    ElMessage.success(res?.message || `已导入系统，共 ${ids.value.length} 条`)
    getList()
  } catch (error) {
    ElMessage.error(error?.message || '导入系统失败')
  } finally {
    loading.value = false
  }
}

const handleMatchProject = async () => {
  loading.value = true
  try {
    const res = await TrademarkIncomingAPI.oneClickMatch()
    ElMessage.success(res.message || `匹配完成，成功: ${res.successCount}，失败: ${res.failCount}`)
    getList()
  } catch (error) {
    ElMessage.error(error.message || '匹配失败')
  } finally {
    loading.value = false
  }
}

function parseFilenameFromContentDisposition(disposition) {
  if (!disposition || typeof disposition !== 'string') return ''
  const star = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim())
    } catch {
      return star[1].trim()
    }
  }
  const quoted = /filename="([^"]+)"/i.exec(disposition)
  if (quoted?.[1]) return quoted[1]
  const plain = /filename=([^;\s]+)/i.exec(disposition)
  return plain?.[1] ? plain[1].replace(/^["']|["']$/g, '') : ''
}

const handleExportTable = async () => {
  if (!ensureSelection()) return
  loading.value = true
  try {
    const response = await TrademarkIncomingAPI.exportList(ids.value)
    const blob = response.data
    const ctype = (response.headers['content-type'] || '').toLowerCase()
    if (ctype.includes('application/json')) {
      const text = await blob.text()
      let msg = '导出失败'
      try {
        const j = JSON.parse(text)
        msg = j.message || j.msg || msg
      } catch {
        /* ignore */
      }
      ElMessage.error(msg)
      return
    }
    let filename = parseFilenameFromContentDisposition(
      response.headers['content-disposition'] || response.headers['Content-Disposition']
    )
    if (!filename) filename = `商标电子来文_${Date.now()}.xlsx`
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    ElMessage.success('导出成功')
  } catch (error) {
    const data = error?.response?.data
    if (data instanceof Blob) {
      try {
        const text = await data.text()
        const j = JSON.parse(text)
        ElMessage.error(j.message || j.msg || '导出失败')
      } catch {
        ElMessage.error(error?.message || '导出失败')
      }
    } else {
      ElMessage.error(error?.message || '导出失败')
    }
  } finally {
    loading.value = false
  }
}

const receiptDialogVisible = ref(false)
const receiptZip = ref(null)
const receiptExcel = ref(null)
const receiptZipInputRef = ref(null)
const receiptExcelInputRef = ref(null)
const receiptUploading = ref(false)

const onReceiptZipChange = (e) => {
  const f = e.target?.files?.[0]
  receiptZip.value = f || null
}

const onReceiptExcelChange = (e) => {
  const f = e.target?.files?.[0]
  receiptExcel.value = f || null
}

const resetReceiptDialog = () => {
  receiptZip.value = null
  receiptExcel.value = null
  if (receiptZipInputRef.value) receiptZipInputRef.value.value = ''
  if (receiptExcelInputRef.value) receiptExcelInputRef.value.value = ''
}

const handleUploadReceipt = () => {
  receiptDialogVisible.value = true
}

const submitReceiptUpload = async () => {
  const zip = receiptZip.value
  const excel = receiptExcel.value
  if (!zip || !excel) {
    ElMessage.warning('请同时选择 ZIP 压缩包与 Excel 文件')
    return
  }
  receiptUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', zip, zip.name)
    formData.append('excel', excel, excel.name)
    const res = await TrademarkIncomingAPI.uploadReceipt(formData)
    ElMessage.success(res?.message || '上传成功')
    receiptDialogVisible.value = false
    getList()
  } catch (error) {
    ElMessage.error(error?.message || '上传失败')
  } finally {
    receiptUploading.value = false
  }
}

watch(
  () => route.fullPath,
  () => {
    getList()
  }
)

onMounted(() => {
  getList()
})
</script>

<style scoped>
.trademark-electronic-wrapper {
  box-sizing: border-box;
}

.body-part-search {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.filter-form {
  width: 100%;
}

.part-search-buttons {
  text-align: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
}

.body-part-content {
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.part-table-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 12px;
  width: 100%;
}

.part-table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex-shrink: 0;
}

.part-table-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.el-pagination {
  margin-top: 16px;
  text-align: right;
  flex-wrap: wrap;
}

.filter-item {
  width: 100%;
}

.filter-item :deep(.el-input),
.filter-item :deep(.el-input__inner),
.filter-item :deep(.el-input__wrapper) {
  height: 35px;
  line-height: normal;
}

.filter-item :deep(.el-input__wrapper) {
  min-height: auto;
}

.filter-item :deep(.el-select) {
  height: auto;
}

.filter-item :deep(.el-select .el-input__inner),
.filter-item :deep(.el-select .el-input__wrapper) {
  height: auto;
  line-height: normal;
}

.receipt-file-input {
  display: block;
  max-width: 100%;
}
.receipt-file-name {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
}
</style>
