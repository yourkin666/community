package com.community.service;

import com.community.dto.LoginRequest;
import com.community.dto.RegisterRequest;
import com.community.entity.User;
import com.community.mapper.UserMapper;
import com.community.utils.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 用户服务类
 * 
 * @author Community Team
 * @version 1.0
 */
@Service
public class UserService {
    
    @Autowired
    private UserMapper userMapper;
    
    /**
     * 用户注册
     * 
     * @param request 注册请求
     * @return 注册结果
     */
    public User register(RegisterRequest request) {
        // 检查用户名是否已存在
        if (userMapper.findByUsername(request.getUsername()) != null) {
            throw new RuntimeException("用户名已存在");
        }
        
        // 检查邮箱是否已存在
        if (userMapper.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("邮箱已被注册");
        }
        
        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(PasswordUtil.encryptPassword(request.getPassword()));
        user.setBio(request.getBio());
        
        // 保存用户
        int result = userMapper.insert(user);
        if (result > 0) {
            // 返回用户信息（不包含密码）
            return userMapper.findById(user.getId());
        } else {
            throw new RuntimeException("注册失败");
        }
    }
    
    /**
     * 用户登录
     * 
     * @param request 登录请求
     * @return 用户信息
     */
    public User login(LoginRequest request) {
        // 根据用户名查找用户
        User user = userMapper.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        // 验证密码
        if (!PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        return user;
    }
    
    /**
     * 根据ID查询用户
     * 
     * @param id 用户ID
     * @return 用户信息
     */
    public User findById(Long id) {
        return userMapper.findById(id);
    }
    
    /**
     * 根据用户名查询用户
     * 
     * @param username 用户名
     * @return 用户信息
     */
    public User findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
    
    /**
     * 更新用户信息
     * 
     * @param user 用户信息
     * @return 更新结果
     */
    public boolean updateUser(User user) {
        return userMapper.update(user) > 0;
    }
}
