package com.community.controller;

import com.community.dto.ApiResponse;
import com.community.dto.LoginRequest;
import com.community.dto.RegisterRequest;
import com.community.entity.User;
import com.community.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

/**
 * 用户控制器
 * 
 * @author Community Team
 * @version 1.0
 */
@RestController
@RequestMapping("/users")
@Validated
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ApiResponse<User> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            return ApiResponse.success("注册成功", user);
        } catch (Exception e) {
            return ApiResponse.badRequest(e.getMessage());
        }
    }
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ApiResponse<User> login(@Valid @RequestBody LoginRequest request, HttpSession session) {
        try {
            User user = userService.login(request);
            // 将用户信息存储到session中
            session.setAttribute("userId", user.getId());
            session.setAttribute("username", user.getUsername());
            return ApiResponse.success("登录成功", user);
        } catch (Exception e) {
            return ApiResponse.badRequest(e.getMessage());
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpSession session) {
        session.invalidate();
        return ApiResponse.success("登出成功", null);
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/current")
    public ApiResponse<User> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        User user = userService.findById(userId);
        if (user == null) {
            return ApiResponse.unauthorized("用户不存在");
        }
        
        return ApiResponse.success(user);
    }
    
    /**
     * 更新用户信息
     */
    @PutMapping("/profile")
    public ApiResponse<User> updateProfile(@RequestBody User userUpdate, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ApiResponse.unauthorized("请先登录");
        }
        
        try {
            // 只允许更新特定字段
            User existingUser = userService.findById(userId);
            if (existingUser == null) {
                return ApiResponse.unauthorized("用户不存在");
            }
            
            existingUser.setAvatar(userUpdate.getAvatar());
            existingUser.setBio(userUpdate.getBio());
            
            boolean success = userService.updateUser(existingUser);
            if (success) {
                User updatedUser = userService.findById(userId);
                return ApiResponse.success("更新成功", updatedUser);
            } else {
                return ApiResponse.error("更新失败");
            }
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    /**
     * 根据用户名查询用户
     */
    @GetMapping("/{username}")
    public ApiResponse<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user == null) {
            return ApiResponse.notFound("用户不存在");
        }
        return ApiResponse.success(user);
    }
}
