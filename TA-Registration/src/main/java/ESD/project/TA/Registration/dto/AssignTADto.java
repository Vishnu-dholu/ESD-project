package ESD.project.TA.Registration.dto;

import lombok.Data;

@Data
public class AssignTADto {
    private Long courseId;
    private String studentEmail;
    private String studentName;

    // add these for reassignment support
    private Long assignmentId;
    private Long targetCourseId;
}
