package com.community.service;

import com.community.entity.Article;
import com.community.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 文章服务类
 * 
 * @author Community Team
 * @version 1.0
 */
@Service
public class ArticleService {
    
    @Autowired
    private ArticleMapper articleMapper;
    
    /**
     * 发布文章
     * 
     * @param article 文章信息
     * @return 发布结果
     */
    public Article publishArticle(Article article) {
        // 如果没有设置摘要，自动生成
        if (article.getSummary() == null || article.getSummary().trim().isEmpty()) {
            String content = article.getContent();
            if (content.length() > 100) {
                article.setSummary(content.substring(0, 100) + "...");
            } else {
                article.setSummary(content);
            }
        }
        
        // 设置默认状态和浏览次数
        if (article.getStatus() == null) {
            article.setStatus("DRAFT");
        }
        if (article.getViewCount() == null) {
            article.setViewCount(0);
        }
        
        // 保存文章
        int result = articleMapper.insert(article);
        if (result > 0) {
            return articleMapper.findById(article.getId());
        } else {
            throw new RuntimeException("发布文章失败");
        }
    }
    
    /**
     * 更新文章
     * 
     * @param article 文章信息
     * @return 更新结果
     */
    public Article updateArticle(Article article) {
        // 如果没有设置摘要，自动生成
        if (article.getSummary() == null || article.getSummary().trim().isEmpty()) {
            String content = article.getContent();
            if (content.length() > 100) {
                article.setSummary(content.substring(0, 100) + "...");
            } else {
                article.setSummary(content);
            }
        }
        
        int result = articleMapper.update(article);
        if (result > 0) {
            return articleMapper.findById(article.getId());
        } else {
            throw new RuntimeException("更新文章失败");
        }
    }
    
    /**
     * 根据ID查询文章
     * 
     * @param id 文章ID
     * @return 文章信息
     */
    public Article findById(Long id) {
        return articleMapper.findById(id);
    }
    
    /**
     * 查询所有已发布的文章
     * 
     * @return 文章列表
     */
    public List<Article> findPublishedArticles() {
        return articleMapper.findPublishedArticles();
    }
    
    /**
     * 根据作者ID查询文章
     * 
     * @param authorId 作者ID
     * @return 文章列表
     */
    public List<Article> findByAuthorId(Long authorId) {
        return articleMapper.findByAuthorId(authorId);
    }
    
    /**
     * 删除文章
     * 
     * @param id 文章ID
     * @param authorId 作者ID（用于权限检查）
     * @return 删除结果
     */
    public boolean deleteArticle(Long id, Long authorId) {
        // 检查文章是否存在且属于该作者
        Article article = articleMapper.findById(id);
        if (article == null) {
            throw new RuntimeException("文章不存在");
        }
        if (!article.getAuthorId().equals(authorId)) {
            throw new RuntimeException("无权限删除该文章");
        }
        
        return articleMapper.deleteById(id) > 0;
    }
    
    /**
     * 增加文章浏览次数
     * 
     * @param id 文章ID
     */
    public void incrementViewCount(Long id) {
        articleMapper.incrementViewCount(id);
    }
}
