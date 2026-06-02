package com.cloud.cloudoptimizer.service;

import com.cloud.cloudoptimizer.model.Resource;
import com.cloud.cloudoptimizer.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Resource saveResource(Resource resource) {

        if (resource.getCpu() > 75) {
            resource.setStatus("HIGH");
        } else {
            resource.setStatus("NORMAL");
        }

        if (resource.getCpu() > 90) {
            resource.setRecommendation("Scale Up Resources");
        } else if (resource.getCpu() < 30) {
            resource.setRecommendation("Reduce Resources");
        } else {
            resource.setRecommendation("Stable");
        }

        return repository.save(resource);
    }

    public void deleteResource(Long id) {
        repository.deleteById(id);
    }
}