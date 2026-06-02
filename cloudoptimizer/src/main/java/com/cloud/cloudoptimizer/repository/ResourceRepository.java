package com.cloud.cloudoptimizer.repository;

import com.cloud.cloudoptimizer.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
}