function loadFavorites() {
    try {
        const saved = localStorage.getItem("bakery-favorites");
        const result = JSON.parse(saved);
        return Array.isArray(result) ? result : [];
    } catch {
        return [];
    }
}

function saveFavorites(favoritesList) {
    localStorage.setItem(
        "bakery-favorites",
        JSON.stringify([...favoritesList]),
    );
}

function toggleFavorite(productId, favoritesList) {
    if (favoritesList.has(productId)) {
        favoritesList.delete(productId);
        return saveFavorites(favoritesList);
    }
    favoritesList.add(productId);
    saveFavorites(favoritesList);
}

const products = {
    "country-sourdough": {
        category: "bread",
        title: "Country Sourdough",
        description: "Slow-fermented with a crisp golden crust.",
        priceCents: 750,
        image: {
            src: "assets/bakery-signature-loaf_c.png",
            alt: "Sourdough loaf",
        },
    },
    "artisan-asiago-cheesebread": {
        category: "bread",
        title: "Artisan Asiago Cheesebread",
        description:
            "Fluffy, infused and topped with beautifully browned asiago cheese.",
        priceCents: 1150,
    },
    "classic-croissant": {
        category: "pastry",
        title: "Classic Croissant",
        description: "Flaky, buttery, and baked fresh daily.",
        priceCents: 425,
        bulkThreshold: 12,
        bulkPriceCents: 400,
    },
    "cinnamon-roll": {
        category: "pastry",
        title: "Cinnamon Roll*",
        description: "Soft, spiced, and topped with vanilla glaze.",
        priceCents: 475,
        bulkThreshold: 12,
        bulkPriceCents: 425,
    },
    "blueberry-muffin": {
        category: "pastry",
        title: "Blueberry Muffin",
        description: "Loaded with blueberries and a crumb topping.",
        priceCents: 395,
        bulkThreshold: 4,
        bulkPriceCents: 365,
    },
    "chocolate-tart": {
        category: "pastry",
        title: "Chocolate Tart*",
        description: "Rich chocolate filling in a crisp pastry shell.",
        priceCents: 550,
        bulkThreshold: 6,
        bulkPriceCents: 500,
    },
};

let ONLY_FAVS = false;

const favorites = new Set(loadFavorites());

const menu = document.querySelector(".menu");

const categories = [
    ["bread", "Breads"],
    ["pastry", "Pastries"],
];

function loadProducts(products, categories, onlyFavs) {
    menu.replaceChildren();

    for (const category of categories) {
        const title = `<h2>${category[1]}</h2>`;
        let categoryEmpty = true;
        menu.insertAdjacentHTML("beforeend", title);

        for (const [productId, product] of Object.entries(products)) {
            if (onlyFavs && !favorites.has(productId)) continue;
            if (product.category != category[0]) continue;
            let image = "";
            if (product.image) {
                image = `
        <img class="image"
                        src="${product.image.src}"
                        alt="${product.image.alt}"
                    />
                    `;
            }
            let starSrc = "assets/star-outline.svg";
            if (favorites.has(productId)) {
                starSrc = "assets/star-filled.svg";
            }

            let bulk = "";
            if (product.bulkThreshold) {
                bulk = `($${(product.bulkPriceCents / 100).toFixed(2)} each when buying ${product.bulkThreshold}+)`;
            }

            const item = `
                <div class="menu-item">
                    <div class="menu-item-text">
                    <div class="menu-item-heading">
                    <button type="button" class="favorite-button" data-product-id="${productId}" aria-label="Favorite ${product.title}" aria-pressed="${favorites.has(productId)}">
                        <img src="${starSrc}" alt="" width="24" height="24" />
                    </button>
                        <h3>${product.title}</h3>
                        </div>
                        <p>${product.description}</p>
                        <strong>$${(product.priceCents / 100).toFixed(2)}</strong>
                        ${bulk}
                        <br />
                    </div>
                    ${image}
                </div>
    `;

            menu.insertAdjacentHTML("beforeend", item);
            categoryEmpty = false;
        }
        if (categoryEmpty) {
            menu.insertAdjacentHTML("beforeend", `<p>No favorites yet.</p>`);
        }
    }
}

menu.addEventListener("click", (e) => {
    const button = e.target.closest(".favorite-button");
    if (!button) return;

    const productId = button.dataset.productId;
    toggleFavorite(productId, favorites);

    loadProducts(products, categories, ONLY_FAVS);

    const updatedButton = menu.querySelector(
        `[data-product-id="${productId}"]`,
    );

    if (updatedButton) {
        updatedButton.focus();
    } else {
        favoritesToggle.focus();
    }
});

const favoritesToggle = document.getElementById("favorites-toggle");

favoritesToggle.addEventListener("change", (e) => {
    ONLY_FAVS = e.target.checked;
    loadProducts(products, categories, ONLY_FAVS);
});

loadProducts(products, categories, ONLY_FAVS);
