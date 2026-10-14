# Backend Rules — Clothing Store

## 1. Architecture

Backend uses:

**Layered Architecture + Feature-based Package Structure**

Standard request flow:

Client / React
→ Controller
→ DTO + Validation
→ Service
→ Repository
→ Database

Mapping flow:

Entity ↔ Mapper ↔ DTO

Supporting modules:

- Security
- Exception
- Cloudinary
- Config

---

## 2. Package Structure

Use feature-based packages.

```text
com.example.backend
│
├── auth
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── mapper
│
├── products
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── mapper
│
├── variants
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── mapper
│
├── categories
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   └── mapper
│
├── colors
├── sizes
├── cloudinary
├── security
├── exception
└── config
```

Each feature is responsible for its own domain logic.

---

## 3. Controller Rules

Controller is responsible only for:

- HTTP request/response
- Receiving DTO
- Validation trigger
- Calling Service
- Returning HTTP response

### Controller must NOT contain business logic.

Bad:

```java
@GetMapping
public List<ProductResponse> getProducts() {
    List<Product> products = repository.findAll();

    return products.stream()
            .filter(product -> product.getStatus().equals("ACTIVE"))
            .map(...)
            .toList();
}
```

Good:

```java
@GetMapping
public ResponseEntity<List<ProductResponse>> getProducts() {
    return ResponseEntity.ok(productService.getAllProducts());
}
```

---

## 4. Service Rules

Service is the main place for business logic.

Responsibilities:

- Business validation
- Checking resource existence
- Checking relationships
- Executing business rules
- Coordinating repositories
- Coordinating external services
- Mapping data when appropriate

Example:

```java
@Override
public ProductResponse createProduct(ProductRequest request) {

    Category category = categoryRepository
            .findById(request.getCategoryId())
            .orElseThrow(() ->
                    new ResourceNotFoundException("Category not found")
            );

    Product product = productMapper.toEntity(request);
    product.setCategory(category);

    Product savedProduct = productRepository.save(product);

    return productMapper.toResponse(savedProduct);
}
```

---

## 5. Repository Rules

Repository is responsible only for database access.

Example:

```java
public interface ProductRepository
        extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);

    boolean existsBySlug(String slug);
}
```

Repository must NOT contain business logic.

Allowed responsibilities:

- find
- save
- delete
- exists
- count
- database queries

---

## 6. Entity Rules

Entity represents database tables and relationships.

Example:

```java
@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String slug;
}
```

Entity responsibilities:

- Database mapping
- JPA annotations
- Relationships
- Persistence configuration

Do NOT expose Entity directly through REST APIs.

Bad:

```java
@GetMapping("/{id}")
public Product getProduct(@PathVariable Long id) {
    ...
}
```

Good:

```java
@GetMapping("/{id}")
public ProductResponse getProduct(@PathVariable Long id) {
    ...
}
```

---

## 7. DTO Rules

DTO is the API contract.

Separate:

- Request DTO
- Response DTO

Example:

```java
public class ProductRequest {

    @NotBlank
    private String name;

    @NotNull
    private Long categoryId;
}
```

Response:

```java
public class ProductResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String categoryName;
}
```

Do not use Entity as request/response DTO.

---

## 8. Validation Rules

### Input validation

Use Bean Validation annotations in Request DTO:

```java
@NotBlank
@NotNull
@Size
@Min
@Max
@Email
```

Controller:

```java
@PostMapping
public ProductResponse create(
        @Valid @RequestBody ProductRequest request
) {
    ...
}
```

### Business validation

Business validation belongs in Service.

Examples:

- Category exists
- Product exists
- SKU already exists
- Variant combination already exists
- Quantity is sufficient
- Product status allows the operation

---

## 9. MapStruct Rules

Use MapStruct for Entity ↔ DTO mapping.

Example:

```java
@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductResponse toResponse(Product product);

    Product toEntity(ProductRequest request);
}
```

Do not manually write simple mapping repeatedly in Service:

```java
response.setId(product.getId());
response.setName(product.getName());
response.setSlug(product.getSlug());
```

MapStruct should handle simple field mapping.

---

## 10. Lombok Rules

Use Lombok to reduce boilerplate.

