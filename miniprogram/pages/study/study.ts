import { dictionary, Word } from '../../data/dictionary'

type SessionType = 'new' | 'review'

interface WordStat {
  stage: number
  nextReviewTime: number
}

interface WordStatsMap {
  [wordId: string]: WordStat
}

const STORAGE_KEY_STATS = 'word_stats'
const REVIEW_INTERVALS_DAYS = [1, 2, 4, 7, 15]
const DAY_MS = 24 * 60 * 60 * 1000

Page({
  data: {
    newCount: 0,
    reviewCount: 0,
  },

  startStudy(e: any) {
    const typeParam = e.currentTarget.dataset.type as SessionType
    const type: SessionType = typeParam === 'review' ? 'review' : 'new'

    wx.navigateTo({
      url: `/pages/studySession/studySession?type=${type}`,
    })
  },

  _wordStats: {} as WordStatsMap,

  onLoad(options: any) {
    this.loadStats()
    this.updateCounts()
  },

  onShow() {
    this.loadStats()
    this.updateCounts()
  },

  loadStats() {
    try {
      const stored = wx.getStorageSync(STORAGE_KEY_STATS)
      if (stored && typeof stored === 'object') {
        this._wordStats = stored
      } else {
        this._wordStats = {}
      }
    } catch (e) {
      this._wordStats = {}
    }
  },

  saveStats() {
    wx.setStorageSync(STORAGE_KEY_STATS, this._wordStats)
  },

  updateCounts() {
    const now = Date.now()
    let reviewCount = 0
    let newCount = 0

    Object.keys(this._wordStats).forEach(id => {
      const stat = this._wordStats[id]
      if (stat && stat.nextReviewTime && stat.nextReviewTime <= now) {
        reviewCount++
      }
    })

    // 新词：尚未出现在统计中的单词数量（最多显示 10 个作为“今日目标”）
    newCount = dictionary.filter(w => !this._wordStats[w.id]).length

    this.setData({
      reviewCount,
      newCount: Math.min(10, newCount),
    })
  },
})


