const AI_SUBJECT = {
  "id": "ai",
  "name": "AI引论",
  "icon": "AI",
  "fullName": "人工智能引论",
  "chapters": {
    "00 概念题扫盲": [
      {
        "q": "辨析：期中前略低权重？",
        "a": "模块：数学基础、Python、搜索、CSP/SAT、对抗搜索、MCTS、机器学习基础、回归、树模型、神经网络<br>你要防的错：<span class='kw'>判断题陷阱</span> + <span class='kw'>基础计算概念</span> + <span class='kw'>模型定义</span>"
      },
      {
        "q": "辨析：期中后高权重？",
        "a": "模块：视觉、三维重建、NLP、Transformer、知识图谱、机器人、强化学习、多智能体、仿真<br>你要防的错：<span class='kw'>概念辨析</span> + <span class='kw'>建模对象</span> + <span class='kw'>方法适用条件</span>"
      },
      {
        "q": "辨析：贯穿全卷？",
        "a": "模块：<span class='kw'>概率语言、状态</span>/<span class='kw'>动作</span>/<span class='kw'>价值、模型</span>/<span class='kw'>损失</span>/<span class='kw'>优化、图结构、仿真与真实世界</span><br>你要防的错：用定义说话；用边界条件反杀绝对化表述"
      },
      {
        "q": "辨析：1. 定对象？",
        "a": "动作：先问：这个概念讨论的是事件/随机变量/状态/动作/策略/模型/损失/图/文本/图像/仿真中的哪一个？<br>典型问法：<span class='kw'>“A*</span> <span class='kw'>一定扩展最少节点”“ReLU</span> <span class='kw'>使模型非线性”“策略提升得到最优策略”</span><br>反制办法：把主语圈出来：算法？模型？一次迭代？最终收敛？"
      },
      {
        "q": "辨析：2. 查条件？",
        "a": "动作：再问：结论<span class='kw'>成立需要什么条件</span>？是否独立？是否零和？是否 admissible？是否固定策略？是否终止状态？<br>典型问法：“可采纳启发式保证每个节点不被扩展”“零和博弈一定有纯策略均衡”<br>反制办法：列<span class='kw'>必要条件</span>，缺一个就不能无条件断言。"
      },
      {
        "q": "辨析：3. 找反例？",
        "a": "动作：最后问：有没有边界样例能推翻？如所有 ReLU 处于同一区域、随机森林深树过拟合、平行线透视投影相交。<br>典型问法：<span class='kw'>“独立等价于不相关”“BoW</span> <span class='kw'>能表达上下文顺序”</span><br>反制办法：构造最小反例：2 个变量、2 个动作、2 个状态、2 个词。"
      },
      {
        "q": "辨析：一定 / 必然 / 总是？",
        "a": "为什么危险：<span class='kw'>AI</span> <span class='kw'>算法多依赖假设、近似、初始化、样本量和搜索顺序。</span><br>安全改写：<span class='kw'>在……条件下；通常；可能；若满足……</span>"
      },
      {
        "q": "辨析：等价于？",
        "a": "为什么危险：<span class='kw'>很多概念只是单向推出</span>，如一致启发式</span> ⇒ <span class='kw'>可采纳，不相关不一定独立。</span><br>安全改写：A 推出 <span class='kw'>B；B</span> <span class='kw'>不一定推出</span> A。"
      },
      {
        "q": "辨析：最优 / 唯一？",
        "a": "为什么危险：<span class='kw'>最优</span>性常需完整搜索、凸性、收敛条件；均衡可能不<span class='kw'>唯一</span>。<br>安全改写：<span class='kw'>局部最优</span>/<span class='kw'>全局最优；一个</span>/<span class='kw'>至少一个。</span>"
      },
      {
        "q": "辨析：不会 / 没有 / 不能？",
        "a": "为什么危险：容易被边界条件击穿，如软最大能处理多类，线性模型可处理线性可分问题。<br>安全改写：一般<span class='kw'>不能</span>；在某些场景下不适合。"
      },
      {
        "q": "辨析：概率 / 价值 / 奖励混用？",
        "a": "为什么危险：<span class='kw'>概率</span>是归一化非负量；<span class='kw'>价值</span>是未来回报期望；奖励是一步反馈。<br>安全改写：<span class='kw'>分别写</span> <span class='kw'>P、V</span>/<span class='kw'>Q、r</span>/R。"
      },
      {
        "q": "辨析：概率链？",
        "a": "对象：<span class='kw'>事件、随机变量、条件概率、期望</span><br>核心问题：<span class='kw'>不确定性如何被建模与更新？</span><br>常见错法：把互斥当独立；把密度当概率；把后验当似然。"
      },
      {
        "q": "辨析：搜索链？",
        "a": "对象：<span class='kw'>状态、动作、代价、启发式、约束</span><br>核心问题：<span class='kw'>如何在空间中找满足条件或最小代价的解？</span><br>常见错法：把 BFS/UCS/A* 混成一个；忽略图搜索重复检测。"
      },
      {
        "q": "辨析：学习链？",
        "a": "对象：<span class='kw'>数据、特征、模型、损失、优化、泛化</span><br>核心问题：<span class='kw'>如何从经验中改进表现？</span><br>常见错法：把模型输出、概率、类别、损失混用。"
      },
      {
        "q": "辨析：决策链？",
        "a": "对象：<span class='kw'>状态、动作、策略、奖励、价值、均衡</span><br>核心问题：<span class='kw'>如何在环境</span>/<span class='kw'>对手中选择行动？</span><br>常见错法：把奖励当价值；把个体最优当全局最优。"
      },
      {
        "q": "判断并纠偏：一致启发式一定可采纳。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：由三角不等式沿最优路径递推。"
      },
      {
        "q": "判断并纠偏：可采纳启发式一定一致。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：单向不成立。"
      },
      {
        "q": "判断并纠偏：测试集可以用于反复调超参数。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：会造成数据泄漏。"
      },
      {
        "q": "判断并纠偏：ReLU 网络在固定激活模式下是分段线性的。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：每个区域内为仿射映射。"
      },
      {
        "q": "判断并纠偏：反向传播本质是链式法则。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：自动高效计算梯度。"
      },
      {
        "q": "判断并纠偏：朴素贝叶斯假设特征在类别条件下独立。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：不是无条件独立。"
      },
      {
        "q": "判断并纠偏：Self-attention 只能捕捉相邻 token 关系。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：可直接连接任意位置。"
      },
      {
        "q": "判断并纠偏：SLAM 是同时定位与地图构建。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：localization + mapping。"
      },
      {
        "q": "判断并纠偏：策略评估阶段会主动改变策略。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：固定策略计算价值。"
      },
      {
        "q": "判断并纠偏：策略提升得到的新策略总是不劣于旧策略。？",
        "a": "判定：对/<span class='kw'>需条件</span><br>理由一句话：在标准策略提升定理条件下成立。"
      },
      {
        "q": "判断并纠偏：纳什均衡一定是帕累托最优。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：囚徒困境反例。"
      },
      {
        "q": "判断并纠偏：MARL 难点之一是对单个智能体而言环境可能非稳态。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：其他智能体也在学习。"
      },
      {
        "q": "判断并纠偏：数字孪生只需要几何外观相似。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：还需物理规律、控制/状态等任务相关要素。"
      },
      {
        "q": "辨析：策略评估？",
        "a": "A 的核心：<span class='kw'>固定策略求</span> <span class='kw'>Vπ</span><br>概念 B：<span class='kw'>策略提升</span><br>B 的核心：用 V/Q 改策略<br>考场切分标准：问“这一轮是否改变动作选择”。"
      },
      {
        "q": "辨析：状态价值 V？",
        "a": "A 的核心：<span class='kw'>从状态开始</span><br>概念 B：<span class='kw'>动作价值</span> Q<br>B 的核心：先选动作再开始<br>考场切分标准：Q 多一个动作维度。"
      },
      {
        "q": "辨析：信息增益？",
        "a": "A 的核心：<span class='kw'>熵下降量</span><br>概念 B：<span class='kw'>增益率</span><br>B 的核心：<span class='kw'>信息增益</span>除以固有值<br>考场切分标准：多值特征偏好是信息增益的坑。"
      },
      {
        "q": "辨析：定位？",
        "a": "A 的核心：<span class='kw'>我在哪</span><br>概念 B：<span class='kw'>建图</span><br>B 的核心：环境长什么样<br>考场切分标准：SLAM 是同时做。"
      },
      {
        "q": "辨析：System ID？",
        "a": "A 的核心：<span class='kw'>估计真实参数</span><br>概念 B：<span class='kw'>Domain</span> <span class='kw'>Randomization</span><br>B 的核心：随机化参数训练鲁棒策略<br>考场切分标准：一个校准，一个泛化。"
      },
      {
        "q": "辨析：纳什均衡？",
        "a": "A 的核心：<span class='kw'>单方无动机偏离</span><br>概念 B：<span class='kw'>帕累托最优</span><br>B 的核心：不能无损改善某人<br>考场切分标准：稳定不等于高效。"
      },
      {
        "q": "辨析：解释一个概念？",
        "a": "建议作答结构：<span class='kw'>定义</span> → <span class='kw'>对象</span> → <span class='kw'>作用</span> → <span class='kw'>限制</span>/<span class='kw'>例子</span><br>示例句式：“A 是针对……对象的……方法，用于……；它成立/有效通常依赖……。”"
      },
      {
        "q": "辨析：比较两个概念？",
        "a": "建议作答结构：<span class='kw'>共同点</span> → <span class='kw'>差异维度</span> 1/2/3 → <span class='kw'>典型场景</span><br>示例句式：<span class='kw'>“二者都……，但</span> A <span class='kw'>关注……，B</span> 关注……；因此在……题中应使用 A。”"
      },
      {
        "q": "辨析：判断一句话正误？",
        "a": "建议作答结构：<span class='kw'>先判定</span> → <span class='kw'>指出错在何处</span> → <span class='kw'>给反例或条件</span><br>示例句式：“该说法不总成立。它把……误认为……；当……时可构造反例。”"
      },
      {
        "q": "辨析：说明方法适用性？",
        "a": "建议作答结构：<span class='kw'>输入</span>/<span class='kw'>假设</span> → <span class='kw'>输出</span> → <span class='kw'>保证</span> → <span class='kw'>不适用情形</span><br>示例句式：“该方法输入为……，输出为……；在……条件下保证……；若……则不能直接使用。”"
      },
      {
        "q": "辨析：ML 总论？",
        "a": "必须能回答的问题：<span class='kw'>能否区分模型、损失、优化器、评价指标、超参数？</span>"
      },
      {
        "q": "辨析：树/森林？",
        "a": "必须能回答的问题：能否解释信息增益、增益率、Gini、bagging <span class='kw'>的关系？</span>"
      },
      {
        "q": "辨析：RL？",
        "a": "必须能回答的问题：<span class='kw'>能否区分</span> <span class='kw'>r、G、V、Q、π？策略评估和提升各做什么？</span>"
      }
    ],
    "01 总论、概率与 Python": [
      {
        "q": "辨析：人工智能？",
        "a": "正确理解：研究模拟、延伸和扩展人类智能的理论、方法、技术和应用系统。课程中常从“理性行为智能体”角度组织。<br>最容易错成：<span class='kw'>只等于深度学习</span>/<span class='kw'>大模型</span>/<span class='kw'>聊天机器人。</span><br>判断题反杀句：AI 是一组问题和方法，不是单一算法。"
      },
      {
        "q": "辨析：四种 AI 定义？",
        "a": "正确理解：类人思考、类人行为、理性思考、理性行为。<span class='kw'>AI</span>MA 常以 rational agent 为核心。<br>最容易错成：<span class='kw'>只有“像人”才算</span> <span class='kw'>AI。</span><br>判断题反杀句：像人不是唯一目标，理性行动也可<span class='kw'>定义</span>智能。"
      },
      {
        "q": "辨析：图灵测试？",
        "a": "正确理解：<span class='kw'>关注机器能否表现出与人难以区分的语言行为；需要</span> <span class='kw'>NLP、知识表示、推理、学习等能力。</span><br>最容易错成：<span class='kw'>证明机器真正有意识。</span><br>判断题反杀句：<span class='kw'>图灵测试</span>是行为标准，不直接证明意识。"
      },
      {
        "q": "辨析：智能体 Agent？",
        "a": "正确理解：<span class='kw'>感知环境并采取行动以最大化期望效用的系统。</span><br>最容易错成：<span class='kw'>只能是机器人。</span><br>判断题反杀句：软件推荐系统、搜索算法也可视为<span class='kw'>智能体</span>。"
      },
      {
        "q": "辨析：AI+X？",
        "a": "正确理解：<span class='kw'>AI</span> 与领域知识结合；关键是把领域问题转成数据、模型、决策或仿真问题。<br>最容易错成：<span class='kw'>把模型套上去就完事。</span><br>判断题反杀句：建模质量决定 AI 是否真正有用。"
      },
      {
        "q": "辨析：样本空间 vs 事件？",
        "a": "区别：<span class='kw'>样本空间</span> Ω 是所有可能结果；<span class='kw'>事件</span> A 是 Ω <span class='kw'>的子集。</span><br>错题常见说法：<span class='kw'>一次实验的某个结果就是样本空间。</span><br>正确判断：单个结果通常是样本点；事件可含多个样本点。"
      },
      {
        "q": "辨析：互斥 vs 独立？",
        "a": "区别：<span class='kw'>互斥</span>：A∩B=∅；<span class='kw'>独立</span>：P(A∩B)=P(A)P(B)。非零概率互斥事件不独立。<br>错题常见说法：<span class='kw'>互斥事件互不影响，所以独立。</span><br>正确判断：若 P(A),P(B)&gt;0 且互斥，则 P(A∩B)=0≠P(A)P(B)。"
      },
      {
        "q": "辨析：条件概率 vs 联合概率？",
        "a": "区别：<span class='kw'>P(A|B)=P(A∩B)</span>/<span class='kw'>P(B)，前提</span> <span class='kw'>P(B)&gt;0。</span><br>错题常见说法：<span class='kw'>P(A|B)=P(A∩B)。</span><br>正确判断：<span class='kw'>条件概率</span>是“在 B 已发生世界里重新归一化”。"
      },
      {
        "q": "辨析：全概率 vs Bayes？",
        "a": "区别：<span class='kw'>全概率</span>求证据 P(A)；<span class='kw'>Bayes</span> <span class='kw'>由证据反推原因</span> <span class='kw'>P(B_i|A)。</span><br>错题常见说法：Bayes <span class='kw'>公式直接等于似然。</span><br>正确判断：后验 ∝ 先验 × 似然；还要除以证据归一化。"
      },
      {
        "q": "辨析：随机变量独立 vs 不相关？",
        "a": "区别：<span class='kw'>独立</span> ⇒ <span class='kw'>协方差为</span> <span class='kw'>0；协方差为</span> 0 <span class='kw'>不一定独立。</span><br>错题常见说法：Cov=0 等价于独立。<br>正确判断：只有某些特殊分布（如联合高斯）下可由<span class='kw'>不相关</span>推出独立。"
      },
      {
        "q": "辨析：概率密度 vs 概率？",
        "a": "区别：<span class='kw'>连续型</span> <span class='kw'>f(x)</span> <span class='kw'>可大于</span> 1；<span class='kw'>概率</span>是积分面积。<br>错题常见说法：<span class='kw'>f(x)=2</span> 不合法。<br>正确判断：密度非负且总积分为 1 即合法。"
      },
      {
        "q": "辨析：期望 vs 最可能值？",
        "a": "区别：<span class='kw'>期望</span>是加权平均；众数是概率最大点。<br>错题常见说法：<span class='kw'>期望一定是某个可能取值。</span><br>正确判断：连续/离散都不一定取到期望。"
      },
      {
        "q": "辨析：方差 vs 标准差？",
        "a": "区别：<span class='kw'>方差</span>是平方量纲，<span class='kw'>标准差</span>是原量纲。<br>错题常见说法：<span class='kw'>方差越大均值越大。</span><br>正确判断：方差描述波动，不描述中心位置。"
      },
      {
        "q": "记住这条陷阱：最小反例模板：判断独立性时，不要凭直觉说“看起来无关”。写 P(A∩B) 和 P(A？",
        "a": "<span class='kw'>最小反例模板</span>：<span class='kw'>判断独立性时</span>，<span class='kw'>不要凭直觉说</span>“<span class='kw'>看起来无关</span>”。写 P(A∩B) 和 P(A)P(B)。判断连续变量概率时，不看 f(a)，而看区间积分。"
      },
      {
        "q": "辨析：list / tuple / dict / set？",
        "a": "正确理解：<span class='kw'>list</span> 可变有序；<span class='kw'>tuple</span> 不可变有序；<span class='kw'>dict</span> 键值映射；<span class='kw'>set</span> 去重且不保证顺序。<br>易错点：把 set <span class='kw'>当有序数组；dict</span> key 用可变对象。<br>考试/作业中的自检：若要按索引访问，优先 list/tuple；若查找去重，优先 set/dict。"
      },
      {
        "q": "辨析：浅拷贝 vs 深拷贝？",
        "a": "正确理解：<span class='kw'>浅拷贝</span>只复制外层容器；内层对象仍共享。<br>易错点：<span class='kw'>b=a[</span>:] <span class='kw'>后嵌套列表完全独立。</span><br>考试/作业中的自检：嵌套结构需 copy.deepcopy。"
      },
      {
        "q": "辨析：NumPy 广播？",
        "a": "正确理解：<span class='kw'>维度从右向左对齐，长度相同或其中一个为</span> 1 才可<span class='kw'>广播</span>。<br>易错点：<span class='kw'>任意矩阵都能自动相加。</span><br>考试/作业中的自检：先写 shape，再判断是否兼容。"
      },
      {
        "q": "辨析：* vs @？",
        "a": "正确理解：<span class='kw'>NumPy</span> 中 * <span class='kw'>是逐元素乘法，@</span> 或 <span class='kw'>np.dot</span> <span class='kw'>是矩阵乘法。</span><br>易错点：把 * <span class='kw'>当线性代数乘法。</span><br>考试/作业中的自检：写梯度/前向传播时先检查维度。"
      },
      {
        "q": "辨析：可变默认参数？",
        "a": "正确理解：<span class='kw'>函数默认参数只创建一次。</span><br>易错点：<span class='kw'>def</span> <span class='kw'>f(x,</span> <span class='kw'>a=[])</span> <span class='kw'>每次调用得到新列表。</span><br>考试/作业中的自检：默认写 None，再在函数体内创建。"
      },
      {
        "q": "判断并纠偏：互斥事件一定独立。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：非零概率互斥事件同时发生概率为 0，不满足独立乘法。"
      },
      {
        "q": "判断并纠偏：随机变量独立一定不相关。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：独立推出 E[XY]=E[X]E[Y]。"
      },
      {
        "q": "判断并纠偏：随机变量不相关一定独立。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：一般不成立。"
      },
      {
        "q": "判断并纠偏：连续型随机变量在某点的概率等于密度值。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：点概率通常为 0，密度要积分。"
      },
      {
        "q": "判断并纠偏：Bayes 公式本质上是由结果反推原因的后验更新。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：后验 ∝ 先验 × 似然。"
      },
      {
        "q": "判断并纠偏：奖励 r 等于状态价值 V。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：一步反馈 vs 长期期望回报。"
      },
      {
        "q": "辨析：奖励 r？",
        "a": "A 的核心：<span class='kw'>即时一步反馈</span><br>概念 B：<span class='kw'>价值</span> V/Q<br>B 的核心：未来折扣回报的期望<br>考场切分标准：RL 题先分清“现在给多少”和“以后总期望多少”。"
      },
      {
        "q": "辨析：生成式模型？",
        "a": "A 的核心：<span class='kw'>建模数据生成过程</span><br>概念 B：<span class='kw'>判别式模型</span><br>B 的核心：建模判别边界/条件概率<br>考场切分标准：看 p(x,y)/p(x|y) 还是 p(y|x)。"
      },
      {
        "q": "辨析：概率？",
        "a": "必须能回答的问题：<span class='kw'>能否区分互斥、独立、不相关？能否一句话说出</span> <span class='kw'>Bayes</span> <span class='kw'>的“先验×似然</span>/<span class='kw'>证据”？</span>"
      },
      {
        "q": "计算/建模模板：朴素贝叶斯算题模板？",
        "a": "<span class='kw'>小表预测x=(0,0)</span>: 对y=0/1分别算 prior × ∏条件概率。若某项未出现且不平滑, 该类score可能为0。<br>Laplace平滑务必在分母加α×取值数; binary特征是+2α, 多值特征是+α|V_k|。<br>文本NB: Multinomial NB用词出现次数; Bernoulli NB用词是否出现。两者条件概率估计不同。"
      },
      {
        "q": "计算/建模模板：朴素贝叶斯？",
        "a": "<span class='kw'>目标</span>: 预测 y*=argmax_y P(Y=y|X=x)。Bayes: ∝ P(Y=y)P(X=x|Y=y)。<br>朴素假设: 给定Y后特征条件独立, P(X=x|Y=y)=∏_{k=1}^d P(X_k=x_k|Y=y)。<br>伯努利特征: θ_{k,y}=P(X_k=1|Y=y)。P(X_k=x_k|Y=y)=θ_{k,y}^{x_k}(1-θ_{k,y})^{1-x_k}。<br>MLE: φ_y=P(Y=y)=n_y/n; θ_{k,y}=count(X_k=1,Y=y)/n_y。<br>Laplace平滑: φ_y=(n_y+α)/(n+α|C|); θ=(count+α)/(n_y+2α) for binary。<br>计算用log: score(y)=logφ_y+Σ_k[x_k logθ_{k,y}+(1-x_k)log(1-θ_{k,y})]。<br>24大题: 先推公式, 再用小表算频率; 若题目说“不加平滑”, 出现0概率就保留0。<br>n-gram语言模型<br>链式法则: P(w_1:n)=∏_i P(w_i|w_1:i-1)。n-gram近似: P(w_i|w_{i-n+1:i-1})。<br>MLE: P(w_i|h)=count(h,w_i)/count(h)。加一平滑: (count+1)/(count(h)+|V|)。<br>困惑度: PP=P(sentence)^(-1/N), 越低越好。<br>分词/tokenization: 中文需切词; BPE/WordPiece从字符合并高频片段, 兼顾未知词。"
      }
    ],
    "02 搜索、CSP 与博弈搜索": [
      {
        "q": "辨析：状态 State？",
        "a": "本质：<span class='kw'>描述问题当前局面的信息。</span><br>适用/保证：<span class='kw'>必须足以决定后续动作和目标测试。</span><br>常见概念坑：<span class='kw'>状态</span>不是节点；节点通常含状态、父节点、路径代价等。"
      },
      {
        "q": "辨析：动作 Action？",
        "a": "本质：<span class='kw'>从某状态可采取的决策。</span><br>适用/保证：<span class='kw'>动作</span>集合可能依状态变化。<br>常见概念坑：动作不是转移结果。"
      },
      {
        "q": "辨析：转移模型？",
        "a": "本质：<span class='kw'>给定状态和动作后得到后继状态；可确定或随机。</span><br>适用/保证：<span class='kw'>搜索课多为确定转移，RL</span> <span class='kw'>常为随机转移。</span><br>常见概念坑：把转移概率和动作代价混用。"
      },
      {
        "q": "辨析：路径代价 g(n)？",
        "a": "本质：<span class='kw'>从初始节点到</span> n <span class='kw'>的累计代价。</span><br>适用/保证：<span class='kw'>UCS</span>/<span class='kw'>A*</span> <span class='kw'>用它排序。</span><br>常见概念坑：不是启发式，也不是节点深度。"
      },
      {
        "q": "辨析：目标测试？",
        "a": "本质：<span class='kw'>判断当前状态是否为目标。</span><br>适用/保证：<span class='kw'>不同问题目标条件不同。</span><br>常见概念坑：不一定只有一个目标状态。"
      },
      {
        "q": "辨析：BFS？",
        "a": "优先扩展什么：<span class='kw'>浅层节点</span><br>数据结构/排序键：<span class='kw'>FIFO</span> <span class='kw'>队列；按深度</span><br>最优性条件：单位代价时最优<br>高危误区：边权不同还用 <span class='kw'>BFS</span> 找最短代价。"
      },
      {
        "q": "辨析：DFS？",
        "a": "优先扩展什么：<span class='kw'>深层节点</span><br>数据结构/排序键：<span class='kw'>LIFO</span> 栈/<span class='kw'>递归</span><br>最优性条件：一般不保证最优，也可能不完备<br>高危误区：看到树就默认 <span class='kw'>DFS</span> 一定能很快找到解。"
      },
      {
        "q": "辨析：UCS？",
        "a": "优先扩展什么：<span class='kw'>当前路径代价最小节点</span><br>数据结构/排序键：<span class='kw'>优先队列；g(n)</span><br>最优性条件：边代价非负时最优<br>高危误区：把 <span class='kw'>UCS</span> 当 BFS；忽略重复状态更新。"
      },
      {
        "q": "辨析：Greedy？",
        "a": "优先扩展什么：<span class='kw'>启发式看起来最近</span><br>数据结构/排序键：<span class='kw'>h(n)</span><br>最优性条件：一般不保证最优<br>高危误区：只看 h，忘记已经走过的代价。"
      },
      {
        "q": "辨析：A*？",
        "a": "优先扩展什么：<span class='kw'>估计总代价最小</span><br>数据结构/排序键：<span class='kw'>f(n)=g(n)+h(n)</span><br>最优性条件：h 可采纳时树搜索最优；图搜索还常要求一致<br>高危误区：以为可采纳意味着扩展节点最少/永不扩展坏节点。"
      },
      {
        "q": "记住这条陷阱：启发式扫盲：可采纳 admissible：h(n) 不高估真实剩余代价。 一致 co？",
        "a": "<span class='kw'>启发式扫盲</span>：<span class='kw'>可采纳</span> <span class='kw'>admissible</span>：h(n) 不高估真实剩余代价。 一致 consistent：h(n) ≤ c(n,a,n') + h(n')。一致 ⇒ 可采纳；可采纳不一定一致。"
      },
      {
        "q": "辨析：CSP？",
        "a": "正确理解：<span class='kw'>变量、域、约束；目标是给所有变量赋值且满足约束。</span><br>考试易错句：<span class='kw'>CSP</span> <span class='kw'>状态是任意黑盒。</span><br>纠偏：CSP 状态是部分赋值，结构比一般搜索更强。"
      },
      {
        "q": "辨析：MRV？",
        "a": "正确理解：<span class='kw'>优先选择剩余合法值最少的变量。</span><br>考试易错句：<span class='kw'>MRV</span> <span class='kw'>选约束最少的变量。</span><br>纠偏：MRV 是变量顺序启发；减少分支爆炸。"
      },
      {
        "q": "辨析：LCV？",
        "a": "正确理解：<span class='kw'>优先选择对其他变量限制最少的值。</span><br>考试易错句：<span class='kw'>LCV</span> <span class='kw'>选让当前变量最舒服的值。</span><br>纠偏：它看的是对未来变量的影响。"
      },
      {
        "q": "辨析：Forward checking？",
        "a": "正确理解：<span class='kw'>赋值后检查并删除邻居变量域中不合法的值。</span><br>考试易错句：<span class='kw'>能保证全局一致。</span><br>纠偏：只做局部提前剪枝，不保证解存在。"
      },
      {
        "q": "辨析：Arc consistency？",
        "a": "正确理解：<span class='kw'>每条弧上每个取值都能在相邻变量中找到支持。</span><br>考试易错句：<span class='kw'>弧一致等于问题已解决。</span><br>纠偏：弧一致仍可能无解。"
      },
      {
        "q": "辨析：SAT？",
        "a": "正确理解：<span class='kw'>布尔变量</span> + <span class='kw'>逻辑子句，常用</span> <span class='kw'>CNF。</span><br>考试易错句：<span class='kw'>SAT</span> <span class='kw'>只能表达简单问题。</span><br>纠偏：许多组合约束可编码成 SAT。"
      },
      {
        "q": "辨析：DPLL？",
        "a": "正确理解：<span class='kw'>递归分支</span> + <span class='kw'>单子句传播</span> + <span class='kw'>纯文字等剪枝。</span><br>考试易错句：<span class='kw'>只是暴力枚举。</span><br>纠偏：传播和剪枝是核心。"
      },
      {
        "q": "辨析：CDCL？",
        "a": "正确理解：<span class='kw'>冲突分析、学习子句、非时序回溯</span> <span class='kw'>backjump。</span><br>考试易错句：<span class='kw'>学到的子句只是记录错题。</span><br>纠偏：学习子句会改变后续搜索空间，避免同类冲突。"
      },
      {
        "q": "辨析：Minimax？",
        "a": "正确理解：<span class='kw'>零和、轮流、完全信息博弈中假设双方最优，MAX</span> <span class='kw'>取最大，MIN</span> <span class='kw'>取最小。</span><br>常见误区：<span class='kw'>只要有对手就能直接用。</span><br>一句话防错：前提是对抗结构和效用定义清楚。"
      },
      {
        "q": "辨析：Alpha-Beta 剪枝？",
        "a": "正确理解：<span class='kw'>不改变</span> <span class='kw'>minimax</span> 结果，只减少不必要搜索；<span class='kw'>剪枝</span>效果依赖节点顺序。<br>常见误区：<span class='kw'>剪枝会近似答案。</span><br>一句话防错：<span class='kw'>Alpha-Beta</span> 是精确剪枝。"
      },
      {
        "q": "辨析：估值函数？",
        "a": "正确理解：<span class='kw'>为非终止状态估计好坏。</span><br>常见误区：<span class='kw'>估值函数</span>一定准确。<br>一句话防错：它是近似，深度受限时尤其关键。"
      },
      {
        "q": "辨析：Expectimax？",
        "a": "正确理解：<span class='kw'>机会节点按概率取期望。</span><br>常见误区：<span class='kw'>随机对手一定用</span> <span class='kw'>Min</span> <span class='kw'>节点。</span><br>一句话防错：随机性用期望；理性对手用 min/max。"
      },
      {
        "q": "辨析：Monte Carlo？",
        "a": "正确理解：<span class='kw'>通过随机采样近似估计。</span><br>常见误区：<span class='kw'>随机就不可靠。</span><br>一句话防错：样本足够时可近似复杂期望/搜索。"
      },
      {
        "q": "辨析：MCTS 四步？",
        "a": "正确理解：Selection、Expansion、Simulation、Backpropagation。<br>常见误区：<span class='kw'>只做随机</span> <span class='kw'>rollout。</span><br>一句话防错：核心是搜索树逐步增长与价值回传。"
      },
      {
        "q": "辨析：UCB/UCT？",
        "a": "正确理解：<span class='kw'>利用均值收益</span> + <span class='kw'>探索项平衡</span> <span class='kw'>exploitation</span>/<span class='kw'>exploration。</span><br>常见误区：<span class='kw'>访问次数越多探索项越大。</span><br>一句话防错：某动作访问越多，其探索项通常变小。"
      },
      {
        "q": "判断并纠偏：BFS 在边权不等时仍保证最小总代价。？",
        "a": "判定：错<br>理由一句话：<span class='kw'>BFS</span> 只保证最少步数，单位边权时才等价最小代价。"
      },
      {
        "q": "判断并纠偏：UCS 使用路径代价 g(n) 作为优先级。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：非负边权下最优。"
      },
      {
        "q": "判断并纠偏：A* 中 h 可采纳表示绝不高估真实剩余代价。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：这是 admissible 的定义。"
      },
      {
        "q": "判断并纠偏：Alpha-Beta 剪枝会改变 minimax 的精确值。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：只减少搜索，不改结果。"
      },
      {
        "q": "判断并纠偏：MCTS 每轮都包含选择、扩展、模拟、回传等阶段。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：典型四步。"
      },
      {
        "q": "判断并纠偏：弧一致可以保证 CSP 一定有解。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：局部一致不等于全局可满足。"
      },
      {
        "q": "判断并纠偏：零和博弈双方收益和为 0。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：一方收益是另一方损失。"
      },
      {
        "q": "辨析：搜索？",
        "a": "<span class='kw'>必须能回答的问题：能否说清</span> BFS、UCS、A* 的排序键分别是什么？admissible 与 consistent 谁推出谁？"
      },
      {
        "q": "辨析：CSP/SAT？",
        "a": "<span class='kw'>必须能回答的问题：能否区分</span> MRV 与 LCV？Forward checking 与 arc consistency 的强弱？"
      },
      {
        "q": "辨析：博弈搜索？",
        "a": "<span class='kw'>必须能回答的问题：能否说清</span> minimax、alpha-beta、expectimax、MCTS 分别解决什么问题？"
      },
      {
        "q": "计算/建模模板：24期末题型雷达？",
        "a": "总分布: 判断题42=14*3; NLP/Transformer 10; RL 12; KG 12; ML/Naive Bayes 15; 搜索/MCTS 9。<br><span class='kw'>判断题考法</span>: <span class='kw'>不是背定义,</span> <span class='kw'>而是“反例</span>/<span class='kw'>边界条件</span>/<span class='kw'>建模假设”。错题要写理由。</span><br>今年增量: 多智能体与仿真是新课重点, 24卷没有单独大题, 但应按大题准备。<br>答题优先级: 先写状态/变量/概率/目标函数, 再代公式; 计算题必须标明维度。<br>概率与统计计算<br>条件概率: P(A|B)=P(A∩B)/P(B)。独立: P(A∩B)=P(A)P(B), 等价 P(A|B)=P(A)(P(B)&gt;0)。<br>全概率: 若 {B_i} 划分Ω, P(A)=Σ_i P(B_i)P(A|B_i)。Bayes: P(B_i|A)=P(B_i)P(A|B_i)/Σ_j P(B_j)P(A|B_j)。<br>离散期望/方差: E[X]=Σ_x x p(x), Var(X)=E[X^2]-E[X]^2。连续: ∫x f(x)dx, ∫(x-μ)^2f(x)dx。<br>协方差: Cov(X,Y)=E[XY]-E[X]E[Y]; ρ=Cov/(σ_Xσ_Y)。独立=&gt;Cov=0; Cov=0不一定独立。<br>二项分布: X~Bin(n,p), E=np, Var=np(1-p)。几何分布(首次成功次数): P(X=k)=(1-p)^(k-1)p。<br>错排数: D_n=n!Σ_{k=0}^n(-1)^k/k!, 4人全错 D4/4!=9/24。<br>建模口诀: 样本空间→事件定义→是否放回/独立→条件化→套全概率/Bayes。<br>Python/NumPy速查<br>list可变; tuple不可变; dict键值; set去重。循环调试: 先打印形状/边界, 再打印中间量。<br>矩阵: A@B 矩阵乘; A*B逐元素; x.reshape; axis=0按列聚合, axis=1按行聚合。<br>softmax稳定写法: z=x-max(x); p=exp(z)/sum(exp(z))。logsumexp: m+logΣexp(x-m)。<br>向量化梯度: X:(n,d), w:(d,), y:(n,)。线性回归 grad_w=2/n X^T(Xw+b-y)。"
      },
      {
        "q": "计算/建模模板：搜索问题建模？",
        "a": "<span class='kw'>五要素</span>: state, initial, goal test, actions, transition, cost。解题先把这几项写清。<br>DFS: 栈, 深, 省空间, 非最优。BFS: 队列, 浅, 单位代价最优。UCS: 按g(n)最小弹出, 非负边权最优。<br>A*: f(n)=g(n)+h(n)。admissible: 0≤h(n)≤h*(n), 保最优。consistent: h(n)≤c(n,a,n’)+h(n’), f沿路径不降。<br>A*陷阱: 若最优代价C*, f(n)&lt;C*的节点必扩; f(n)=C*是否扩依赖tie-break; 只知道g(n)≤C*不够。<br>启发函数设计: 网格用Manhattan/Euclidean; 松弛约束得到的最短距离通常admissible。<br>复杂度口径: branching factor b, depth d。BFS O(b^d), DFS O(bm), A*取决于h质量。<br>CSP/SAT/CDCL<br>CSP: 变量X_i, 域D_i, 约束C。状态=部分赋值; 动作=给未赋值变量赋值; 目标=全赋值且满足约束。<br>回溯+剪枝: MRV选剩余值最少变量; Degree打破平局; LCV先试约束别人最少的值。Forward checking删未来不合法值。<br>Arc consistency: 对弧 X→Y, X中每个值都存在Y的支持值。AC-3: 出队弧→删值→相关弧入队。<br>图K着色CNF: 每点至少一色: ∨_k C_{ik}; 至多一色: ∧_{k&lt;l}(¬C_{ik}∨¬C_{il}); 相邻异色: ∧_{(i,j),k}(¬C_{ik}∨¬C_{jk})。<br>DPLL: 选变量→赋值→unit propagation→pure literal→回溯。CDCL: 冲突图→学习子句→backjump; 好的learned clause回跳后变unit, 立即BCP。<br>CNF转换: 去蕴含 P→Q = ¬P∨Q; 德摩根; 量词前束; 分配∨ over ∧。"
      },
      {
        "q": "计算/建模模板：对抗搜索？",
        "a": "Minimax: MAX层取max, MIN层取min。终局utility; 深度受限时用eval(s)=Σ_i w_i f_i(s)。<br>Alpha-Beta: α=MAX已知下界, β=MIN已知上界。MAX节点若值≥β剪; MIN节点若值≤α剪。最好排序复杂度约O(b^(d/2))。<br><span class='kw'>Expectimax</span>: <span class='kw'>随机节点取期望Σp_i</span> <span class='kw'>v_i</span>; <span class='kw'>对手非理性</span>/<span class='kw'>环境随机时用。</span><br>零和矩阵: A收益M, B收益-M。纯策略NE=双方互为best response; minimax值 v=max_p min_q p^T M q = min_q max_p p^T M q。<br>判断题陷阱: “可能有纯策略NE”是可能命题, 一个例子即可; 不是所有零和博弈都有纯策略NE。<br>MCTS四步<br>Selection: 从根按UCB/UCT选子节点。常见 UCB=Qbar+c sqrt(ln N/n); 24卷给定公式则照题。<br>Expansion: 到未完全展开节点, 新增一个动作子节点。Simulation/Rollout: 从新节点用默认策略模拟到终局。<br>Backpropagation: 沿路径更新 n←n+1, Q←(Q*n+R)/(n+1) 或累计W←W+R, Qbar=W/n。多方收益分别更新各自Q。<br>MCTS题模板: 写每层选中节点坐标→说明UCB最大→指出扩展新节点→给rollout结果→逐层更新n和对应玩家/墙的Q。<br>探索-利用: Q高偏利用, n小/不确定偏探索。不要把节点访问次数和动作价值混在一起。<br>CFG/CYK<br>CNF文法: A→BC 或 A→a。CYK表 T[i,l] 存能推出从i开始长度l子串的非终结符。<br>初始化: 对词w_i, T[i,1]={A | A→w_i}。递推: 对分割k, 若 B∈T[i,k], C∈T[i+k,l-k], 且 A→BC, 则A入T[i,l]。<br>句子可接受: S∈T[1,n]。写推理时列出能产生左右格子的规则。<br>24判断/大题均会把CFG和逻辑混考: 一定看清是CNF语法、命题CNF, 还是一阶逻辑CNF。"
      },
      {
        "q": "计算/建模模板：知识表示/FOL/KG？",
        "a": "<span class='kw'>KG</span>=语义网络: 实体-关系-实体三元组 &lt;h,r,t&gt;。图结构用于搜索、问答、推荐、推理。<br>谓词翻译: “所有A都是B” ∀x(A(x)→B(x)); “有些A是B” ∃x(A(x)∧B(x)); “A且B才C” ∀x((A∧B)→C)。<br>证明题: 列事实+规则; 用MP: P, P→Q 推Q; 用UI实例化∀; 用链式推理写到目标。<br>反例判断: 想证伪全称命题, 构造一个满足前提但结论假的个体/世界。<br>KG应用题: 先定义实体类型、关系、属性; 再给三元组; 推理规则可写成 Horn clause。<br>信息检索/相似度<br>BoW: 文档→词频向量, 忽略顺序。tf(t,d)=count或count/|d|。idf(t)=log(N/(df_t+1))或log((N+1)/(df+1))+1。<br>tf-idf=tf*idf, 高频且稀有的词权重大。余弦相似度 cos(x,y)=x·y/(||x||||y||)。<br>推荐/检索建模: query和doc同空间表示→算相似度→排序; 可加BM25/embedding重排。<br>考试注意: 分词/大小写/停用词/平滑规则题目怎么给就怎么用。<br>建模通用答题框架<br>1. 明确对象: agent/环境/状态/动作/观测/奖励/约束/数据。<br>2. 写数学形式: tuple、概率、矩阵、图、目标函数。<br>3. 写算法步骤: 初始化→循环→更新→停止。<br>4. 写边界条件: 终止状态、概率归一、维度、平滑、tie-break。<br>5. 解释现实含义: 每一项为什么合理, 失败模式是什么。"
      },
      {
        "q": "计算/建模模板：UCS/A*手算流程？",
        "a": "优先队列记录三元组(node,g,parent)。每次弹出g或f最小者; 若已closed可跳过; 松弛邻居: 新g更小才更新parent。<br>答案写: 出队顺序、每步frontier、最终路径由parent回溯、总代价。A*若h admissible且非负边权, 第一次弹出goal即最优。<br>设计启发: h=0退化<span class='kw'>UCS</span>; h越接近真实剩余代价越快; 不能高估。consistent比admissible更强, 图搜索无需reopen。<br>概率判断技巧<br>检验独立: 列联合表。例X1,X2独立硬币, U=X1+X2, V=X1-X2; 看P(U=1,V=1)与P(U=1)P(V=1)。<br>条件概率不等式: P(A|B)&gt;P(A) 等价 P(A∩B)&gt;P(A)P(B), 同时推出 P(¬A|B)&lt;P(¬A)。<br>不要把“不相关”当独立; 正态分布中特殊情况下不相关才推出独立。"
      },
      {
        "q": "计算/建模模板：SAT/CDCL作答格式？",
        "a": "隐含图节点标注变量值和decision level; 边标注触发子句。冲突后找割, 所有decision侧变量为原因, 冲突侧含⊥。<br>learned clause由割边取反得到; 回跳到使该子句只剩一个未定文字的最高层; 然后BCP。<br><span class='kw'>变量顺序</span>/<span class='kw'>True优先若题目规定,</span> <span class='kw'>不能自行改变,</span> <span class='kw'>否则隐含图不同会扣分。</span><br>逻辑/CNF小抄<br>¬∀xP=∃x¬P; ¬∃xP=∀x¬P。Skolem化: ∃在∀作用域下替换为函数f(∀变量)。<br>Horn子句: 至多一个正文字, 适合前向链式推理。事实P和规则P∧Q→R可写¬P∨¬Q∨R。"
      },
      {
        "q": "计算/建模模板：AlphaBeta记录法？",
        "a": "从左到右搜索时, 每个内部节点旁写当前(α,β)。叶值回传后更新; 满足α≥β立即剪掉剩余兄弟。<br>MAX初始化-∞, MIN初始化+∞。最后根值=最优保证收益。剪枝不改变结果, 只减少访问。<br><span class='kw'>MCTS数值更新细节</span><br>若节点保存平均Q和次数n: 新平均=(旧Q*n+R)/(n+1)。若保存累计W: W+=R, n+=1, Q=W/n。<br>多玩家树中, rollout给每个玩家一个R_i; 回传时每层只更新该层对应对象的Q_i, 题目若另有规则按题。"
      },
      {
        "q": "计算/建模模板：建模审题清单？",
        "a": "<span class='kw'>看到“随机</span>/概率”: 写全概率。看到“最优/最短”: 写目标函数。看到“交互”: 写agent和环境。看到“约束”: 写变量域和约束。<br>看到“证明/推理”: 先形式化谓词, 再列规则。看到“图/树”: 明确节点、边、权重、展开顺序。<br>计算题最后做 sanity check: 概率是否归一; 维度是否匹配; 价值是否落在合理范围。"
      },
      {
        "q": "计算/建模模板：多智能体/博弈论？",
        "a": "<span class='kw'>MAS</span>: 多个智能体在同一环境交互; 每个既行动又决策, 目标可一致、不同或冲突。关键难点: 非稳态, 因其他agent也在学习。<br>标准式博弈: 玩家N, 动作A_i, 收益u_i(a_1,...,a_n)。Best response: 给定别人策略自己收益最大。<br>占优策略: 对别人所有动作都最优。占优策略均衡: 每人都用占优策略。Nash均衡: 每人都是对别人策略的best response, 无人单独偏离获益。<br>Pareto最优: 不存在另一结果让至少一人更好且无人更差。社会福利Σu_i; 零和Σu_i=0。<br>矩阵题步骤: 圈每列A最大收益, 每行B最大收益; 双圈=纯NE; 比较所有格子找Pareto; 行/列逐项比较找占优。<br>合作博弈: characteristic function v(S)。Shapley φ_i=Σ_{S⊆N\\{i}} |S|!(n-|S|-1)!/n! [v(S∪{i})-v(S)]。表示平均边际贡献。<br>机制设计: 设计规则/支付使个体理性行为导致期望整体结果; 关注激励相容、个体理性、效率、公平。<br>MARL/Minimax-Q<br>随机博弈: 多agent版MDP, P(s’|s,a_1,...,a_n), 奖励r_i。<br>分类: fully cooperative(共享奖励), competitive/zero-sum, mixed。集中训练分散执行(CTDE)常见。<br>Minimax-Q(两人零和): Q(s,a,b)估计A在状态s执行a、对手b的收益; V(s)=max_π min_b Σ_a π(a)Q(s,a,b)。<br>更新: Q←(1-α)Q+α[r+γV(s’)]。每步需求解矩阵博弈的minimax策略。<br>非稳态陷阱: 对单个agent看, 环境转移/奖励因其他agent策略变化而变化, 普通Q-learning收敛假设被破坏。"
      },
      {
        "q": "计算/建模模板：博弈矩阵快速圈法？",
        "a": "<span class='kw'>A行、B列。固定B列圈A最大</span>; <span class='kw'>固定A行圈B最大</span>; <span class='kw'>双圈是纯NE。</span><br><span class='kw'>占优</span>: <span class='kw'>A的某行在所有列都≥另一行且至少一列&gt;</span>; B的某列在所有行都≥另一列。<br>Pareto: 比较收益二元组, 若存在另一个格子两个收益都不小且一个更大, 原格被Pareto支配。<br>混合策略2x2<br>让对手无差异求混合。若A选u概率p, B列x/y收益相等可解p; 若B选x概率q, A行u/v收益相等解q。<br>零和值可由无差异收益代回。"
      },
      {
        "q": "计算/建模模板：Shapley计算模板？",
        "a": "n=3时 φ_i=1/3![ 0!2!Δ_i(∅)+1!1!Σ_{j≠i}Δ_i({j})+2!0!Δ_i(N\\{i}) ]。<br>四公理: efficiency总和等于v(N); symmetry对称者同酬; dummy零边际者0; additivity可加。<br>边际贡献Δ_i(S)=v(S∪{i})-v(S), <span class='kw'>不是v({i})。</span><br>MARL建模句式<br>“把其他agent视为环境”会导致非稳态; 解决可用集中critic、共享参数、对手建模、自博弈。<br>合作任务奖励设计要避免credit assignment难题; 可用差分奖励/价值分解。"
      },
      {
        "q": "计算/建模模板：仿真数值/Sim2Real题？",
        "a": "<span class='kw'>显式Euler局部简单但稳定域小</span>; 刚性系统/大步长易爆。隐式Euler稳定但耗时, 会引入数值耗散。<br>Domain randomization: 训练时随机质量、摩擦、光照、纹理、延迟, 让策略学到对真实扰动鲁棒。<br>System ID: 用真实轨迹反推仿真参数, 让sim更像real。Domain adaptation: 对齐sim/real图像或特征分布。<br>仿真题回答结构: 数字孪生需要什么要素→gap在哪里→用什么方法缩小→如何评估真实迁移。<br>机器人题关键词<br>定位: 我在哪; 建图: 世界长什么样; 规划: 怎么走; 控制: 如何执行轨迹。<br>RRT适合高维连续空间但路径粗糙; A*适合离散图且有启发。PID是反馈控制, 不是规划。"
      }
    ],
    "03 机器学习、树模型与神经网络": [
      {
        "q": "辨析：机器学习？",
        "a": "精确定义/理解：<span class='kw'>系统从经验中改进性能；训练数据提供经验。</span><br>易错说法：<span class='kw'>机器学习</span>不需要人为设计任何东西。<br>纠偏判断：需要设计任务、特征/模型、损失、评价和数据流程。"
      },
      {
        "q": "辨析：监督学习？",
        "a": "精确定义/理解：<span class='kw'>训练数据含输入</span> x <span class='kw'>和标签</span> <span class='kw'>y。</span><br>易错说法：<span class='kw'>分类才是监督，回归不是。</span><br>纠偏判断：分类和回归都可监督。"
      },
      {
        "q": "辨析：无监督学习？",
        "a": "精确定义/理解：<span class='kw'>数据没有显式标签，找结构、分布或表示。</span><br>易错说法：<span class='kw'>无监督就是没有目标。</span><br>纠偏判断：目标通常是聚类、降维、密度建模等。"
      },
      {
        "q": "辨析：强化学习？",
        "a": "精确定义/理解：<span class='kw'>智能体通过与环境交互，根据奖励学习策略。</span><br>易错说法：<span class='kw'>强化学习</span>就是监督学习换个名字。<br>纠偏判断：RL 的标签不是现成给定的正确动作。"
      },
      {
        "q": "辨析：生成式 vs 判别式？",
        "a": "精确定义/理解：<span class='kw'>生成式</span>建模 <span class='kw'>p(x,y)</span> 或 p(x|y)；<span class='kw'>判别式</span>建模 <span class='kw'>p(y|x)</span> <span class='kw'>或决策边界。</span><br>易错说法：能生成文本就是生成式模型，不能生成就是判别式。<br>纠偏判断：课程语境下看概率建模对象。"
      },
      {
        "q": "辨析：训练/验证/测试？",
        "a": "精确定义/理解：<span class='kw'>训练</span>调参数；<span class='kw'>验证</span>选模型/超参；<span class='kw'>测试</span>估最终泛化。<br>易错说法：<span class='kw'>测试集可以反复调参。</span><br>纠偏判断：测试集一旦参与调参就泄漏。"
      },
      {
        "q": "辨析：过拟合？",
        "a": "精确定义/理解：<span class='kw'>训练误差低但泛化差。</span><br>易错说法：模型大就一定<span class='kw'>过拟合</span>。<br>纠偏判断：还取决于数据量、正则化、训练策略。"
      },
      {
        "q": "辨析：欠拟合？",
        "a": "精确定义/理解：<span class='kw'>模型能力或训练不足，训练和测试都差。</span><br>易错说法：<span class='kw'>测试差一定是过拟合。</span><br>纠偏判断：先看训练误差。"
      },
      {
        "q": "辨析：凸优化？",
        "a": "精确定义/理解：<span class='kw'>凸目标无坏局部极小；线性回归平方损失常是凸。</span><br>易错说法：<span class='kw'>所有机器学习目标都是凸。</span><br>纠偏判断：神经网络一般非凸。"
      },
      {
        "q": "辨析：正则化？",
        "a": "精确定义/理解：<span class='kw'>在损失中加入参数惩罚或约束，控制复杂度。</span><br>易错说法：<span class='kw'>正则化</span>一定提升训练集效果。<br>纠偏判断：常牺牲训练误差换泛化。"
      },
      {
        "q": "辨析：线性回归？",
        "a": "输出含义：<span class='kw'>f(x)=w^T</span> <span class='kw'>x+b</span> <span class='kw'>输出实数预测值。</span><br>损失/训练：<span class='kw'>平方损失；可用解析解或梯度下降。</span><br>高频陷阱：输出不是概率；分类时不能直接当概率。"
      },
      {
        "q": "辨析：平方损失？",
        "a": "输出含义：<span class='kw'>预测值与真实值差的平方平均。</span><br>损失/训练：<span class='kw'>最小化经验风险。</span><br>高频陷阱：对异常值敏感。"
      },
      {
        "q": "辨析：梯度下降？",
        "a": "输出含义：<span class='kw'>沿负梯度方向迭代更新参数。</span><br>损失/训练：<span class='kw'>学习率控制步长。</span><br>高频陷阱：学习率太大可能发散；非凸不保证全局最优。"
      },
      {
        "q": "辨析：逻辑回归？",
        "a": "输出含义：<span class='kw'>sigmoid(w^T</span> <span class='kw'>x+b)</span> <span class='kw'>表示正类概率。</span><br>损失/训练：<span class='kw'>最大似然等价于交叉熵最小化。</span><br>高频陷阱：名字叫回归，但常用于分类。"
      },
      {
        "q": "辨析：Sigmoid？",
        "a": "输出含义：<span class='kw'>把实数映射到</span> <span class='kw'>(0,1)。</span><br>损失/训练：<span class='kw'>作为二分类概率输出。</span><br>高频陷阱：不是多分类归一化；多类通常用 softmax。"
      },
      {
        "q": "辨析：Softmax？",
        "a": "输出含义：<span class='kw'>把多个</span> <span class='kw'>logits</span> <span class='kw'>归一化为类别概率分布。</span><br>损失/训练：<span class='kw'>常配交叉熵。</span><br>高频陷阱：所有 logits 同加常数，概率不变；不是独立 sigmoid。"
      },
      {
        "q": "辨析：交叉熵？",
        "a": "输出含义：<span class='kw'>衡量真实分布与预测分布差异。</span><br>损失/训练：<span class='kw'>分类常用。</span><br>高频陷阱：概率接近 0 且真实为 1 时损失巨大。"
      },
      {
        "q": "辨析：L2 正则化？",
        "a": "输出含义：<span class='kw'>惩罚参数平方范数。</span><br>损失/训练：<span class='kw'>使参数不易过大，降低过拟合风险。</span><br>高频陷阱：不是直接惩罚预测错误。"
      },
      {
        "q": "辨析：熵 Entropy？",
        "a": "正确理解：<span class='kw'>不确定性度量；越混杂越大。</span><br>易错点：<span class='kw'>熵越大分类越好。</span><br>考场判断：划分后希望子节点更纯，条件熵低。"
      },
      {
        "q": "辨析：增益率？",
        "a": "正确理解：<span class='kw'>信息增益除以固有值，缓解多值偏好。</span><br>易错点：<span class='kw'>总是比信息增益更好。</span><br>考场判断：是准则之一，不是绝对真理。"
      },
      {
        "q": "辨析：Gini 系数？",
        "a": "正确理解：<span class='kw'>类别不纯度指标；CART</span> <span class='kw'>常用。</span><br>易错点：<span class='kw'>和熵完全一样。</span><br>考场判断：都衡量不纯度，但形式不同。"
      },
      {
        "q": "辨析：随机森林？",
        "a": "正确理解：<span class='kw'>Bagging</span> <span class='kw'>多棵决策树</span> + <span class='kw'>样本</span>/<span class='kw'>特征随机性</span> + <span class='kw'>投票</span>/平均。<br>易错点：只要树多就一定不过拟合。<br>考场判断：随机性降低方差，但不是万能。"
      },
      {
        "q": "辨析：Boosting？",
        "a": "正确理解：<span class='kw'>串行关注前一轮错误样本。</span><br>易错点：<span class='kw'>和随机森林一样。</span><br>考场判断：随机森林通常并行 bagging；boosting 是逐步提升。"
      },
      {
        "q": "辨析：感知器？",
        "a": "正确理解：<span class='kw'>线性分类模型，可看作单层神经网络。</span><br>易错点：<span class='kw'>能解决</span> <span class='kw'>XOR。</span><br>考场判断：单层线性模型无法解决线性不可分。"
      },
      {
        "q": "辨析：MLP？",
        "a": "正确理解：<span class='kw'>多层全连接网络，靠非线性激活表达复杂函数。</span><br>易错点：<span class='kw'>层数越多一定越好。</span><br>考场判断：更强表达力也更难训练、更易过拟合。"
      },
      {
        "q": "辨析：ReLU？",
        "a": "正确理解：<span class='kw'>max(0,x)，简单且常用；分段线性。</span><br>易错点：<span class='kw'>只要用了</span> <span class='kw'>ReLU</span>，任何输入上都一定非线性。<br>考场判断：固定激活模式下网络整体是仿射/分段线性。"
      },
      {
        "q": "辨析：反向传播？",
        "a": "正确理解：<span class='kw'>链式法则高效计算梯度。</span><br>易错点：<span class='kw'>是某种神秘学习规则。</span><br>考场判断：优化算法仍通常是梯度下降及其变体。"
      },
      {
        "q": "辨析：梯度消失？",
        "a": "正确理解：<span class='kw'>浅层梯度非常小，难以更新。</span><br>易错点：<span class='kw'>只发生在</span> <span class='kw'>sigmoid。</span><br>考场判断：深层网络、饱和激活、长链相乘都可能导致。"
      },
      {
        "q": "辨析：Skip connection？",
        "a": "正确理解：<span class='kw'>提供梯度</span>/<span class='kw'>信息捷径，缓解退化和梯度消失。</span><br>易错点：<span class='kw'>跳连会减少模型表达能力。</span><br>考场判断：它通常改善深层网络训练。"
      },
      {
        "q": "判断并纠偏：逻辑回归常用于二分类。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：sigmoid 输出正类概率。"
      },
      {
        "q": "判断并纠偏：逻辑回归的决策边界是非线性的。？",
        "a": "判定：错/<span class='kw'>需条件</span><br>理由一句话：基础逻辑回归 f=w^Tx+b 的边界 f=0 是线性超平面。"
      },
      {
        "q": "判断并纠偏：Softmax 输出的各类概率和为 1。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：归一化指数。"
      },
      {
        "q": "判断并纠偏：随机森林通过样本扰动和特征扰动降低单棵树方差。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：bagging + feature randomness。"
      },
      {
        "q": "判断并纠偏：所有机器学习目标函数都是凸函数。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：神经网络一般非凸。"
      },
      {
        "q": "判断并纠偏：过拟合表现为训练集很好、测试/验证集较差。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：泛化差。"
      },
      {
        "q": "判断并纠偏：L2 正则化通常鼓励参数不要过大。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：惩罚平方范数。"
      },
      {
        "q": "辨析：模型参数？",
        "a": "A 的核心：<span class='kw'>训练得到的</span> <span class='kw'>w,b</span>/<span class='kw'>网络权重</span><br>概念 B：<span class='kw'>超参数</span><br>B 的核心：人为设置如学习率、树深、正则系数<br>考场切分标准：验证集通常用于选超参数。"
      },
      {
        "q": "辨析：训练误差？",
        "a": "A 的核心：<span class='kw'>训练集表现</span><br>概念 B：<span class='kw'>泛化误差</span><br>B 的核心：未见数据表现<br>考场切分标准：过拟合看二者差距。"
      },
      {
        "q": "辨析：Bagging？",
        "a": "A 的核心：<span class='kw'>并行重采样降方差</span><br>概念 B：<span class='kw'>Boosting</span><br>B 的核心：串行纠错降偏差/提升弱学习器<br>考场切分标准：随机森林属于 bagging 思想。"
      },
      {
        "q": "辨析：分类？",
        "a": "A 的核心：<span class='kw'>输出离散类别</span><br>概念 B：<span class='kw'>回归</span><br>B 的核心：输出连续数值<br>考场切分标准：逻辑回归名字易混。"
      },
      {
        "q": "辨析：回归/分类？",
        "a": "必须能回答的问题：能否说清线性<span class='kw'>回归</span>、逻辑回归、softmax <span class='kw'>的输出含义？</span>"
      },
      {
        "q": "辨析：神经网络？",
        "a": "必须能回答的问题：<span class='kw'>能否说清</span> <span class='kw'>ReLU</span> 为什么引入非线性，以及固定激活模式下为何是分段线性？"
      },
      {
        "q": "计算/建模模板：ERM与线性回归？",
        "a": "监督学习数据 D={(x_i,y_i)}。ERM: min_θ (1/n)Σ_i L(f_θ(x_i),y_i)+λΩ(θ)。<br><span class='kw'>线性模型</span>: <span class='kw'>ŷ=w^T</span> <span class='kw'>x+b。平方损失</span> <span class='kw'>J=1</span>/<span class='kw'>nΣ(ŷ_i-y_i)^2。</span><br>梯度: ∂J/∂w=2/nΣ(ŷ_i-y_i)x_i, ∂J/∂b=2/nΣ(ŷ_i-y_i)。更新 θ←θ-α∇J。<br>一维解析解: w=Σ(x_i-xbar)(y_i-ybar)/Σ(x_i-xbar)^2, b=ybar-w xbar。<br>矩阵闭式: 带偏置X~=[X,1], θ=(X~^T X~)^(-1)X~^T y, 注意不可逆时用正则或伪逆。<br>凸性: 线性+平方损失凸; 多层神经网络通常非凸, 用SGD/Adam找局部好解。<br>逻辑回归<br>二分类 y∈{0,1}: z=w^T x+b, p=σ(z)=1/(1+e^-z)。ŷ=1[p≥0.5]。决策边界 z=0 是超平面。<br>似然: L=∏ p_i^{y_i}(1-p_i)^{1-y_i}; NLL/CE= -1/nΣ[y_i log p_i+(1-y_i)log(1-p_i)]。<br>梯度: ∂CE/∂w=1/nΣ(p_i-y_i)x_i, ∂CE/∂b=1/nΣ(p_i-y_i)。<br>y∈{-1,1}: P(y|x)=σ(y(w^Tx+b)), loss=log(1+exp(-y z))。<br>判断题: sigmoid非线性, 但逻辑回归常称线性分类模型; 概率非线性, 边界线性。"
      },
      {
        "q": "计算/建模模板：Softmax/多分类？",
        "a": "<span class='kw'>logits</span> z∈R^K, p_k=exp(z_k)/Σ_j exp(z_j)。加同一常数不变; 稳定写 z←z-max(z)。<br>CE for one-hot y: L=-Σ_k y_k log p_k = -log p_true。梯度核心: ∂L/∂z = p-y。<br>softmax Jacobian: ∂p_i/∂z_j=p_i(1[i=j]-p_j)。logsoftmax l_i=z_i-logΣe^z, ∂l_i/∂z_j=1[i=j]-p_j。<br>24注意力题常用softmax算权重: e_ij=q_i·k_j, a_ij=exp(e_ij)/Σ_j exp(e_ij), z_i=Σ_j a_ij v_j。<br>交叉熵+softmax一步化简最重要: 不要手算完整Jacobian, 直接用p-y。<br>正则化/泛化<br>L2: J+λ||w||^2, 抑制大权重, 降低过拟合; 梯度多2λw。L1: 促稀疏。<br>训练/验证/测试: 用验证集调超参; 测试集只最后评估。K折交叉验证: 数据少时稳健。<br>过拟合: train低、val高; 加数据、正则、早停、dropout、降低模型复杂度。欠拟合: train/val都高; 增大模型/特征/训练。<br>分类指标: accuracy; precision=TP/(TP+FP); recall=TP/(TP+FN); F1=2PR/(P+R)。类别不平衡看P/R/AUC。"
      },
      {
        "q": "计算/建模模板：神经网络与反传？",
        "a": "<span class='kw'>Linear层</span>: z=Wx+b。若上游δ=∂L/∂z, 则 ∂L/∂W=δ x^T(单样本) 或 Δ^T X(批量), ∂L/∂b=Σδ, ∂L/∂x=W^Tδ。<br>MLP: a^(l)=g(W_l a^(l-1)+b_l)。反传就是链式法则从后往前传δ。<br>ReLU(x)=max(0,x), 导数 1[x&gt;0]。下游梯度 = 上游梯度 ⊙ 1[x&gt;0]。所有ReLU都在线性区激活=&gt;整个网络退化为仿射函数。<br>常见激活: sigmoid饱和易梯度消失; tanh零中心但仍饱和; ReLU默认好; LeakyReLU缓解dead ReLU。<br>Skip connection: y=x+F(x), 梯度有恒等通路 ∂L/∂x = ∂L/∂y( I + ∂F/∂x ), 缓解梯度消失。<br>初始化/归一化: Xavier/He按fan_in/out控制方差; BatchNorm/LayerNorm稳定分布。<br>CNN计算<br>卷积输出尺寸: H_out=floor((H+2P-K)/S)+1; W同理。参数量: K_h*K_w*C_in*C_out + C_out。<br>卷积利用局部连接+权值共享, 适合图像平移等变; pooling降采样, 增加局部不变性。<br>感受野: 多层卷积逐步扩大; stride会跳跃扩大有效步长。<br>图像分类pipeline: 图像张量→卷积/激活/池化→flatten/global average pooling→全连接→softmax。<br>判断题: 卷积核不是“识别一个固定像素位置”, 而是在整图滑动检测局部模式。"
      },
      {
        "q": "计算/建模模板：决策树？",
        "a": "熵 <span class='kw'>H(Y)=-Σ_c</span> p_c log2 p_c。条件熵 H(Y|A)=Σ_v |D_v|/|D| H(Y|A=v)。<br>信息增益 Gain(D,A)=H(Y)-H(Y|A)。增益率 GainRatio=Gain/SplitInfo, SplitInfo=-Σ_v |D_v|/|D| log2(|D_v|/|D|)。<br>Gini(D)=1-Σ_c p_c^2; 划分后Gini=Σ_v |D_v|/|D|Gini(D_v), 选最小。<br>连续属性: 对排序相邻值中点t试二分 A≤t vs A&gt;t, 选指标最好。<br>回归树: 叶子输出均值; 切分准则最小化平方误差/方差。<br>剪枝: 预剪枝(深度/样本数/增益阈值), 后剪枝(验证集)。<br>随机森林/集成<br>Bagging: bootstrap抽样训练多棵树, 分类投票/回归平均, 降方差。<br>随机森林额外做特征子采样, 让树之间低相关, 不是让每棵树“尽量相同”。<br>OOB: 未被某棵树抽中的样本可估计泛化误差。<br>Boosting: 顺序训练, 后一模型关注前一模型错误; 降偏差但更易过拟合。<br>偏差-方差: 简单模型高偏差低方差; 复杂模型低偏差高方差。集成常降方差。"
      },
      {
        "q": "计算/建模模板：线性回归手算模板？",
        "a": "给点(x_i,y_i): 先列J(w,b)=1/nΣ(wx_i+b-y_i)^2。解析解令∂J/∂w=0, ∂J/∂b=0形成二元线性方程。<br>两步GD: 每步都用当前w,b算ŷ、loss、grad, 再同时更新w,b; 不要先更新w再算b梯度。<br><span class='kw'>画回归线</span>: <span class='kw'>写y=wx+b,</span> <span class='kw'>标出斜率和截距</span>; <span class='kw'>检查线穿过(xbar,ybar)。</span><br>矩阵形状<br>X(n,d), W(d,k), b(k), logits Z=XW+1b^T(n,k), softmax按axis=1。CE梯度: dW=X^T(P-Y)/n, db=mean(P-Y)。<br>Linear+ReLU: H=ReLU(XW+b); dZ=dH⊙1[Z&gt;0]; dW=X^T dZ。"
      },
      {
        "q": "计算/建模模板：树模型算题模板？",
        "a": "根节点先算H(Y)。对每个特征A分组, 计算各组正负比例和加权熵。Gain=原熵-加权熵。<br>Gain ratio要再算SplitInfo, 不能只报Gain。Gini题要选划分后Gini最小。<br><span class='kw'>画树时每条边写特征取值,</span> <span class='kw'>叶子写多数类</span>; <span class='kw'>若平票按题目规则</span>/<span class='kw'>训练集先验。</span><br>随机森林判断<br>bootstrap样本约有63.2%独特样本入袋, 36.8% OOB。特征扰动让树差异大, 投票平均才稳。<br>RF可估计特征重要性: split impurity decrease或permutation importance。"
      },
      {
        "q": "计算/建模模板：知识图谱大题模板？",
        "a": "实体: Member, Sport, Club; 谓词: LM(x)=爱运动, G(x)=擅长游泳, R(x)=擅长攀岩, LS(x)=爱好游泳。<br><span class='kw'>“所有爱好游泳者都擅长游泳”</span>: <span class='kw'>∀x(LS(x)→G(x))。</span><br><span class='kw'>“热爱运动且擅长攀岩者都擅长游泳”</span>: <span class='kw'>∀x((LM(x)∧R(x))→G(x))。</span><br>“有些成员…”: ∃x(Member(x)∧...)。注意全称通常用→, 存在通常用∧。<br>推理证明: 事实→规则实例化→MP; 若要证明∀x(P→Q), 任取a, 假设P(a), 推Q(a), 泛化。<br>KG构建: 文本→实体识别→关系抽取→实体对齐→质量评估→图存储/查询/推理。<br>AI概览/模型类型<br>AI四象限: 类人思考/类人行为/理性思考/理性行为。现代AI常以理性行为agent视角建模。<br>判别式: 直接学P(y|x)或决策边界(LR, SVM, NN)。生成式: 学P(x,y)或P(x|y)P(y)(NB, HMM)。描述式: 聚类/密度/结构。<br>传统编程: data+program→output; ML: data+output→program/model。<br>研究品味: 看到新问题先问“监督信号是什么? 状态和动作是什么? 不确定性在哪里? 评估指标是什么?”<br>易错判断合集<br>softmax单调: z_i&gt;z_j =&gt; p_i&gt;p_j; 但不要随意与“原始分数归一化”比较。<br>随机森林扰动用于降低树间相关性, 不是让每棵树都同质化。<br>独立重复抛硬币: X1+X2 与 X1-X2 不一定独立; 可列联合分布验。<br>粒子滤波不是Kalman滤波; 适合非线性/非高斯, 用随机样本近似belief。<br>PID中I项消除稳态误差但可能引起超调/振荡; D项抑制变化但放大噪声。"
      },
      {
        "q": "计算/建模模板：相机投影计算流程？",
        "a": "1. X_w补齐为列向量。2. X_c=RX_w+t。3. 归一化x=X_c/Z_c,y=Y_c/Z_c。4. [u,v,1]^T=K[x,y,1]^T。<br><span class='kw'>若Z_c≤0表示点在相机后方,</span> <span class='kw'>投影物理上不可见</span>; <span class='kw'>计算题通常不会给这种。</span><br>三角化线性法: 对每个视图 x×(P X)=0, 堆成AX=0, SVD取最小奇异值向量。<br>CNN调参常识<br>padding=same且stride=1时输出尺寸不变。1x1卷积改通道数、混合通道, 不改变空间尺寸。<br>Data augmentation提升泛化; normalization让训练稳定。"
      }
    ],
    "04 视觉、NLP 与知识图谱": [
      {
        "q": "辨析：计算机视觉？",
        "a": "正确理解：<span class='kw'>从图像</span>/<span class='kw'>视频中获取对场景、物体、关系的理解。</span><br>常见误区：<span class='kw'>只等于图像分类。</span><br>防错句：分类、检测、分割、三维重建、行为理解都属于视觉任务。"
      },
      {
        "q": "辨析：图像分类？",
        "a": "正确理解：<span class='kw'>输入整张图像，输出类别。</span><br>常见误区：<span class='kw'>一定能定位物体。</span><br>防错句：分类不一定给位置；检测/分割才涉及位置。"
      },
      {
        "q": "辨析：卷积？",
        "a": "正确理解：<span class='kw'>局部连接、权值共享，提取空间局部模式。</span><br>常见误区：<span class='kw'>卷积</span>层参数比全连接一定多。<br>防错句：通常更少，且适合图像结构。"
      },
      {
        "q": "辨析：池化？",
        "a": "正确理解：<span class='kw'>下采样，降低空间尺寸，增加局部平移鲁棒性。</span><br>常见误区：<span class='kw'>池化</span>必然保留全部信息。<br>防错句：池化会丢失部分精细位置信息。"
      },
      {
        "q": "辨析：CNN？",
        "a": "正确理解：<span class='kw'>卷积、激活、池化</span>/<span class='kw'>归一化、全连接等组合。</span><br>常见误区：<span class='kw'>CNN</span> <span class='kw'>不需要训练。</span><br>防错句：卷积核参数也是通过训练学到的。"
      },
      {
        "q": "辨析：针孔模型？",
        "a": "正确理解：<span class='kw'>利用光沿直线传播，把三维点投影到二维平面。</span><br>常见误区：<span class='kw'>投影保持所有几何性质。</span><br>防错句：距离、角度、平行关系可能改变。"
      },
      {
        "q": "辨析：内参 K？",
        "a": "正确理解：<span class='kw'>相机内部参数，如焦距、主点、像素尺度。</span><br>常见误区：<span class='kw'>描述相机在世界中的位置。</span><br>防错句：位置姿态是外参。"
      },
      {
        "q": "辨析：外参 R,t？",
        "a": "正确理解：<span class='kw'>世界坐标到相机坐标的旋转和平移。</span><br>常见误区：<span class='kw'>描述相机焦距。</span><br>防错句：焦距属于内参。"
      },
      {
        "q": "辨析：齐次坐标？",
        "a": "正确理解：<span class='kw'>用比例等价表达投影；最后要除以第三维。</span><br>常见误区：<span class='kw'>投影后直接取前两维。</span><br>防错句：必须做归一化。"
      },
      {
        "q": "辨析：三维重建？",
        "a": "正确理解：<span class='kw'>由二维图像恢复三维结构，常需多视角几何约束。</span><br>常见误区：<span class='kw'>单张图一定能唯一恢复真实三维。</span><br>防错句：单目有尺度/深度歧义。"
      },
      {
        "q": "记住这条陷阱：三维几何判断题陷阱：“空间平行线投影后仍平行”通常是错的：透视投影中平行线可能相交于？",
        "a": "<span class='kw'>三维几何判断题陷阱</span>：“<span class='kw'>空间平行线投影后仍平行</span>”<span class='kw'>通常是错的</span>：<span class='kw'>透视投影中平行线可能相交于消失点</span>；但与像平面平行的特殊线仍可保持平行。"
      },
      {
        "q": "辨析：NLP？",
        "a": "正确理解：<span class='kw'>让机器处理、理解和生成人类语言。</span><br>易错说法：<span class='kw'>只包括聊天机器人。</span><br>纠偏：分词、句法、检索、翻译、问答、摘要都属于 <span class='kw'>NLP</span>。"
      },
      {
        "q": "辨析：CFG？",
        "a": "正确理解：<span class='kw'>上下文无关文法，用非终结符产生句子结构。</span><br>易错说法：<span class='kw'>能表达所有自然语言现象。</span><br>纠偏：自然语言更复杂，<span class='kw'>CFG</span> 是重要近似。"
      },
      {
        "q": "辨析：CNF？",
        "a": "正确理解：<span class='kw'>产生式限制成</span> <span class='kw'>A→BC</span> 或 <span class='kw'>A→word</span> <span class='kw'>等形式，便于</span> CYK。<br>易错说法：<span class='kw'>CNF</span> 改变语言本身。<br>纠偏：转换时通常保持等价语言（忽略细节约束）。"
      },
      {
        "q": "辨析：CYK？",
        "a": "正确理解：<span class='kw'>动态规划判断句子是否可由</span> <span class='kw'>CNF</span> <span class='kw'>文法生成，并可构造</span> <span class='kw'>parse</span> tree。<br>易错说法：贪心从左到右解析。<br>纠偏：<span class='kw'>CYK</span> 是区间 DP。"
      },
      {
        "q": "辨析：n-gram？",
        "a": "正确理解：<span class='kw'>用前</span> <span class='kw'>n-1</span> <span class='kw'>个词近似预测下一个词。</span><br>易错说法：<span class='kw'>完整理解全句语义。</span><br>纠偏：是局部马尔科夫假设。"
      },
      {
        "q": "辨析：BoW？",
        "a": "正确理解：<span class='kw'>把文本表示为词频</span>/<span class='kw'>词权重直方图，忽略词序。</span><br>易错说法：<span class='kw'>能表达上下文和否定关系。</span><br>纠偏：“good”和“not good”可能相近，这是 <span class='kw'>BoW</span> 局限。"
      },
      {
        "q": "辨析：Naive Bayes？",
        "a": "正确理解：<span class='kw'>假设特征在类别条件下独立，用</span> <span class='kw'>Bayes</span> <span class='kw'>做分类。</span><br>易错说法：<span class='kw'>假设所有词无条件独立。</span><br>纠偏：是条件独立：给定类别后独立。"
      },
      {
        "q": "辨析：Laplace 平滑？",
        "a": "正确理解：<span class='kw'>避免未见词概率为</span> <span class='kw'>0。</span><br>易错说法：<span class='kw'>让所有词概率相等。</span><br>纠偏：只是加伪计数。"
      },
      {
        "q": "辨析：tf-idf？",
        "a": "正确理解：<span class='kw'>词频</span> × 逆文档频率，强调在当前文档常见、在全语料不常见的词。<br>易错说法：<span class='kw'>高频词一定重要。</span><br>纠偏：停用词 tf 高但 idf 低。"
      },
      {
        "q": "辨析：one-hot？",
        "a": "正确理解：<span class='kw'>每个词一个稀疏正交向量。</span><br>易错说法：<span class='kw'>能表达语义相似。</span><br>纠偏：cat 与 dog 在 <span class='kw'>one-hot</span> 中不天然更近。"
      },
      {
        "q": "辨析：word2vec？",
        "a": "正确理解：<span class='kw'>从上下文学习稠密词向量。</span><br>易错说法：<span class='kw'>人工指定语义坐标。</span><br>纠偏：语义来自分布式假设和训练。"
      },
      {
        "q": "辨析：RNN？",
        "a": "正确理解：<span class='kw'>按时间递归处理序列，隐藏状态传递历史。</span><br>易错说法：<span class='kw'>可完全并行处理所有位置。</span><br>纠偏：序列依赖导致并行困难。"
      },
      {
        "q": "辨析：Self-Attention？",
        "a": "正确理解：<span class='kw'>同一序列内部各</span> <span class='kw'>token</span> <span class='kw'>互相计算相关性并加权汇聚。</span><br>易错说法：<span class='kw'>只看相邻词。</span><br>纠偏：可直接建模长距离依赖。"
      },
      {
        "q": "辨析：Q/K/V？",
        "a": "正确理解：<span class='kw'>Query</span> <span class='kw'>查询、Key</span> <span class='kw'>被匹配索引、Value</span> <span class='kw'>被加权汇聚的信息。</span><br>易错说法：Q/K/V <span class='kw'>是三个固定词表。</span><br>纠偏：是由输入向量线性变换得到的表示。"
      },
      {
        "q": "辨析：位置编码？",
        "a": "正确理解：给 <span class='kw'>Transformer</span> <span class='kw'>注入顺序信息。</span><br>易错说法：Transformer <span class='kw'>天然知道顺序。</span><br>纠偏：纯 self-attention 不含位置顺序。"
      },
      {
        "q": "辨析：多头注意力？",
        "a": "正确理解：<span class='kw'>多个子空间并行注意，再拼接</span>/<span class='kw'>融合。</span><br>易错说法：<span class='kw'>只是重复计算同一注意力。</span><br>纠偏：不同头可捕捉不同关系。"
      },
      {
        "q": "辨析：知识图谱 KG？",
        "a": "正确理解：<span class='kw'>用图结构建模实体及其关系，沉淀领域知识。</span><br>易错点：<span class='kw'>就是数据库表。</span><br>判断题纠偏：核心是实体-关系网络和语义关联。"
      },
      {
        "q": "辨析：实体 Entity？",
        "a": "正确理解：<span class='kw'>客观对象或抽象概念。</span><br>易错点：<span class='kw'>只能是具体物体。</span><br>判断题纠偏：人、地点、疾病、概念都可为<span class='kw'>实体</span>。"
      },
      {
        "q": "辨析：关系 Relation？",
        "a": "正确理解：<span class='kw'>实体之间的语义关联。</span><br>易错点：<span class='kw'>只是图中的无意义边。</span><br>判断题纠偏：边有语义标签。"
      },
      {
        "q": "辨析：三元组？",
        "a": "正确理解：<span class='kw'>&lt;主实体,</span> <span class='kw'>关系,</span> <span class='kw'>客实体&gt;。</span><br>易错点：<span class='kw'>三元组</span>只能表达数值属性。<br>判断题纠偏：既可表达关系，也可扩展表达属性。"
      },
      {
        "q": "辨析：语义网络？",
        "a": "正确理解：<span class='kw'>大规模带语义的图结构。</span><br>易错点：<span class='kw'>只用于搜索引擎。</span><br>判断题纠偏：可用于问答、推荐、决策分析、物联等。"
      },
      {
        "q": "辨析：知识抽取？",
        "a": "正确理解：<span class='kw'>从文本</span>/<span class='kw'>数据中抽取实体、关系、事件等。</span><br>易错点：<span class='kw'>人工手写所有知识。</span><br>判断题纠偏：自动抽取与人工校验常结合。"
      },
      {
        "q": "辨析：推理？",
        "a": "正确理解：<span class='kw'>基于已有知识推出新事实或检查一致性。</span><br>易错点：<span class='kw'>图里没有就一定不能得出。</span><br>判断题纠偏：规则、路径、逻辑可支持<span class='kw'>推理</span>。"
      },
      {
        "q": "判断并纠偏：卷积网络的权值共享适合图像局部结构。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：减少参数并捕捉局部模式。"
      },
      {
        "q": "判断并纠偏：针孔相机模型保持三维空间所有平行线在图像中仍平行。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：透视投影可产生消失点。"
      },
      {
        "q": "判断并纠偏：相机内参描述相机在世界坐标系中的位姿。？",
        "a": "<span class='kw'>判定：错</span><br>理由一句话：位姿是外参。"
      },
      {
        "q": "判断并纠偏：BoW 模型忽略词序。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：词频/权重直方图。"
      },
      {
        "q": "判断并纠偏：tf-idf 中 idf 高说明词在很多文档中都常见。？",
        "a": "判定：错<br>理由一句话：<span class='kw'>idf</span> 高表示少见，更具区分性。"
      },
      {
        "q": "判断并纠偏：Transformer 原生不含词序信息，需要位置编码等机制。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：纯 attention 对排列不敏感。"
      },
      {
        "q": "判断并纠偏：知识图谱通常以实体-关系-实体三元组表示知识。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：图结构语义网络。"
      },
      {
        "q": "辨析：内参？",
        "a": "A 的核心：<span class='kw'>相机内部成像参数</span><br>概念 B：<span class='kw'>外参</span><br>B 的核心：相机相对世界的位姿<br>考场切分标准：K vs R,t。"
      },
      {
        "q": "辨析：KG 实体？",
        "a": "A 的核心：<span class='kw'>节点对象</span><br>概念 B：<span class='kw'>KG</span> <span class='kw'>关系</span><br>B 的核心：带语义的边<br>考场切分标准：三元组缺一不可。"
      },
      {
        "q": "辨析：视觉？",
        "a": "必须能回答的问题：<span class='kw'>能否区分分类</span>/<span class='kw'>检测</span>/<span class='kw'>分割？内参</span>/<span class='kw'>外参？投影是否保持平行？</span>"
      },
      {
        "q": "辨析：KG？",
        "a": "必须能回答的问题：<span class='kw'>能否用实体-关系-实体解释知识图谱？</span>"
      },
      {
        "q": "计算/建模模板：Transformer注意力？",
        "a": "<span class='kw'>输入</span> X∈R^{n×d}; Q=XW^Q, K=XW^K, V=XW^V。单头 attention=softmax(QK^T/sqrt(d_k))V。<br>手算模板: 1算q_i,k_j,v_j; 2算e_ij=q_i·k_j(/sqrt d); 3对每行softmax; 4 z_i=Σ_j a_ij v_j。<br>多头: 不同头学不同关系, concat(heads)W^O。Self-attention捕获任意位置依赖, 并行优于RNN。<br>位置编码: 给序列顺序信息; 可学习或sin/cos。没有位置编码, self-attention本身对token顺序置换等变。<br>Add &amp; Normalize: 残差连接 x+Sublayer(x) 保梯度/保原信息; LayerNorm稳定尺度, 加快训练。<br>FFN: 每个位置独立的两层MLP, 增强非线性表示。Encoder: self-attn+FFN; Decoder: masked self-attn+cross-attn+FFN。<br>机器翻译设计: tokenization→embedding+pos→encoder→decoder自回归; 训练teacher forcing, 推理beam search。<br>RNN/序列任务<br>RNN: h_t=f(W_x x_t+W_h h_{t-1}+b), 可做one-to-many, many-to-one, many-to-many。<br>缺点: 长距离依赖难, 串行慢, 梯度消失/爆炸。LSTM/GRU用门控缓解。<br>Transformer优势: 路径短、并行、注意力可解释; 代价O(n^2)。<br>BoW/tf-idf复习<br>BoW向量可直接喂给LR/NB/SVM。缺点: 丢顺序/语义; 稀疏高维。<br>tf-idf适合关键词检索; embedding/Transformer适合语义相似。"
      },
      {
        "q": "计算/建模模板：计算机视觉与相机几何？",
        "a": "<span class='kw'>针孔模型</span>: 世界点X_w先到相机坐标 X_c=R X_w + t = (X,Y,Z)。图像: u=f_x X/Z + c_x, v=f_y Y/Z + c_y。齐次: s[u,v,1]^T = K[R|t][X_w,1]^T。<br>坐标变换陷阱: 题目若给“世界到相机”的R,t, 直接X_c=RX_w+t; 若给相机位姿(相机到世界), 需取逆 R^T(X_w-C)。<br>三维重建/三角化: 每个像素反投影成相机射线 d_w=R^T K^{-1}[u,v,1]^T; 两视图求最接近两条射线的点。<br>立体深度简式: 平行双目 depth Z=fB/disparity。视差越大越近。<br>单应/投影: 平行线在透视下可相交于消失点; 不平行于成像平面的平行线投影一般不平行。<br>CV任务: 分类what, 检测what+where, 分割pixel-level, 姿态/重建geometry。<br>三维旋转<br>基本旋转: R=R_z(α)R_y(β)R_x(γ)要看是固定轴还是当前轴; 题目给顺序就照矩阵乘法。<br>旋转矩阵性质: R^TR=I, detR=1, 逆为R^T。组合顺序不可交换。<br>外参 [R|t] 描述世界到相机时, t不是相机世界坐标C; C=-R^T t。"
      },
      {
        "q": "计算/建模模板：Transformer手算例题格式？",
        "a": "<span class='kw'>若给X中三个词向量和WQ,WK,WV</span>: 先写Q=XWQ,K=XWK,V=XWV。题目已给K,V时不要重复错乘。<br>求z1只需要第一行q1: e_1j=q1·k_j, a_1=softmax(e_1*), z1=a11v1+a12v2+a13v3。<br>若题目说“不额外加权/不scale”, 就不要除sqrt(d_k); 真实Transformer通常要scale。<br>机器翻译实用设计<br>Encoder读源句; Decoder生成目标句。Masked attention防止看未来词; Cross-attention让目标词查询源句表示。<br>训练目标: 最大化目标序列条件概率∏P(y_t|y_&lt;t,x)。推理可greedy或beam。"
      },
      {
        "q": "计算/建模模板：CYK/语法树？",
        "a": "<span class='kw'>CYK</span>表从底到顶填。若顶格含S, <span class='kw'>句子合法</span>; <span class='kw'>语法树</span>由导致S的分割和规则递归回溯。<br><span class='kw'>CNF中一元词规则只在底层用</span>; <span class='kw'>二元规则只在合并格子时用。</span><br>歧义句可能有多个S推导; 题目若要求分析树, 任选一个合法树或列出多个。<br>信息检索算分<br>余弦相似度不看向量长度, 适合tf-idf; 点积会偏向长文档。<br>若query短, 只需考虑query中非零词对doc分数的贡献。"
      },
      {
        "q": "计算/建模模板：KG/逻辑题反套路？",
        "a": "<span class='kw'>“只有A才B”=B→A</span>; <span class='kw'>“A才B”常见歧义,</span> <span class='kw'>考试按中文逻辑</span>: <span class='kw'>B的必要条件是A。</span><br><span class='kw'>“A或B”在逻辑中通常包含或</span>; 若要排他或需额外写¬(A∧B)。<br>谓词证明别把个体常量和变量混用; ∀消去后才能对具体成员使用规则。<br>LLM概览<br>LLM本质: 大规模Transformer语言模型, 预训练(next-token/denoising) + 指令微调/RLHF。<br>幻觉来自似然生成不等于事实验证; RAG用检索外部知识缓解。"
      },
      {
        "q": "计算/建模模板：机器人/控制/粒子滤波？",
        "a": "<span class='kw'>机器人</span>=实体智能体: sensor感知, effector作用真实世界; 环境常部分可观测、随机、连续状态/动作。<br>定位与地图: SLAM同时估计轨迹和地图。Bayes filter: belief bel(x_t)=η P(z_t|x_t) ∫P(x_t|u_t,x_{t-1})bel(x_{t-1})dx。<br><span class='kw'>粒子滤波</span>步骤: 预测/采样(运动模型) → 权重更新(观测似然) → 重采样。用粒子近似belief, 适合非线性非高斯。<br>规划: C-space把机器人形状变成配置点; RRT: 随机采样x_rand→找最近x_near→向其扩展x_new→碰撞检测→入树→连到goal。<br>PID: u(t)=Kp e(t)+Ki∫e(τ)dτ+Kd de/dt。P快但有稳态误差; I消除稳态误差但会超调/振荡; D预测变化抑制超调但怕噪声。<br>仿真/数字孪生/Sim2Real<br>仿真与AI: 给机器智能练习场, 用低成本快速试错。数字孪生三要素: 几何形状、物理规律、运动<span class='kw'>控制</span>策略。<br>外观仿真: 模型表达与绘制(几何、材质、光照、相机)。现象仿真: 物理模拟与数值计算(刚体/流体/弹簧)。行动仿真: 运动合成与动作控制。<br>显式Euler: x_{t+1}=x_t+h v_t, v_{t+1}=v_t+h f(x_t,v_t)/m。简单但可能能量爆炸。<br>隐式Euler: x_{t+1}=x_t+h v_{t+1}, v_{t+1}=v_t+h f(x_{t+1},v_{t+1})/m。更稳定, 常数值阻尼, 需求解方程。<br>弹簧 f=-kx-cv。回原长时注意速度符号: “速度大小”与“速度数值”可能相反, 先写更新式再比较。<br>Sim2Real gap: 仿真与真实在几何、质量/摩擦、传感器噪声、延迟、接触模型、光照纹理上不一致。<br>缩小gap: system identification校准参数; domain randomization随机化物理/视觉; domain adaptation把sim/real表征对齐; real fine-tuning少量真实数据微调。"
      }
    ],
    "05 强化学习、机器人与仿真": [
      {
        "q": "辨析：机器人？",
        "a": "正确理解：<span class='kw'>通过操纵真实世界完成任务的实体智能体。</span><br>易错说法：<span class='kw'>只要是</span> <span class='kw'>AI</span> 软件就是<span class='kw'>机器人</span>。<br>防错句：机器人强调实体、传感器、效应器和物理环境。"
      },
      {
        "q": "辨析：传感器 Sensor？",
        "a": "正确理解：<span class='kw'>感知环境或自身状态。</span><br>易错说法：<span class='kw'>传感器</span>负责行动。<br>防错句：行动由效应器完成。"
      },
      {
        "q": "辨析：效应器 Effector？",
        "a": "正确理解：<span class='kw'>轮子、腿、关节、夹具等执行动作。</span><br>易错说法：<span class='kw'>效应器</span>负责识别场景。<br>防错句：识别靠传感/算法。"
      },
      {
        "q": "辨析：定位 Localization？",
        "a": "正确理解：<span class='kw'>估计机器人自身位姿。</span><br>易错说法：<span class='kw'>等同于建图。</span><br>防错句：<span class='kw'>定位</span>问“我在哪”；建图问“环境长什么样”。"
      },
      {
        "q": "辨析：SLAM？",
        "a": "正确理解：<span class='kw'>同时定位与地图构建。</span><br>易错说法：<span class='kw'>先建完图再定位。</span><br>防错句：二者相互依赖。"
      },
      {
        "q": "辨析：路径规划？",
        "a": "正确理解：<span class='kw'>在空间中找从起点到目标的可行</span>/<span class='kw'>最优路径。</span><br>易错说法：<span class='kw'>等同于控制。</span><br>防错句：规划给路径，控制让机器人跟踪。"
      },
      {
        "q": "辨析：运动控制？",
        "a": "正确理解：<span class='kw'>把期望轨迹转为具体力</span>/<span class='kw'>速度</span>/<span class='kw'>关节命令。</span><br>易错说法：<span class='kw'>只需知道目标点即可。</span><br>防错句：受动力学、反馈和噪声影响。"
      },
      {
        "q": "辨析：PID？",
        "a": "正确理解：<span class='kw'>比例</span> <span class='kw'>P、积分</span> <span class='kw'>I、微分</span> D <span class='kw'>的反馈控制。</span><br>易错说法：I <span class='kw'>项减少扰动影响且避免振荡。</span><br>防错句：I 消除稳态误差但可能引入超调/振荡；D 抑制变化。"
      },
      {
        "q": "辨析：粒子滤波？",
        "a": "正确理解：<span class='kw'>用加权粒子表示状态分布，预测-更新-重采样。</span><br>易错说法：<span class='kw'>只适合无噪声系统。</span><br>防错句：正是处理不确定状态估计的方法。"
      },
      {
        "q": "辨析：MDP？",
        "a": "正确理解：<span class='kw'>状态</span> <span class='kw'>S、动作</span> <span class='kw'>A、转移</span> <span class='kw'>P、奖励</span> <span class='kw'>R、折扣</span> γ。满足马尔科夫性。<br>易错点：奖励只由状态决定。<br>考试纠偏：奖励可依赖 s,a,s'，看建模定义。"
      },
      {
        "q": "辨析：马尔科夫性？",
        "a": "正确理解：<span class='kw'>未来只依赖当前状态与动作，不依赖更早历史。</span><br>易错点：<span class='kw'>现实世界一定天然马尔科夫。</span><br>考试纠偏：需要选择足够充分的状态表示。"
      },
      {
        "q": "辨析：策略 π？",
        "a": "正确理解：<span class='kw'>从状态到动作或动作分布的映射。</span><br>易错点：<span class='kw'>策略</span>就是价值函数。<br>考试纠偏：策略决定怎么做；价值评价好不好。"
      },
      {
        "q": "辨析：回报 G？",
        "a": "正确理解：<span class='kw'>未来奖励折扣和。</span><br>易错点：<span class='kw'>只看当前一步奖励。</span><br>考试纠偏：G_t=r_{t+1}+γr_{t+2}+..."
      },
      {
        "q": "辨析：状态价值 Vπ(s)？",
        "a": "正确理解：<span class='kw'>从状态</span> s <span class='kw'>开始按</span> π <span class='kw'>行动的期望回报。</span><br>易错点：<span class='kw'>一个状态只有唯一价值，与策略无关。</span><br>考试纠偏：价值依赖策略；最优价值才与最优策略相关。"
      },
      {
        "q": "辨析：动作价值 Qπ(s,a)？",
        "a": "正确理解：<span class='kw'>先在</span> s <span class='kw'>执行动作</span> <span class='kw'>a，再按</span> π <span class='kw'>行动的期望回报。</span><br>易错点：Q 和 V 没关系。<br>考试纠偏：Vπ(s)=Σ_a π(a|s)<span class='kw'>Qπ(s,a)</span>。"
      },
      {
        "q": "辨析：Bellman 方程？",
        "a": "正确理解：<span class='kw'>价值的递归自洽关系。</span><br>易错点：<span class='kw'>只适用于确定环境。</span><br>考试纠偏：随机环境中对转移和动作取期望。"
      },
      {
        "q": "辨析：策略提升？",
        "a": "正确理解：<span class='kw'>基于价值贪心改进策略。</span><br>易错点：<span class='kw'>一次提升一定得到最优策略。</span><br>考试纠偏：通常需评估-提升反复进行。"
      },
      {
        "q": "辨析：Q-learning？",
        "a": "正确理解：<span class='kw'>学习最优</span> <span class='kw'>Q，常用</span> <span class='kw'>max_a'</span> <span class='kw'>Q(s',a')</span> 作为目标。<br>易错点：必须知道转移概率。<br>考试纠偏：经典 <span class='kw'>Q-learning</span> 是 model-free、off-policy。"
      },
      {
        "q": "辨析：探索 vs 利用？",
        "a": "正确理解：<span class='kw'>尝试未知动作</span> <span class='kw'>vs</span> <span class='kw'>选择当前估计最好动作。</span><br>易错点：<span class='kw'>训练时永远贪心最好。</span><br>考试纠偏：纯贪心可能陷入次优。"
      },
      {
        "q": "记住这条陷阱：RL 判断题最常见偷换：把“奖励 r”偷换成“价值 V/Q”，把“固定策略下的价值”？",
        "a": "<span class='kw'>RL</span> <span class='kw'>判断题最常见偷换</span>：把“<span class='kw'>奖励</span> r”偷换成“价值 V/Q”，把“固定策略下的价值”偷换成“最优价值”，把“一次迭代更新”偷换成“已经收敛”。看到这些词必须标出时间层：一步、本轮、收敛后。"
      },
      {
        "q": "辨析：MAS？",
        "a": "正确理解：多个智能体在同一环境交互；目标可能一致、不同或冲突。<br>易错说法：<span class='kw'>多智能体一定合作。</span><br>纠偏：也可能竞争或混合。"
      },
      {
        "q": "辨析：收益矩阵？",
        "a": "正确理解：<span class='kw'>列出各玩家策略组合下的收益。</span><br>易错说法：<span class='kw'>只看自己最大收益格子。</span><br>纠偏：均衡要考虑双方响应。"
      },
      {
        "q": "辨析：占优策略？",
        "a": "正确理解：<span class='kw'>无论对手做什么，该策略都至少不差且有时更好。</span><br>易错说法：<span class='kw'>某一格收益最高就是占优。</span><br>纠偏：要逐列/逐行比较。"
      },
      {
        "q": "辨析：占优策略均衡？",
        "a": "正确理解：<span class='kw'>各方都选择占优策略形成的组合。</span><br>易错说法：<span class='kw'>所有博弈都有。</span><br>纠偏：不一定存在。"
      },
      {
        "q": "辨析：帕累托最优？",
        "a": "正确理解：<span class='kw'>无法让某人更好而不让别人更差。</span><br>易错说法：<span class='kw'>等同纳什均衡。</span><br>纠偏：NE 可非<span class='kw'>帕累托最优</span>，如囚徒困境。"
      },
      {
        "q": "辨析：零和博弈？",
        "a": "正确理解：<span class='kw'>双方收益和为</span> <span class='kw'>0。</span><br>易错说法：<span class='kw'>零和博弈</span>一定有纯策略均衡。<br>纠偏：可能只有混合策略均衡。"
      },
      {
        "q": "辨析：混合策略？",
        "a": "正确理解：<span class='kw'>在纯策略上给概率分布。</span><br>易错说法：<span class='kw'>随机就不是理性。</span><br>纠偏：混合可使对手无差异。"
      },
      {
        "q": "辨析：合作博弈？",
        "a": "正确理解：<span class='kw'>关注联盟价值和收益分配。</span><br>易错说法：<span class='kw'>没有个体利益。</span><br>纠偏：仍要设计公平分配。"
      },
      {
        "q": "辨析：Shapley Value？",
        "a": "正确理解：<span class='kw'>按边际贡献的所有加入顺序平均来分配收益。</span><br>易错说法：<span class='kw'>按平均人数平分。</span><br>纠偏：核心是边际贡献与公平公理。"
      },
      {
        "q": "辨析：机制设计？",
        "a": "正确理解：<span class='kw'>设计规则使个体理性行为导向期望整体结果。</span><br>易错说法：<span class='kw'>直接命令每个智能体。</span><br>纠偏：通过激励约束塑造行为。"
      },
      {
        "q": "辨析：MARL 非稳态？",
        "a": "正确理解：<span class='kw'>其他智能体也在学习，使环境对单个体看起来变化。</span><br>易错说法：<span class='kw'>可直接把其他智能体当固定环境。</span><br>纠偏：这是 <span class='kw'>MARL</span> 比单智能体 RL 难的重要原因。"
      },
      {
        "q": "辨析：Minimax-Q？",
        "a": "正确理解：<span class='kw'>双人零和随机博弈中结合</span> <span class='kw'>Q-learning</span> 与 <span class='kw'>minimax。</span><br>易错说法：<span class='kw'>适用于任意合作博弈。</span><br>纠偏：核心前提是零和对抗。"
      },
      {
        "q": "辨析：仿真？",
        "a": "正确理解：用计算模型近似现实系统，用于试错、训练、预测和分析。<br>易错点：<span class='kw'>仿真</span>必须完全等于现实。<br>防错句：仿真是近似，关键是保留任务相关机制。"
      },
      {
        "q": "辨析：数字孪生？",
        "a": "正确理解：<span class='kw'>现实对象</span>/<span class='kw'>过程的数字化对应体，支持感知、建模、仿真、反馈。</span><br>易错点：<span class='kw'>就是</span> <span class='kw'>3D</span> <span class='kw'>模型。</span><br>防错句：还应含几何、物理规律、控制策略/状态同步等。"
      },
      {
        "q": "辨析：外观仿真？",
        "a": "正确理解：<span class='kw'>几何、材质、光照、渲染等视觉层模拟。</span><br>易错点：<span class='kw'>能看起来真就能真实控制。</span><br>防错句：控制还需要物理与动作仿真。"
      },
      {
        "q": "辨析：现象仿真？",
        "a": "正确理解：<span class='kw'>物理过程和数值计算，如流体、刚体、弹簧。</span><br>易错点：<span class='kw'>只要有图片就算物理仿真。</span><br>防错句：要模拟规律和演化。"
      },
      {
        "q": "辨析：行动仿真？",
        "a": "正确理解：<span class='kw'>运动合成、动作控制、角色</span>/<span class='kw'>机器人行为。</span><br>易错点：<span class='kw'>只画出轨迹即可。</span><br>防错句：还要满足运动学/动力学/控制约束。"
      },
      {
        "q": "辨析：蒙皮 Skinning？",
        "a": "正确理解：<span class='kw'>骨骼运动驱动网格顶点变形的动画技术。</span><br>易错点：<span class='kw'>改变物理规律。</span><br>防错句：主要是外观/动画表达，不等于动力学仿真。"
      },
      {
        "q": "辨析：Sim2Real Gap？",
        "a": "正确理解：<span class='kw'>仿真与真实差异导致策略迁移性能下降。</span><br>易错点：<span class='kw'>仿真越复杂就一定无</span> <span class='kw'>gap。</span><br>防错句：参数误差、感知噪声、接触/摩擦都可能造成 gap。"
      },
      {
        "q": "辨析：System Identification？",
        "a": "正确理解：<span class='kw'>从真实数据估计仿真参数，使模型更贴近现实。</span><br>易错点：<span class='kw'>随机改变所有参数。</span><br>防错句：它是定参/校准。"
      },
      {
        "q": "辨析：Domain Adaptation？",
        "a": "正确理解：<span class='kw'>调整模型</span>/<span class='kw'>表示以适应真实域。</span><br>易错点：<span class='kw'>只在视觉任务中出现。</span><br>防错句：仿真到真实的感知/控制都可用。"
      },
      {
        "q": "辨析：Domain Randomization？",
        "a": "正确理解：<span class='kw'>训练时随机化仿真参数，让策略对差异鲁棒。</span><br>易错点：<span class='kw'>寻找唯一真实参数。</span><br>防错句：它靠“见多识广”跨越 gap。"
      },
      {
        "q": "判断并纠偏：机器人通常运行在部分可观测且随机的环境中。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：真实传感和执行有噪声。"
      },
      {
        "q": "判断并纠偏：Q-learning 更新目标中使用下一状态动作价值的最大值。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：典型 off-policy max。"
      },
      {
        "q": "判断并纠偏：Domain randomization 通过随机化仿真因素增强真实迁移鲁棒性。？",
        "a": "<span class='kw'>判定：对</span><br>理由一句话：不是找唯一真实参数。"
      },
      {
        "q": "计算/建模模板：强化学习建模？",
        "a": "MDP=(S,A,P,R,γ)。Markov: 未来只依赖当前s,a。策略π(a|s)。回报 <span class='kw'>G_t=Σ_{k≥0}γ^k</span> r_{t+k+1}。<br>Vπ(s)=Eπ[G_t|s_t=s]; Qπ(s,a)=Eπ[G_t|s_t=s,a_t=a]。Vπ(s)=Σ_aπ(a|s)Qπ(s,a)。<br>Bellman期望: Vπ(s)=Σ_aπ(a|s)Σ_{s’}P(s’|s,a)[R(s,a,s’)+γVπ(s’)]。<br>Qπ(s,a)=Σ_{s’}P(s’|s,a)[R+γΣ_{a’}π(a’|s’)Qπ(s’,a’)]。<br>最优方程: V*(s)=max_aΣ_{s’}P[R+γV*(s’)]; Q*(s,a)=ΣP[R+γmax_{a’}Q*(s’,a’)]。<br>终止状态: 价值若题目固定, 直接代入; 若终止后无奖励, V(terminal)=0。注意题面“安全=100/坠毁=-100”。<br>策略评估/提升<br>Policy evaluation迭代: V_{k+1}(s)=Σ_aπ(a|s)ΣP[R+γV_k(s’)]。同步更新时所有右边用V_k。<br>Policy improvement: π_new(s)=argmax_a Qπ(s,a)。精确评估下新策略不劣于旧策略。<br>Value iteration: V_{k+1}(s)=max_aΣP[R+γV_k(s’)]。收敛后取贪心策略。<br>Q-learning: Q(s,a)←Q(s,a)+α[r+γmax_{a’}Q(s’,a’)-Q(s,a)]。off-policy, 用max不管行为策略。<br>SARSA: Q←Q+α[r+γQ(s’,a’)-Q], on-policy, 用实际下一动作a’。"
      },
      {
        "q": "计算/建模模板：RL计算题模板？",
        "a": "<span class='kw'>1.</span> 画出状态转移: 对每个(s,a)列 s’概率和即时奖励R。奖励若由“实际移动方向”决定, 先按真实落点/方向分支。<br>2. 由V算Q: Q(s,a)=Σ p_i [r_i+γV(s_i’)]。有多个结果就逐项加权。<br>3. 一步策略评估: 把π(a|s)也乘进去; 混合策略如50/50直接平均两个动作的期望。<br>4. Q-learning轨迹: 按时间顺序更新; 第二步若用到第一步刚更新的Q, 必须用新值。<br>5. ε-greedy: 以1-ε选argmax, 以ε随机; 若|A|动作, 最优动作概率通常1-ε+ε/|A|。<br>6. 折扣γ: 越接近1越重未来; γ=0只看即时奖励。<br>Stochastic grid: “0.7按指定动作, 0.3到其他邻居”需平均其他合法邻居; 不停在原地除非题目说会撞墙停。<br>MDP/建模辨析<br>状态要包含使未来独立所需信息; 若只看当前不够, 应把历史/速度/剩余燃料加入状态。<br>动作有限/连续不同: 表格Q适合小离散; 连续动作常用策略梯度/actor-critic。<br>探索vs利用: ε-greedy简单; UCB/Thompson用于bandit; RL中也需探索。<br>Model-based: 学/给定P,R后规划; Model-free: 直接学V/Q/π。"
      },
      {
        "q": "计算/建模模板：火箭/网格RL算题？",
        "a": "<span class='kw'>火箭</span>题: 状态=高度阶段+可选燃料/速度; 动作=点火/不点火; 终止=安全/坠毁。点火奖励-1, 不点火0, 终止价值按题。<br>若策略π在s1为50/50, V(s1)=0.5*Q(s1,fire)+0.5*Q(s1,no)。<br>Q-learning两段轨迹: 第1段更新Q(s0,fire)后, 第2段目标中的max Q(s1,*)不受第1段影响; 若下一状态仍s0则会用新Q。<br>策略提升证明直觉<br>若π’(s)=argmax_a Qπ(s,a), 则Vπ(s)=Σπ(a|s)Qπ(s,a)≤max_aQπ(s,a)=Qπ(s,π’(s)); 递推得Vπ’≥Vπ。"
      }
    ],
    "06 计算建模与公式模板": [
      {
        "q": "计算/建模模板：优化/反传检查？",
        "a": "链式法则: 局部导数×上游梯度。反传顺序与前向相反, 分叉处梯度相加, 合并处按各输入分别求。<br>数值梯度检查: (J(θ+ε)-J(θ-ε))/(2ε) ≈ analytic grad。调试反传最有效。<br><span class='kw'>学习率太大loss震荡</span>/<span class='kw'>NaN</span>; <span class='kw'>太小下降慢。softmax溢出一定先减max。</span><br>分类损失口径<br>MSE常用于回归; CE常用于分类。最大似然等价最小负对数似然。<br>类别标签0/1和-1/1公式不同, 先确认标签空间。多分类用one-hot或类别index。"
      }
    ]
  }
};
