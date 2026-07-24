package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/*return value is the actual response body itself, whatever the return value gets sent directly to the browser itself */
@RestController
public class i2iController {
    @GetMapping("/hello_api")
    public String helloApi(){
        return "Welcome to i2i Academy";
    }
}
