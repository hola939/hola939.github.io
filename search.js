// Sistema de búsqueda avanzada
class ProductSearch {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentCategory = 'all';
        this.searchTerm = '';
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.setupSearchUI();
    }

    loadProducts() {
        // Obtener todos los productos del DOM
        const productElements = document.querySelectorAll('.product');
        
        productElements.forEach((product, index) => {
            const id = product.querySelector('.btn-add').dataset.id;
            const name = product.querySelector('h4').textContent;
            const description = product.querySelector('.product-text').textContent;
            const price = product.querySelector('#currentPrice').textContent;
            const image = product.querySelector('img').src;
            const category = this.determineCategory(name, description);
            
            this.products.push({
                id: id,
                name: name,
                description: description,
                price: price,
                image: image,
                category: category,
                element: product
            });
        });
        
        this.filteredProducts = [...this.products];
    }

    determineCategory(name, description) {
        const text = (name + ' ' + description).toLowerCase();
        
        if (text.includes('keyboard') || text.includes('mouse') || text.includes('accessory')) {
            return 'accessories';
        } else if (text.includes('earphone') || text.includes('headphone') || text.includes('audio')) {
            return 'audio';
        } else if (text.includes('laptop') || text.includes('desktop') || text.includes('computer')) {
            return 'computers';
        } else if (text.includes('mobile') || text.includes('phone') || text.includes('smartphone')) {
            return 'mobile';
        } else if (text.includes('game') || text.includes('gaming')) {
            return 'gaming';
        } else if (text.includes('wifi') || text.includes('network') || text.includes('router')) {
            return 'networking';
        } else if (text.includes('flash') || text.includes('memory') || text.includes('storage') || text.includes('hdd')) {
            return 'storage';
        } else {
            return 'electronics';
        }
    }

    bindEvents() {
        // Búsqueda en tiempo real
        const searchInput = document.querySelector('input[type="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.performSearch();
            });

            // Prevenir envío del formulario
            searchInput.closest('form').addEventListener('submit', (e) => {
                e.preventDefault();
            });
        }

        // Filtros por categoría
        document.querySelectorAll('.category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setActiveCategory(e.currentTarget);
            });
        });
    }

    setupSearchUI() {
        // Agregar contador de resultados
        const productsSection = document.querySelector('.products');
        const resultsCounter = document.createElement('div');
        resultsCounter.className = 'search-results-counter';
        resultsCounter.innerHTML = `
            <p>Mostrando <span id="resultsCount">${this.products.length}</span> de ${this.products.length} productos</p>
        `;
        productsSection.insertBefore(resultsCounter, productsSection.querySelector('h2').nextSibling);

        // Agregar mensaje de "no resultados"
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="fa-solid fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>Intenta con otros términos de búsqueda o cambia de categoría</p>
            </div>
        `;
        productsSection.appendChild(noResults);
        noResults.style.display = 'none';
    }

    setActiveCategory(categoryLink) {
        // Remover clase activa de todas las categorías
        document.querySelectorAll('.category-link').forEach(link => {
            link.classList.remove('active');
        });

        // Agregar clase activa a la categoría seleccionada
        categoryLink.classList.add('active');

        // Obtener categoría del href
        const href = categoryLink.getAttribute('href');
        this.currentCategory = href.replace('#', '');
        
        this.performSearch();
    }

    performSearch() {
        this.filteredProducts = this.products.filter(product => {
            const matchesSearch = this.searchTerm === '' || 
                product.name.toLowerCase().includes(this.searchTerm) ||
                product.description.toLowerCase().includes(this.searchTerm);
            
            const matchesCategory = this.currentCategory === 'all' || 
                product.category === this.currentCategory;
            
            return matchesSearch && matchesCategory;
        });

        this.updateDisplay();
        this.updateResultsCounter();
    }

    updateDisplay() {
        const productsGrid = document.querySelector('.products-grid');
        const noResults = document.querySelector('.no-results');
        
        // Ocultar todos los productos
        this.products.forEach(product => {
            product.element.style.display = 'none';
            product.element.style.opacity = '0';
            product.element.style.transform = 'scale(0.8)';
        });

        if (this.filteredProducts.length === 0) {
            // Mostrar mensaje de no resultados
            noResults.style.display = 'block';
            noResults.style.opacity = '0';
            setTimeout(() => {
                noResults.style.opacity = '1';
            }, 10);
        } else {
            // Ocultar mensaje de no resultados
            noResults.style.display = 'none';
            
            // Mostrar productos filtrados con animación
            this.filteredProducts.forEach((product, index) => {
                setTimeout(() => {
                    product.element.style.display = 'flex';
                    product.element.style.opacity = '1';
                    product.element.style.transform = 'scale(1)';
                    
                    // Resaltar texto de búsqueda si existe
                    if (this.searchTerm) {
                        this.highlightText(product.element, this.searchTerm);
                    } else {
                        this.removeHighlight(product.element);
                    }
                }, index * 100);
            });
        }
    }

    highlightText(element, searchTerm) {
        const nameElement = element.querySelector('h4');
        const descElement = element.querySelector('.product-text');
        
        if (nameElement) {
            const nameText = nameElement.textContent;
            const highlightedName = nameText.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<mark class="search-highlight">${match}</mark>`
            );
            nameElement.innerHTML = highlightedName;
        }
        
        if (descElement) {
            const descText = descElement.textContent;
            const highlightedDesc = descText.replace(
                new RegExp(searchTerm, 'gi'),
                match => `<mark class="search-highlight">${match}</mark>`
            );
            descElement.innerHTML = highlightedDesc;
        }
    }

    removeHighlight(element) {
        const nameElement = element.querySelector('h4');
        const descElement = element.querySelector('.product-text');
        
        if (nameElement) {
            nameElement.innerHTML = nameElement.textContent;
        }
        
        if (descElement) {
            descElement.innerHTML = descElement.textContent;
        }
    }

    updateResultsCounter() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }

    // Métodos públicos para uso externo
    getFilteredProducts() {
        return this.filteredProducts;
    }

    getCurrentCategory() {
        return this.currentCategory;
    }

    getSearchTerm() {
        return this.searchTerm;
    }
}

