package com.cloud.cloudoptimizer.controller;

import com.cloud.cloudoptimizer.model.Resource;
import com.cloud.cloudoptimizer.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
@CrossOrigin("*")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @GetMapping
    public List<Resource> getAllResources() {
        return service.getAllResources();
    }

    @PostMapping
    public Resource save(@RequestBody Resource resource) {
        return service.saveResource(resource);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteResource(id);
    }
}