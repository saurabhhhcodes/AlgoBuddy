package com.algobuddy.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkDto {
    private String problemId;
    private String topicSlug;
    private LocalDateTime createdAt;
}
