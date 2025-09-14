package com.community.controller;

import com.community.dto.ApiResponse;
import com.community.entity.Article;
import com.community.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;

/**
 * 文章控制器
 * 
 * @author Community Team
 * @version 1.0
 */
@RestController
@RequestMapping("/articles")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ArticleController {
    
    @Autowired
    private ArticleService articleService;
    
    /**
     * 发布文章
     */
    @PostMapping
    public ApiResponse<Article> publishArticle(@RequestBody Article article, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        try {
            article.setAuthorId(userId);
            Article publishedArticle = articleService.publishArticle(article);
            return ApiResponse.success("发布成功", publishedArticle);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 更新文章
     */
    @PutMapping("/{id}")
    public ApiResponse<Article> updateArticle(@PathVariable Long id, @RequestBody Article article, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        try {
            // 检查文章是否存在且属于当前用户
            Article existingArticle = articleService.findById(id);
            if (existingArticle == null) {
                return ApiResponse.notFound("文章不存在");
            }
            if (!existingArticle.getAuthorId().equals(userId)) {
                return ApiResponse.forbidden("无权限修改该文章");
            }
            
            article.setId(id);
            article.setAuthorId(userId);
            Article updatedArticle = articleService.updateArticle(article);
            return ApiResponse.success("更新成功", updatedArticle);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 删除文章
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteArticle(@PathVariable Long id, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        try {
            boolean success = articleService.deleteArticle(id, userId);
            if (success) {
                return ApiResponse.success("删除成功", null);
            } else {
                return ApiResponse.error("删除失败");
            }
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 获取文章详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Article> getArticle(@PathVariable Long id) {
        Article article = articleService.findById(id);
        if (article == null) {
            return ApiResponse.notFound("文章不存在");
        }
        
        // 增加浏览次数
        articleService.incrementViewCount(id);
        
        return ApiResponse.success(article);
    }
    
    /**
     * 获取所有已发布的文章
     */
    @GetMapping
    public ApiResponse<List<Article>> getPublishedArticles() {
        List<Article> articles = articleService.findPublishedArticles();
        return ApiResponse.success(articles);
    }
    
    /**
     * 获取当前用户的文章
     */
    @GetMapping("/my")
    public ApiResponse<List<Article>> getMyArticles(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        List<Article> articles = articleService.findByAuthorId(userId);
        return ApiResponse.success(articles);
    }
    
    /**
     * 根据作者获取文章
     */
    @GetMapping("/author/{authorId}")
    public ApiResponse<List<Article>> getArticlesByAuthor(@PathVariable Long authorId) {
        List<Article> articles = articleService.findByAuthorId(authorId);
        return ApiResponse.success(articles);
    }
}
