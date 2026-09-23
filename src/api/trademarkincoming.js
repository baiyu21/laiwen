import request from '@/utils/request'

/** 商标电子来文列表：GET /api/trademark/search，查询参数与后端约定一致 */
export const TrademarkIncomingAPI = {
  getList(params) {
    return request({
      url: '/trademark/search',
      method: 'get',
      params,
    })
  },
  oneClickMatch() {
    return request({
      url: '/trademark-match/one-click-match',
      method: 'post',
    })
  },
  /** GET /api/trademark/search/export?ids=1,2 — 返回文件流，axios 需 responseType: blob */
  exportList(ids) {
    const idParam = Array.isArray(ids) ? ids.join(',') : String(ids)
    return request({
      url: '/trademark/search/export',
      method: 'get',
      params: { ids: idParam },
      responseType: 'blob',
      timeout: 120000,
    })
  },
  /** POST /api/trademark-receipt/upload，字段：file（zip）、excel（xlsx/xls） */
  uploadReceipt(formData) {
    return request({
      url: '/trademark-receipt/upload',
      method: 'post',
      data: formData,
      timeout: 120000,
    })
  },
  /** POST /api/trademark-receipt/move-no-need，body: { project_no: string[], ids: (number|string)[] } */
  moveNoNeed(data) {
    return request({
      url: '/trademark-receipt/move-no-need',
      method: 'post',
      data,
    })
  },
  /** POST /api/trademark/import-processes — 导入系统（无请求体，与后端约定一致） */
  importProcesses() {
    return request({
      url: '/trademark/import-processes',
      method: 'post',
    })
  },
  /** POST /api/trademark/restore-processes — 恢复未导入 */
  restoreProcesses() {
    return request({
      url: '/trademark/restore-processes',
      method: 'post',
    })
  },
}
