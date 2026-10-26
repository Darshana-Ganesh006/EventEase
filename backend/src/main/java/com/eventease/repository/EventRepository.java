package com.eventease.repository;

import com.eventease.entity.Event;
import com.eventease.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByStatus(EventStatus status);

    List<Event> findByOrganizerId(Long organizerId);

    long countByStatus(EventStatus status);

    long countByOrganizerId(Long organizerId);

    @Query("SELECT e FROM Event e WHERE " +
           "(:category IS NULL OR :category = '' OR LOWER(e.category) = LOWER(:category)) AND " +
           "(:status IS NULL OR e.status = :status) AND " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.venue) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> searchEvents(@Param("search") String search,
                             @Param("category") String category,
                             @Param("status") EventStatus status);

    @Query("SELECT e FROM Event e WHERE e.status = 'UPCOMING' ORDER BY e.eventDate ASC, e.startTime ASC")
    List<Event> findUpcomingEvents();
}
