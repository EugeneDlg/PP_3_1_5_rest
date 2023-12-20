package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static java.lang.Integer.max;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder bCryptPasswordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<User> getByIdForUpdate(Long id) {
        Optional<User> user = getById(id);
        if (user.isEmpty()) {
            return user;
        }
        user.get().setPassword("");
        return user;
    }

    @Override
    @Transactional(readOnly = true)
    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void addUser(User user) {
        if (getByUsername(user.getUsername()).isPresent()) {
            return;
        }
        user.setUsername(user.getUsername().strip());
        user.setEmail(user.getEmail().strip());
        user.setAge(max(0, user.getAge()));
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        user.ifPresent(userRepository::delete);
    }

    @Override
    @Transactional
    public void updateUser(Long id, User newUser) {
        User user = userRepository.findById(id).orElse(null);
        User userSaved = userRepository.findByUsername(newUser.getUsername()).orElse(null);
        if (user != null && (userSaved == null || userSaved != null && id.equals(userSaved.getId()))) {
            user.setUsername(newUser.getUsername().strip());
            user.setPassword(bCryptPasswordEncoder.encode(newUser.getPassword()));
            user.setEmail(newUser.getEmail().strip());
            user.setAge(max(0, newUser.getAge()));
            user.setRoles(newUser.getRoles());
            userRepository.save(user);
        }
    }
}
