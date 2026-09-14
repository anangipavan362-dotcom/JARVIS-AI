import pygame
import random

# Initialize Pygame
pygame.init()

# Screen settings
WIDTH = 400
HEIGHT = 600

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Car Racing Game")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)
RED = (255, 0, 0)

# Player car
player_width = 50
player_height = 100
player_x = WIDTH // 2 - player_width // 2
player_y = HEIGHT - player_height - 20
player_speed = 5

# Enemy car
enemy_width = 50
enemy_height = 100
enemy_x = random.randint(0, WIDTH - enemy_width)
enemy_y = -100
enemy_speed = 5

# Score
score = 0
font = pygame.font.Font(None, 36)

# Game clock
clock = pygame.time.Clock()

running = True

while running:
    clock.tick(60)

    # Events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Keyboard input
    keys = pygame.key.get_pressed()

    if keys[pygame.K_LEFT] and player_x > 0:
        player_x -= player_speed

    if keys[pygame.K_RIGHT] and player_x < WIDTH - player_width:
        player_x += player_speed

    # Move enemy
    enemy_y += enemy_speed

    if enemy_y > HEIGHT:
        enemy_y = -100
        enemy_x = random.randint(0, WIDTH - enemy_width)
        score += 1

    # Collision detection
    player_rect = pygame.Rect(
        player_x,
        player_y,
        player_width,
        player_height
    )

    enemy_rect = pygame.Rect(
        enemy_x,
        enemy_y,
        enemy_width,
        enemy_height
    )

    if player_rect.colliderect(enemy_rect):
        print("Game Over!")
        print("Final Score:", score)
        running = False

    # Draw everything
    screen.fill(WHITE)

    pygame.draw.rect(screen, BLUE, player_rect)
    pygame.draw.rect(screen, RED, enemy_rect)

    score_text = font.render(
        "Score: " + str(score),
        True,
        BLACK
    )

    screen.blit(score_text, (10, 10))

    pygame.display.flip()

# Quit game
pygame.quit()