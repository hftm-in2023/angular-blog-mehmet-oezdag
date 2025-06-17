package de.hftm.blog.resource;

import de.hftm.blog.model.BlogPost;
import de.hftm.blog.service.BlogService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.logging.Logger;

import java.util.List;
import java.util.Optional;

/**
 * BlogResource - REST API für Blog-Posts
 * Entspricht den Express.js Endpoints
 */
@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Tag(name = "Blog API", description = "REST API für Angular Blog - Mehmet Oezdag")
public class BlogResource {
    
    private static final Logger LOG = Logger.getLogger(BlogResource.class);
    
    @Inject
    BlogService blogService;
    
    /**
     * GET /api/posts - Alle Blog-Posts oder gefilterte Posts
     */
    @GET
    @Path("/posts")
    @Operation(
        summary = "Blog-Posts abrufen",
        description = "Lädt alle Blog-Posts oder filtert nach Kategorie und/oder Featured Status"
    )
    @APIResponse(
        responseCode = "200",
        description = "Liste der Blog-Posts",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPost.class))
    )
    public Response getPosts(
            @Parameter(description = "Filtert nach Kategorie") @QueryParam("category") String category,
            @Parameter(description = "Filtert Featured Posts (true/false)") @QueryParam("featured") String featured
    ) {
        try {
            LOG.infof("GET /api/posts - category: %s, featured: %s", category, featured);
            
            Boolean featuredBoolean = null;
            if (featured != null && !featured.isEmpty()) {
                featuredBoolean = Boolean.parseBoolean(featured);
            }
            
            List<BlogPost> posts = blogService.getFilteredPosts(category, featuredBoolean);
            
            LOG.infof("Returning %d blog posts", posts.size());
            return Response.ok(posts).build();
            
        } catch (Exception e) {
            LOG.error("Error retrieving blog posts", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving blog posts: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * GET /api/posts/{id} - Einzelner Blog-Post nach ID
     */
    @GET
    @Path("/posts/{id}")
    @Operation(
        summary = "Blog-Post nach ID abrufen",
        description = "Lädt einen einzelnen Blog-Post anhand der ID"
    )
    @APIResponse(
        responseCode = "200",
        description = "Blog-Post gefunden",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPost.class))
    )
    @APIResponse(responseCode = "404", description = "Blog-Post nicht gefunden")
    public Response getPostById(
            @Parameter(description = "Blog-Post ID") @PathParam("id") Long id
    ) {
        try {
            LOG.infof("GET /api/posts/%d", id);
            
            Optional<BlogPost> post = blogService.getPostById(id);
            
            if (post.isPresent()) {
                LOG.infof("Blog post found: %s", post.get().getTitle());
                return Response.ok(post.get()).build();
            } else {
                LOG.warnf("Blog post with ID %d not found", id);
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("{\"error\": \"Post not found\"}")
                        .build();
            }
            
        } catch (Exception e) {
            LOG.error("Error retrieving blog post by ID: " + id, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving blog post: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * GET /api/categories - Alle verfügbaren Kategorien
     */
    @GET
    @Path("/categories")
    @Operation(
        summary = "Kategorien abrufen",
        description = "Lädt alle verfügbaren Blog-Kategorien"
    )
    @APIResponse(
        responseCode = "200",
        description = "Liste der Kategorien",
        content = @Content(mediaType = "application/json")
    )
    public Response getCategories() {
        try {
            LOG.info("GET /api/categories");
            
            List<String> categories = blogService.getAllCategories();
            
            LOG.infof("Returning %d categories", categories.size());
            return Response.ok(categories).build();
            
        } catch (Exception e) {
            LOG.error("Error retrieving categories", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving categories: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * GET /api/posts/featured - Nur Featured Posts
     */
    @GET
    @Path("/posts/featured")
    @Operation(
        summary = "Featured Posts abrufen",
        description = "Lädt nur die als Featured markierten Blog-Posts"
    )
    @APIResponse(
        responseCode = "200",
        description = "Liste der Featured Posts",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPost.class))
    )
    public Response getFeaturedPosts() {
        try {
            LOG.info("GET /api/posts/featured");
            
            List<BlogPost> featuredPosts = blogService.getFeaturedPosts();
            
            LOG.infof("Returning %d featured posts", featuredPosts.size());
            return Response.ok(featuredPosts).build();
            
        } catch (Exception e) {
            LOG.error("Error retrieving featured posts", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving featured posts: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * GET /api/posts/category/{category} - Posts nach Kategorie
     */
    @GET
    @Path("/posts/category/{category}")
    @Operation(
        summary = "Posts nach Kategorie abrufen",
        description = "Lädt alle Blog-Posts einer bestimmten Kategorie"
    )
    @APIResponse(
        responseCode = "200",
        description = "Liste der Posts in der Kategorie",
        content = @Content(mediaType = "application/json", schema = @Schema(implementation = BlogPost.class))
    )
    public Response getPostsByCategory(
            @Parameter(description = "Kategorie-Name") @PathParam("category") String category
    ) {
        try {
            LOG.infof("GET /api/posts/category/%s", category);
            
            List<BlogPost> posts = blogService.getPostsByCategory(category);
            
            LOG.infof("Returning %d posts for category: %s", posts.size(), category);
            return Response.ok(posts).build();
            
        } catch (Exception e) {
            LOG.error("Error retrieving posts by category: " + category, e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving posts by category: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * GET /api/stats - Blog-Statistiken
     */
    @GET
    @Path("/stats")
    @Operation(
        summary = "Blog-Statistiken abrufen",
        description = "Lädt Statistiken über die Blog-Posts"
    )
    @APIResponse(responseCode = "200", description = "Blog-Statistiken")
    public Response getStats() {
        try {
            LOG.info("GET /api/stats");
            
            var stats = new java.util.HashMap<String, Object>();
            stats.put("totalPosts", blogService.getPostCount());
            stats.put("featuredPosts", blogService.getFeaturedPostCount());
            stats.put("categories", blogService.getAllCategories().size());
            
            return Response.ok(stats).build();
            
        } catch (Exception e) {
            LOG.error("Error retrieving stats", e);
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error retrieving stats: " + e.getMessage())
                    .build();
        }
    }
} 