Recommended:

```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
```

For services:

```java
@RequiredArgsConstructor
```

Example:

```java
@Service
@RequiredArgsConstructor
public class ProductServiceImpl {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
}
```

Avoid using `@Data` blindly on JPA Entities, especially Entities with relationships, because generated `equals()`, `hashCode()` and `toString()` can cause problems.

---

## 11. Dependency Injection Rules

Use Constructor Injection.

Recommended:

```java
@RequiredArgsConstructor
@Service
public class ProductServiceImpl {

    private final ProductRepository productRepository;
}
```

Avoid field injection:

```java
@Autowired
private ProductRepository productRepository;
```

---

## 12. Exception Rules

Use centralized exception handling.

Structure:

```text
exception
├── GlobalExceptionHandler
├── ResourceNotFoundException
├── BadRequestException
└── ErrorResponse
```

Service:

```java
Product product = productRepository
        .findById(id)
        .orElseThrow(() ->
                new ResourceNotFoundException("Product not found")
        );
```

Use:

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
}
```

API errors should have a consistent structure.

Example:

```json
{
  "status": 404,
  "message": "Product not found",
  "timestamp": "2026-09-08T17:00:00"
}
```

---

## 13. API Rules

Follow REST conventions.

### Product

```text
GET    /api/products
GET    /api/products/{id}

POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
```

### Variant

```text
GET    /api/products/{productId}/variants
POST   /api/products/{productId}/variants

PUT    /api/variants/{variantId}
DELETE /api/variants/{variantId}
```

### Category

```text
GET    /api/categories
GET    /api/categories/{id}

POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

---

## 14. HTTP Status Rules

| Situation | Status |
|---|---:|
| GET success | 200 OK |
| POST success | 201 CREATED |
| PUT success | 200 OK |
| DELETE success | 204 NO CONTENT |
| Resource not found | 404 NOT FOUND |
| Invalid request | 400 BAD REQUEST |
| Not authenticated | 401 UNAUTHORIZED |
| No permission | 403 FORBIDDEN |
| Conflict | 409 CONFLICT |

Do not return `200 OK` for every situation.

---

## 15. Transaction Rules

Operations involving multiple database changes should use transactions.

Example:

```java
@Transactional
public ProductResponse createProduct(ProductRequest request) {
    ...
}
```

Example business flow:

```text
Create Product
    ↓
Create Variants
    ↓
Create Images
    ↓
Commit
```

If a required operation fails, the transaction should roll back when appropriate.

---

## 16. JPA Relationship Rules

Prefer LAZY loading for relationships, especially collections.

Example:

```java
@ManyToOne(fetch = FetchType.LAZY)
private Category category;
```

```java
@OneToMany(
    mappedBy = "product",
    fetch = FetchType.LAZY
)
private List<ProductVariant> variants;
```

Avoid unnecessary `FetchType.EAGER`, especially for:

- `@OneToMany`
- `@ManyToMany`

---

## 17. Never Return Entity Directly

Standard flow:

```text
Database
   ↓
Entity
   ↓
Service
   ↓
MapStruct
   ↓
Response DTO
   ↓
Controller
   ↓
JSON
```

Reasons:

- Prevent exposing database fields
- Avoid lazy-loading problems
- Avoid infinite JSON recursion
- Keep API independent from persistence model

---

## 18. Security Rules

Security must be isolated in the `security` package.

```text
security/
├── SecurityConfig
├── JwtAuthenticationFilter
├── JwtService
└── CustomUserDetailsService
```

Do not put authentication/authorization logic inside ProductController or ProductRepository.

Admin endpoints must be protected by roles.

Example:

```java
@PreAuthorize("hasRole('ADMIN')")
```

---

## 19. Cloudinary Rules

Cloudinary logic belongs in a dedicated service.

```text
Controller
    ↓
Service
    ↓
CloudinaryService
    ↓
Cloudinary
```

CloudinaryService is responsible for:

- Upload
- Delete
- Returning image URL
- Returning public ID

Do not call Cloudinary SDK directly from Controller.

---

## 20. Database Rules

The SQL schema is the source of truth for the database.

When schema is managed manually by SQL, prefer:

```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
```

