package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/*return vale is treated as a view name which means just a string and hands it to the template engşne 
which calls for html file */
@Controller
public class SimpleController {
    @Value("${spring.application.name}")
    private String appName;

    @RequestMapping("/")
    public String homePage(Model model){
        model.addAttribute("appName", appName);
        return "home";
    }
}
