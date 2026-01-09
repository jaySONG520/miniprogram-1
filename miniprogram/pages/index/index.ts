// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

// 考研高频单词库（示例数据，实际应从云数据库获取）
export const wordDatabase = [
  { word: 'abandon', phonetic: '/əˈbændən/', meaning: 'v. 放弃；抛弃；离弃' },
  { word: 'ability', phonetic: '/əˈbɪləti/', meaning: 'n. 能力；才能；本领' },
  { word: 'abroad', phonetic: '/əˈbrɔːd/', meaning: 'adv. 在国外；到国外' },
  { word: 'absence', phonetic: '/ˈæbsəns/', meaning: 'n. 缺席；不在；缺乏' },
  { word: 'absolute', phonetic: '/ˈæbsəluːt/', meaning: 'adj. 绝对的；完全的' },
  { word: 'absorb', phonetic: '/əbˈsɔːb/', meaning: 'v. 吸收；吸引；承受' },
  { word: 'abstract', phonetic: '/ˈæbstrækt/', meaning: 'adj. 抽象的 n. 摘要' },
  { word: 'academic', phonetic: '/ˌækəˈdemɪk/', meaning: 'adj. 学术的；理论的' },
  { word: 'accept', phonetic: '/əkˈsept/', meaning: 'v. 接受；承认；同意' },
  { word: 'access', phonetic: '/ˈækses/', meaning: 'n. 通道；访问 v. 存取' },
]

// 鼓励语库
const encouragements = [
  '静思，入神',
  '今日一词，静心领悟',
  '慢下来，感受文字',
  '专注当下，心无旁骛',
  '一字一世界，一思一境界',
]

Page({
  data: {
    currentDate: '',
    encouragement: '',
    wordData: {
      word: '',
      phonetic: '',
      meaning: '',
    },
    checked: false,
    isFavorite: false,
    encouragementAnimating: false,
    pullHintVisible: false,
  },

  onLoad() {
    this.initPage()
  },

  onShow() {
    // 每次显示页面时检查打卡状态
    this.checkTodayStatus()
  },

  // 下拉触发搜索入口（保持页面视觉极简）
  onPullDownRefresh() {
    this.setData({ pullHintVisible: true })

    // 轻微震动反馈
    wx.vibrateShort({ type: 'light' })

    // 立即结束下拉动画
    wx.stopPullDownRefresh()

    // 轻缓跳转到搜索页
    wx.navigateTo({
      url: '/pages/search/search',
      complete: () => {
        this.setData({ pullHintVisible: false })
      },
    })
  },

  /**
   * 初始化页面
   */
  initPage() {
    // 设置当前日期
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    const weekdays = ['日', '一', '二', '三', '四', '五', '六']
    const weekday = weekdays[today.getDay()]
    const dateStr = `${month}月${day}日 星期${weekday}`
    
    // 随机选择鼓励语
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)]
    
    // 默认获取今日单词（基于日期选择，确保每天相同）
    const todayWord = this.getTodayWord()
    
    this.setData({
      currentDate: dateStr,
      encouragement: randomEncouragement,
      wordData: todayWord,
    })
    
    // 检查是否有搜索页选中的单词需要展示
    this.applySearchedWord()
    
    // 检查今日打卡状态 & 收藏状态
    this.checkTodayStatus()
    this.checkFavoriteStatus(this.data.wordData)
  },

  /**
   * 根据日期获取今日单词（确保每天相同）
   */
  getTodayWord() {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const wordIndex = dayOfYear % wordDatabase.length
    return wordDatabase[wordIndex]
  },

  /**
   * 如果从搜索页返回时选择了单词，则优先展示该单词
   */
  applySearchedWord() {
    try {
      const searched = wx.getStorageSync('search_selected_word')
      if (searched && searched.word) {
        this.setData({
          wordData: searched,
        })
        // 使用后清除，避免下次进来仍然覆盖今日单词
        wx.removeStorageSync('search_selected_word')
      }
    } catch (e) {
      // 忽略异常，保持今日单词
    }
  },

  /**
   * 检查今日打卡状态
   */
  checkTodayStatus() {
    const today = this.getTodayKey()
    const checkRecord = wx.getStorageSync(today)
    this.setData({
      checked: !!checkRecord,
    })
  },

  /**
   * 检查当前单词是否已被收藏
   */
  checkFavoriteStatus(wordData: { word: string; phonetic: string; meaning: string }) {
    try {
      const favorites = wx.getStorageSync('favorite_words') || []
      const exists = Array.isArray(favorites)
        ? favorites.some((item: any) => item && item.word === wordData.word)
        : false
      this.setData({
        isFavorite: exists,
      })
    } catch (e) {
      this.setData({
        isFavorite: false,
      })
    }
  },

  /**
   * 获取今日的存储key
   */
  getTodayKey() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `check_${year}${month}${day}`
  },

  /**
   * 处理打卡事件
   */
  handleCheck() {
    if (this.data.checked) {
      return
    }

    const today = this.getTodayKey()
    
    // 保存打卡记录
    wx.setStorageSync(today, {
      date: today,
      timestamp: Date.now(),
      word: this.data.wordData.word,
    })

    // 更新UI状态
    this.setData({
      checked: true,
    })

    // 打卡成功提示（可选）
    wx.showToast({
      title: '打卡成功',
      icon: 'success',
      duration: 1500,
    })

    // 可以在这里添加云数据库上传逻辑
    // this.uploadCheckRecord(today)
  },

  /**
   * 收藏 / 取消收藏当前单词
   */
  handleFavorite() {
    const currentWord = this.data.wordData
    if (!currentWord || !currentWord.word) {
      return
    }

    let favorites: any[] = []
    try {
      const stored = wx.getStorageSync('favorite_words')
      if (Array.isArray(stored)) {
        favorites = stored
      }
    } catch (e) {
      favorites = []
    }

    const index = favorites.findIndex(item => item && item.word === currentWord.word)

    if (index > -1) {
      // 已收藏 -> 取消收藏
      favorites.splice(index, 1)
      this.setData({
        isFavorite: false,
      })
    } else {
      // 未收藏 -> 加入收藏（防止重复字段，存储干净对象）
      favorites.push({
        word: currentWord.word,
        phonetic: currentWord.phonetic,
        meaning: currentWord.meaning,
      })
      this.setData({
        isFavorite: true,
      })
    }

    wx.setStorageSync('favorite_words', favorites)
  },

  /**
   * 更换随机鼓励语（点击触发）
   */
  switchEncouragement() {
    if (!encouragements.length) return

    let next = this.data.encouragement
    let tries = 0

    // 尽量避免连续两次相同文案
    while (next === this.data.encouragement && tries < 5) {
      next = encouragements[Math.floor(Math.random() * encouragements.length)]
      tries++
    }

    this.setData({
      encouragement: next,
      encouragementAnimating: true,
    })

    setTimeout(() => {
      this.setData({
        encouragementAnimating: false,
      })
    }, 300)
  },

  /**
   * 上传打卡记录到云数据库（可选功能）
   */
  uploadCheckRecord(dateKey: string) {
    // 如果使用云开发，可以在这里上传记录
    // const db = wx.cloud.database()
    // db.collection('check_records').add({
    //   data: {
    //     date: dateKey,
    //     timestamp: Date.now(),
    //     word: this.data.wordData.word,
    //   }
    // })
  },
})
