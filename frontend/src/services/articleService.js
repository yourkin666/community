import api from './api';

export const articleService = {
  // 获取所有已发布的文章
  getPublishedArticles: () => {
    return api.get('/articles');
  },

  // 根据ID获取文章详情
  getArticleById: (id) => {
    return api.get(`/articles/${id}`);
  },

  // 获取当前用户的文章
  getMyArticles: () => {
    return api.get('/articles/my');
  },

  // 根据作者ID获取文章
  getArticlesByAuthor: (authorId) => {
    return api.get(`/articles/author/${authorId}`);
  },

  // 发布文章
  createArticle: (articleData) => {
    return api.post('/articles', articleData);
  },

  // 更新文章
  updateArticle: (id, articleData) => {
    return api.put(`/articles/${id}`, articleData);
  },

  // 删除文章
  deleteArticle: (id) => {
    return api.delete(`/articles/${id}`);
  }
};
