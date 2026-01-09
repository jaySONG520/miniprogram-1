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
    sessionType: 'new' as SessionType,
    round: 1,
    currentWordIndex: 0,
    totalWords: 0,
    progressPercent: 0,
    currentWord: {} as Word,
    currentOptions: [] as string[],
    showDetail: false,
    lastAnswerCorrect: true,
    isSessionFinished: false,
  },

  _wordList: [] as Word[],
  _wordStats: {} as WordStatsMap,
  _currentWordWrongInThisCycle: false,

  onLoad(options: any) {
    this.loadStats()

    let type: SessionType = 'new'
    if (options && options.type) {
      type = options.type === 'review' ? 'review' : 'new'
    }

    // 先设置初始数据，确保页面有基础状态
    this.setData({
      sessionType: type,
      round: 1,
      currentWordIndex: 0,
      totalWords: 0,
      currentWord: {} as Word,
      currentOptions: [],
      showDetail: false,
      lastAnswerCorrect: true,
      isSessionFinished: false,
      progressPercent: 0,
    })

    // 然后初始化学习会话（使用 nextTick 确保数据已设置）
    this.initSession(type)
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

  initSession(type: SessionType) {
    let words: Word[] = []
    const now = Date.now()

    if (type === 'review') {
      words = dictionary.filter(w => {
        const stat = this._wordStats[w.id]
        return stat && stat.nextReviewTime && stat.nextReviewTime <= now
      })
      if (!words.length) {
        words = this.pickRandomWords(10)
        this.setData({ sessionType: 'new' })
      }
    } else {
      words = this.pickRandomWords(10)
    }

    this._wordList = words

    const firstWord = words[0]
    if (!firstWord) {
      this.setData({
        isSessionFinished: true,
      })
      return
    }

    this._currentWordWrongInThisCycle = false

    this.setData({
      round: 1,
      currentWordIndex: 0,
      totalWords: words.length,
      currentWord: firstWord,
      currentOptions: this.shuffle(firstWord.options.slice()),
      showDetail: false,
      lastAnswerCorrect: true,
      isSessionFinished: false,
      progressPercent: this.calcProgress(0, words.length),
    })
  },

  pickRandomWords(count: number): Word[] {
    const pool = dictionary.slice()
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pool[i], pool[j]] = [pool[j], pool[i]]
    }
    return pool.slice(0, Math.min(count, pool.length))
  },

  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  },

  calcProgress(index: number, total: number) {
    if (total === 0) return 0
    return Math.round((index / total) * 100)
  },

  // 第一轮：选中文释义
  handleOptionTap(e: any) {
    const option = e.currentTarget.dataset.option as string
    const word = this._wordList[this.data.currentWordIndex]
    if (!word) return

    const correct = option === word.meaning
    if (!correct) {
      this._currentWordWrongInThisCycle = true
    }

    this.setData({
      lastAnswerCorrect: correct,
      showDetail: true,
    })
  },

  // 第二轮：认识 / 不认识
  handleKnow() {
    this.setData({
      lastAnswerCorrect: true,
      showDetail: true,
    })
  },

  handleDontKnow() {
    this._currentWordWrongInThisCycle = true
    this.setData({
      lastAnswerCorrect: false,
      showDetail: true,
    })
  },

  // 第三轮：想起来了 / 没想起
  handleRecall() {
    this.setData({
      lastAnswerCorrect: true,
      showDetail: true,
    })
  },

  handleDontRecall() {
    this._currentWordWrongInThisCycle = true
    this.setData({
      lastAnswerCorrect: false,
      showDetail: true,
    })
  },

  // 详情页“下一个”
  handleNextFromDetail() {
    const { round, currentWordIndex, totalWords, sessionType } = this.data
    const currentWord = this._wordList[currentWordIndex]
    if (!currentWord) return

    if (this._currentWordWrongInThisCycle) {
      if (round === 3) {
        this.updateWordStat(currentWord, false, sessionType)
      }
      this._currentWordWrongInThisCycle = false
      this.setData({
        round: 1,
        showDetail: false,
        currentWord,
        currentOptions: this.shuffle(currentWord.options.slice()),
      })
      return
    }

    if (round < 3) {
      this.setData({
        round: round + 1,
        showDetail: false,
      })
      return
    }

    this.updateWordStat(currentWord, true, sessionType)

    const nextIndex = currentWordIndex + 1
    if (nextIndex >= totalWords) {
      this.setData({
        currentWordIndex: nextIndex,
        progressPercent: this.calcProgress(nextIndex, totalWords),
        showDetail: true,
        isSessionFinished: true,
      })
      this.saveStats()
      return
    }

    const nextWord = this._wordList[nextIndex]
    this._currentWordWrongInThisCycle = false

    this.setData({
      currentWordIndex: nextIndex,
      round: 1,
      showDetail: false,
      currentWord: nextWord,
      currentOptions: this.shuffle(nextWord.options.slice()),
      progressPercent: this.calcProgress(nextIndex, totalWords),
    })
  },

  updateWordStat(word: Word, success: boolean, type: SessionType) {
    const now = Date.now()
    let stat = this._wordStats[word.id]

    if (!stat) {
      this._wordStats[word.id] = {
        stage: 1,
        nextReviewTime: now + REVIEW_INTERVALS_DAYS[0] * DAY_MS,
      }
      return
    }

    if (!success) {
      stat.stage = 1
      stat.nextReviewTime = now + REVIEW_INTERVALS_DAYS[0] * DAY_MS
    } else {
      const currentStageIndex = Math.min(stat.stage - 1, REVIEW_INTERVALS_DAYS.length - 1)
      const nextStageIndex = Math.min(currentStageIndex + 1, REVIEW_INTERVALS_DAYS.length - 1)
      stat.stage = nextStageIndex + 1
      stat.nextReviewTime = now + REVIEW_INTERVALS_DAYS[nextStageIndex] * DAY_MS
    }

    this._wordStats[word.id] = stat
  },
})


