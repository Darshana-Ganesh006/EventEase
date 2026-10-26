package com.eventease.repository;

import com.eventease.entity.Attendance;
import com.eventease.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByEventId(Long eventId);

    Optional<Attendance> findByRegistrationId(Long registrationId);

    long countByEventIdAndAttendanceStatus(Long eventId, AttendanceStatus status);

    long countByAttendanceStatus(AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.registration.student.id = :studentId AND a.attendanceStatus = 'PRESENT'")
    long countAttendedByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.event.organizer.id = :organizerId AND a.attendanceStatus = 'PRESENT'")
    long countPresentByOrganizerId(@Param("organizerId") Long organizerId);
}