// Inicializar búsqueda cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.productSearch = new ProductSearch();
    
    // Agregar estilos para la búsqueda
    const searchStyles = document.createElement('style');
    searchStyles.textContent = `
        .search-results-counter {
            text-align: center;
            margin-bottom: 1rem;
            color: #6b7280;
            font-size: 0.95rem;
        }
        
        .search-results-counter span {
            color: #2563eb;
            font-weight: 600;
        }
        
        .no-results {
            text-align: center;
            padding: 3rem 1rem;
            transition: opacity 0.3s ease;
        }
        
        .no-results-content {
            max-width: 400px;
            margin: 0 auto;
        }
        
        .no-results i {
            font-size: 3rem;
            color: #d1d5db;
            margin-bottom: 1rem;
        }
        
        .no-results h3 {
            color: #374151;
            margin-bottom: 0.5rem;
        }
        
        .no-results p {
            color: #6b7280;
            font-size: 0.95rem;
        }
        
        .search-highlight {
            background: #fef3c7;
            color: #92400e;
            padding: 2px 4px;
            border-radius: 3px;
            font-weight: 600;
        }
        
        .category-link.active {
            background: #2563eb !important;
            color: #fff !important;
            transform: translateY(-2px) scale(1.05);
        }
        
        .product {
            transition: opacity 0.3s ease, transform 0.3s ease;
        }
        
        .form-header {
            position: relative;
        }
        
        .form-header input[type="search"] {
            padding-right: 3rem;
        }
        
        .search-suggestions {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
            display: none;
        }
        
        .suggestion-item {
            padding: 0.75rem 1rem;
            cursor: pointer;
            border-bottom: 1px solid #f3f4f6;
            transition: background 0.2s;
        }
        
        .suggestion-item:hover {
            background: #f9fafb;
        }
        
        .suggestion-item:last-child {
            border-bottom: none;
        }
    `;
    document.head.appendChild(searchStyles);
});

// Función global para acceder a la búsqueda desde la consola
window.getSearchInfo = function() {
    console.log('Término de búsqueda:', productSearch.getSearchTerm());
    console.log('Categoría actual:', productSearch.getCurrentCategory());
    console.log('Productos filtrados:', productSearch.getFilteredProducts());
    return productSearch;
}; 