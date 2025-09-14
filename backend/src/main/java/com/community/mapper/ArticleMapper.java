package com.community.mapper;

import com.community.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 文章数据访问层
 * 
 * @author Community Team
 * @version 1.0
 */
@Mapper
public interface ArticleMapper {
    
    /**
     * 根据ID查询文章
     * 
     * @param id 文章ID
     * @return 文章信息
     */
    Article findById(@Param("id") Long id);
    
    /**
     * 查询所有已发布的文章
     * 
     * @return 文章列表
     */
    List<Article> findPublishedArticles();
    
    /**
     * 根据作者ID查询文章
     * 
     * @param authorId 作者ID
     * @return 文章列表
     */
    List<Article> findByAuthorId(@Param("authorId") Long authorId);
    
    /**
     * 根据状态查询文章
     * 
     * @param status 文章状态
     * @return 文章列表
     */
    List<Article> findByStatus(@Param("status") String status);
    
    /**
     * 插入新文章
     * 
     * @param article 文章信息
     * @return 影响行数
     */
    int insert(Article article);
    
    /**
     * 更新文章信息
     * 
     * @param article 文章信息
     * @return 影响行数
     */
    int update(Article article);
    
    /**
     * 删除文章
     * 
     * @param id 文章ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Long id);
    
    /**
     * 增加文章浏览次数
     * 
     * @param id 文章ID
     * @return 影响行数
     */
    int incrementViewCount(@Param("id") Long id);
}
