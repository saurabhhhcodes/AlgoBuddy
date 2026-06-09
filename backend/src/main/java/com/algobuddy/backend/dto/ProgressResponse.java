package com.algobuddy.backend.dto;

import lombok.Data;
import lombok.Builder;

import java.util.Map;

@Data
@Builder
public class ProgressResponse {
    private Map<String, String> progress;
    private Integer currentStreak;
    private Integer longestStreak;
    private Integer visualizedCount;
    private Integer dailySolved;
    private Integer weeklySolved;
    private Integer monthlySolved;
}