`validate` makes Hibernate verify Entity ↔ Database compatibility without modifying the schema.

Avoid using:

```yaml
ddl-auto: create
ddl-auto: create-drop
```

for databases containing important data.

---

## 21. Business Logic Rules

Business rules must not be implemented in Controller.

Example:

Requirement:

> A ProductVariant cannot have the same Product + Color + Size combination.

Correct flow:

```text
Controller
    ↓
VariantService
    ↓
Check duplicate combination
    ↓
VariantRepository
```

Not:

```text
Controller
    ↓
Database logic
```

---

## 22. Feature Boundary Rules

Each feature owns its domain responsibility.

Examples:

```text
ProductService
CategoryService
VariantService
ColorService
SizeService
AuthService
```

Do not create one giant service such as:

```text
ProductService
 ├── Product
 ├── Category
 ├── Color
 ├── Size
 ├── User
 ├── Authentication
 └── Cloudinary
```

Keep responsibilities separated.

---

## 23. Naming Rules

Use clear and predictable names.

Controller:

```text
ProductController
CategoryController
ProductVariantController
```

Service:

```text
ProductService
ProductServiceImpl
```

Repository:

```text
ProductRepository
```

Mapper:

```text
ProductMapper
```

DTO:

```text
ProductRequest
ProductResponse
```

Avoid meaningless names:

```text
ProductDTO1
ProductDTO2
ProductHelper
ProductManager
```

unless there is a clear architectural reason.

---

## 24. SOLID Principles

Backend code should follow SOLID.

### S — Single Responsibility

One class should have one primary responsibility.

```text
Controller       → HTTP
Service          → Business Logic
Repository       → Database
Mapper           → Mapping
CloudinaryService → Image Storage
```

### O — Open/Closed

Prefer designs that can be extended without unnecessary modification of existing code.

### L — Liskov Substitution

Implementations should be usable through their abstraction.

```text
ProductService
      ↑
ProductServiceImpl
```

### I — Interface Segregation

Avoid unnecessarily large interfaces.

### D — Dependency Inversion

Depend on abstractions rather than manually creating concrete dependencies.

Use dependency injection:

```java
private final ProductRepository productRepository;
```

Do not manually instantiate dependencies:

```java
new ProductRepositoryImpl();
```

---

## 25. Standard Feature Development Flow

When creating a new feature, follow this order:

```text
1. Database
       ↓
2. Entity
       ↓
3. Repository
       ↓
4. Request / Response DTO
       ↓
5. Mapper
       ↓
6. Service Interface
       ↓
7. Service Implementation
       ↓
8. Controller
       ↓
9. Exception / Validation
       ↓
10. API Test
```

---

## 26. Standard API Flow

Example:

```text
GET /api/products/1

React
  ↓
ProductController
  ↓
ProductService
  ↓
ProductRepository
  ↓
MySQL
  ↓
Product Entity
  ↓
ProductMapper
  ↓
ProductResponse
  ↓
ProductController
  ↓
JSON
```

This is the standard flow for the Clothing Store backend.

---

# Core Rules — Quick Reference

Always remember these 10 rules:

```text
1. Controller does not contain business logic.

2. Service contains business logic.

3. Repository only handles database access.

4. Never expose Entity directly through REST API.

5. Use Request/Response DTOs.

6. Use MapStruct for Entity ↔ DTO mapping.

7. Use Constructor Injection.

8. Handle exceptions centrally with GlobalExceptionHandler.

9. Prefer LAZY JPA relationships.

10. Keep each feature's responsibility clearly separated.
```

---

# Backend Golden Rule

Before adding code to a class, ask:

```text
"Is this class responsible for this job?"
```

If the answer is no, move the logic to the appropriate layer.

The target architecture is:

```text
                    ┌──────────────┐
                    │    React     │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Controller  │
                    └──────┬───────┘
                           │
                     DTO + Validation
                           │
                           ▼
                    ┌──────────────┐
                    │   Service    │
                    │ Business     │
                    │ Logic        │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Repository  │
                    └──────┬───────┘
                           │
                           ▼
                       MySQL DB

Entity ←→ MapStruct ←→ DTO

Security / Exception / Cloudinary / Config
              are separated concerns.
```
