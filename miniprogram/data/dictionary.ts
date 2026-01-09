export interface Word {
  id: string
  word: string
  phonetic: string
  meaning: string
  example: string
  exampleMeaning: string
  options: string[] // 4 个中文释义，包含 1 个正确项（即 meaning）
}

export const dictionary: Word[] = [
  {
    id: 'abandon',
    word: 'abandon',
    phonetic: '/əˈbændən/',
    meaning: 'v. 放弃；抛弃；遗弃',
    example: 'She refused to abandon her dream, even on the quietest and hardest days.',
    exampleMeaning: '即使是在最安静也最难熬的日子里，她也从未放弃自己的梦想。',
    options: [
      'v. 放弃；抛弃；遗弃',
      'v. 赞美；称赞',
      'v. 推迟；延后',
      'v. 装饰；点缀',
    ],
  },
  {
    id: 'accumulate',
    word: 'accumulate',
    phonetic: '/əˈkjuːmjəleɪt/',
    meaning: 'v. 积累；积聚',
    example: 'Tiny efforts you make today will quietly accumulate into tomorrow’s strength.',
    exampleMeaning: '你今天一点一滴的努力，都会悄悄积累成明天的力量。',
    options: [
      'v. 积累；积聚',
      'v. 反对；抵制',
      'v. 缓解；减轻',
      'v. 替代；取代',
    ],
  },
  {
    id: 'bewildered',
    word: 'bewildered',
    phonetic: '/bɪˈwɪldərd/',
    meaning: 'adj. 困惑的；迷茫的',
    example: 'It is okay to feel bewildered; the path appears slowly as you keep walking.',
    exampleMeaning: '感到迷茫没有关系，只要继续走，路会慢慢显露出来。',
    options: [
      'adj. 困惑的；迷茫的',
      'adj. 兴奋的；激动的',
      'adj. 自信的；坚定的',
      'adj. 喧闹的；吵闹的',
    ],
  },
  {
    id: 'commitment',
    word: 'commitment',
    phonetic: '/kəˈmɪtmənt/',
    meaning: 'n. 承诺；投入；责任',
    example: 'Your quiet commitment today is the warm promise you give to your future self.',
    exampleMeaning: '你今天默默的投入，是给未来自己的一份温柔承诺。',
    options: [
      'n. 承诺；投入；责任',
      'n. 谣言；流言',
      'n. 噪音；喧嚣',
      'n. 奖励；回报',
    ],
  },
  {
    id: 'dedicate',
    word: 'dedicate',
    phonetic: '/ˈdedɪkeɪt/',
    meaning: 'v. 奉献；致力于',
    example: 'When you dedicate time to study, you are quietly lighting a lamp for your future.',
    exampleMeaning: '当你把时间静静地献给学习时，你其实在为未来点一盏灯。',
    options: [
      'v. 奉献；致力于',
      'v. 分散；分配',
      'v. 询问；打听',
      'v. 振动；摇晃',
    ],
  },
  {
    id: 'endure',
    word: 'endure',
    phonetic: '/ɪnˈdʊr/',
    meaning: 'v. 忍受；承受；持续',
    example: 'You can endure this moment; it is just a short bridge towards a gentler future.',
    exampleMeaning: '你可以熬过现在的时刻，这只是通往更温柔未来的一座小桥。',
    options: [
      'v. 忍受；承受；持续',
      'v. 扩大；放大',
      'v. 监视；观察',
      'v. 抵达；到达',
    ],
  },
  {
    id: 'frustration',
    word: 'frustration',
    phonetic: '/frʌˈstreɪʃn/',
    meaning: 'n. 挫折；沮丧',
    example: 'Every frustration is a soft reminder that you are still bravely trying.',
    exampleMeaning: '每一次挫折，都是在轻声提醒你：你仍在勇敢地努力着。',
    options: [
      'n. 挫折；沮丧',
      'n. 灵感；启发',
      'n. 庆祝；欢呼',
      'n. 机会；机遇',
    ],
  },
  {
    id: 'grateful',
    word: 'grateful',
    phonetic: '/ˈɡreɪtfl/',
    meaning: 'adj. 感激的；心存感恩的',
    example: 'Be grateful for every small step; they are secretly guiding you forward.',
    exampleMeaning: '对每一步小小的前进心怀感激，它们正在悄悄引你向前。',
    options: [
      'adj. 感激的；心存感恩的',
      'adj. 寂静的；无声的',
      'adj. 多变的；善变的',
      'adj. 严厉的；苛刻的',
    ],
  },
  {
    id: 'persistence',
    word: 'persistence',
    phonetic: '/pərˈsɪstəns/',
    meaning: 'n. 坚持；执着',
    example: 'Persistence is like a gentle river, quietly polishing even the toughest rocks.',
    exampleMeaning: '坚持就像一条温柔的河流，静静地打磨最坚硬的石头。',
    options: [
      'n. 坚持；执着',
      'n. 误解；曲解',
      'n. 选择；抉择',
      'n. 景色；风景',
    ],
  },
  {
    id: 'reassure',
    word: 'reassure',
    phonetic: '/ˌriːəˈʃʊr/',
    meaning: 'v. 使安心；使消除疑虑',
    example: 'Let this quiet moment reassure you: you are already on your way.',
    exampleMeaning: '让这一刻的安静安慰你：你已经在路上了。',
    options: [
      'v. 使安心；使消除疑虑',
      'v. 预测；预报',
      'v. 交换；互换',
      'v. 记录；记载',
    ],
  },
]


