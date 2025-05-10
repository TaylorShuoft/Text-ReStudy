require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// MongoDB连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  // 打印当前数据库名和User集合名
  const db = mongoose.connection;
  console.log('当前数据库:', db.name);
  console.log('User模型对应集合:', User.collection.name);
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// 验证token的中间件
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: '请先登录' });
  }
};

// 注册接口
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查用户是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 创建新用户
    const user = new User({ username, password });
    await user.save();

    // 检查数据库是否真的添加了该用户
    const savedUser = await User.findOne({ username });
    if (savedUser) {
      console.log(`注册成功：用户 ${username} 已写入数据库。`);
    } else {
      console.error(`注册失败：用户 ${username} 未写入数据库。`);
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
  } catch (error) {
    console.error('注册异常：', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: '用户名或密码错误' });
    }

    // 生成JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户信息接口
app.get('/api/auth/user', auth, async (req, res) => {
  try {
    res.json({
      username: req.user.username,
      createdAt: req.user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 聊天池：获取全部消息
app.get('/api/messages', auth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 }).limit(200);
    console.log('聊天池消息：', messages);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

// 聊天池：发送消息
app.post('/api/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: '消息内容不能为空' });
    }
    const message = await Message.create({
      userId: req.user._id,
      nickname: req.user.username,
      text,
      timestamp: new Date()
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: '服务器错误' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 