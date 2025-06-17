package de.hftm.blog.service;

import de.hftm.blog.model.BlogPost;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

/**
 * BlogService - Business Logic für Blog-Posts
 * Enthält Mock-Daten und Filterfunktionen
 */
@ApplicationScoped
public class BlogService {
    
    private final Map<Long, BlogPost> blogPosts = new HashMap<>();
    
    @PostConstruct
    public void initializeData() {
        // Mock-Daten initialisieren (gleiche Daten wie im Express.js Backend)
        List<BlogPost> posts = Arrays.asList(
            new BlogPost(
                1L,
                "Angular Control Flow - Die Revolution der Templates",
                "Angular 17 führt eine neue Control Flow Syntax ein, die Templates lesbarer und performanter macht. Mit @if, @for und @switch wird die Template-Syntax deutlich vereinfacht.",
                "Mehmet Oezdag",
                "2024-01-15",
                "Angular",
                Arrays.asList("Angular", "Control Flow", "Templates"),
                true,
                "https://picsum.photos/400/250?random=1"
            ),
            new BlogPost(
                2L,
                "SCSS Best Practices für moderne Web-Entwicklung",
                "SCSS bietet mächtige Features für die Stylesheet-Entwicklung. Von Variablen über Mixins bis hin zu verschachtelten Regeln - hier sind die wichtigsten Best Practices.",
                "Mehmet Oezdag",
                "2024-01-10",
                "CSS",
                Arrays.asList("SCSS", "CSS", "Styling"),
                false,
                "https://picsum.photos/400/250?random=2"
            ),
            new BlogPost(
                3L,
                "Flexbox Layout Patterns für responsive Design",
                "Flexbox ist ein mächtiges Layout-Tool für moderne Webseiten. Diese Anleitung zeigt praktische Patterns für responsive und flexible Layouts.",
                "Mehmet Oezdag",
                "2024-01-05",
                "CSS",
                Arrays.asList("Flexbox", "Responsive", "Layout"),
                true,
                "https://picsum.photos/400/250?random=3"
            ),
            new BlogPost(
                4L,
                "TypeScript Tipps für Angular Entwickler",
                "TypeScript macht Angular-Entwicklung sicherer und produktiver. Hier sind fortgeschrittene TypeScript-Techniken speziell für Angular-Projekte.",
                "Mehmet Oezdag",
                "2023-12-28",
                "TypeScript",
                Arrays.asList("TypeScript", "Angular", "Development"),
                false,
                "https://picsum.photos/400/250?random=4"
            ),
            new BlogPost(
                5L,
                "Angular Material - UI Components richtig einsetzen",
                "Angular Material bietet eine umfangreiche Komponentenbibliothek. Diese Anleitung zeigt, wie Sie Material Design effektiv in Ihren Angular-Apps nutzen.",
                "Mehmet Oezdag",
                "2023-12-20",
                "Angular",
                Arrays.asList("Angular Material", "UI", "Components"),
                false,
                "https://picsum.photos/400/250?random=5"
            )
        );
        
        // Posts in Map speichern für schnellen Zugriff
        posts.forEach(post -> blogPosts.put(post.getId(), post));
        
        System.out.println("📝 " + blogPosts.size() + " Blog-Posts initialisiert");
    }
    
    /**
     * Gibt alle Blog-Posts zurück
     */
    public List<BlogPost> getAllPosts() {
        return new ArrayList<>(blogPosts.values());
    }
    
    /**
     * Gibt einen Blog-Post nach ID zurück
     */
    public Optional<BlogPost> getPostById(Long id) {
        return Optional.ofNullable(blogPosts.get(id));
    }
    
    /**
     * Filtert Posts nach Kategorie
     */
    public List<BlogPost> getPostsByCategory(String category) {
        return blogPosts.values().stream()
                .filter(post -> post.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
    }
    
    /**
     * Gibt nur Featured Posts zurück
     */
    public List<BlogPost> getFeaturedPosts() {
        return blogPosts.values().stream()
                .filter(BlogPost::getFeatured)
                .collect(Collectors.toList());
    }
    
    /**
     * Filtert Posts nach Kategorie und/oder Featured Status
     */
    public List<BlogPost> getFilteredPosts(String category, Boolean featured) {
        return blogPosts.values().stream()
                .filter(post -> {
                    boolean matchesCategory = category == null || 
                                            post.getCategory().equalsIgnoreCase(category);
                    boolean matchesFeatured = featured == null || 
                                            Objects.equals(post.getFeatured(), featured);
                    return matchesCategory && matchesFeatured;
                })
                .sorted((p1, p2) -> p2.getPublishDate().compareTo(p1.getPublishDate())) // Neueste zuerst
                .collect(Collectors.toList());
    }
    
    /**
     * Gibt alle verfügbaren Kategorien zurück
     */
    public List<String> getAllCategories() {
        return blogPosts.values().stream()
                .map(BlogPost::getCategory)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    /**
     * Gibt die Anzahl der Posts zurück
     */
    public long getPostCount() {
        return blogPosts.size();
    }
    
    /**
     * Gibt die Anzahl der Featured Posts zurück
     */
    public long getFeaturedPostCount() {
        return blogPosts.values().stream()
                .filter(BlogPost::getFeatured)
                .count();
    }
    
    /**
     * Gibt Posts nach Tags zurück
     */
    public List<BlogPost> getPostsByTag(String tag) {
        return blogPosts.values().stream()
                .filter(post -> post.getTags().stream()
                        .anyMatch(postTag -> postTag.equalsIgnoreCase(tag)))
                .collect(Collectors.toList());
    }
} 