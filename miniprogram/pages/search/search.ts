import { wordDatabase } from '../index/index'

Page({
  data: {
    keyword: '',
    results: [] as typeof wordDatabase,
  },

  onLoad() {
    // 初始不搜索，保持空灵状态
  },

  onInputChange(e: any) {
    const keyword = (e.detail.value || '').trim()
    this.setData({ keyword })
    this.search(keyword)
  },

  onConfirm(e: any) {
    const keyword = (e.detail.value || '').trim()
    this.setData({ keyword })
    this.search(keyword)
  },

  clearKeyword() {
    this.setData({
      keyword: '',
      results: [],
    })
  },

  search(keyword: string) {
    if (!keyword) {
      this.setData({ results: [] })
      return
    }

    const lower = keyword.toLowerCase()
    const res = wordDatabase.filter(item => {
      const word = (item.word || '').toLowerCase()
      const meaning = (item.meaning || '').toLowerCase()
      return word.indexOf(lower) !== -1 || meaning.indexOf(lower) !== -1
    })

    this.setData({ results: res })
  },

  selectWord(e: any) {
    const item = e.currentTarget.dataset.item
    if (!item) return

    // 将选中的单词存到本地，首页读取并展示
    wx.setStorageSync('search_selected_word', item)

    wx.navigateBack()
  },

  goBack() {
    wx.navigateBack()
  },
})


