package com.eventease.repository;

import com.eventease.entity.Registration;
import com.eventease.entity.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {

    List<Registration> findByStudentIdOrderByRegistrationDateDesc(Long studentId);

    List<Registration> findByEventIdOrderByRegistrationDateAsc(Long eventId);

    Optional<Registration> findByStudentIdAndEventIdAndStatus(Long studentId, Long eventId, RegistrationStatus status);

    boolean existsByStudentIdAndEventIdAndStatus(Long studentId, Long eventId, RegistrationStatus status);

    long countByEventIdAndStatus(Long eventId, RegistrationStatus status);

    long countByStatus(RegistrationStatus status);

    long countByStudentIdAndStatus(Long studentId, RegistrationStatus status);

    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.organizer.id = :organizerId AND r.status = 'CONFIRMED'")
    long countRegistrationsByOrganizerId(@Param("organizerId") Long organizerId);

    @Query("SELECT r FROM Registration r WHERE r.event.organizer.id = :organizerId ORDER BY r.registrationDate DESC")
    List<Registration> findRegistrationsByOrganizerId(@Param("organizerId") Long organizerId);
}
