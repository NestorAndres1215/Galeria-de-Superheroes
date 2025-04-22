const token = "a0f808c19da2a45b84e297527c59da1e";
    const total = 700; // Total heroes to fetch
    const heroesPerPage = 12; // Heroes per page
    let heroes = [];
    let filteredHeroes = [];

    async function cargarCatalogo() {
      const contenedor = document.getElementById("resultado");
      contenedor.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando superhéroes...';

      heroes = [];
      for (let i = 1; i <= total; i++) {
        try {
          const res = await fetch(`https://superheroapi.com/api.php/${token}/${i}`);
          const hero = await res.json();
          if (hero.response === "success") {
            heroes.push(hero);
          }
        } catch (err) {
          console.error("Error con ID:", i);
        }
      }
      filteredHeroes = [...heroes];
      mostrarHeroes(1);
    }

    function mostrarHeroes(page) {
      const contenedor = document.getElementById("resultado");
      contenedor.innerHTML = "";

      if (filteredHeroes.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron superhéroes.</p>';
        return;
      }

      const start = (page - 1) * heroesPerPage;
      const end = start + heroesPerPage;
      const paginatedHeroes = filteredHeroes.slice(start, end);

      paginatedHeroes.forEach(hero => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${hero.image.url}" alt="${hero.name}">
          <h3>${hero.name}</h3>
          <p><i class="fas fa-brain"></i><strong>Inteligencia:</strong> ${hero.powerstats.intelligence}</p>
          <p><i class="fas fa-dumbbell"></i><strong>Fuerza:</strong> ${hero.powerstats.strength}</p>
        `;
        contenedor.appendChild(card);
      });

      renderPagination(page);
    }

    function filterHeroes(page) {
      const search = document.getElementById("search").value.toLowerCase();
      const stat = document.getElementById("filterStat").value;
      const value = document.getElementById("filterValue").value;

      filteredHeroes = [...heroes];

      // Filtrar por búsqueda
      if (search) {
        filteredHeroes = filteredHeroes.filter(hero =>
          hero.name.toLowerCase().includes(search)
        );
      }

      // Filtrar por estadística
      if (stat && value) {
        filteredHeroes = filteredHeroes.filter(hero => {
          const statValue = parseInt(hero.powerstats[stat]) || 0;
          return statValue > parseInt(value);
        });
      }

      mostrarHeroes(page);
    }

    function renderPagination(currentPage) {
      const pagination = document.getElementById("pagination");
      pagination.innerHTML = "";
      const pageCount = Math.ceil(filteredHeroes.length / heroesPerPage);

      // Previous button
      const prevButton = document.createElement("button");
      prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
      prevButton.disabled = currentPage === 1;
      prevButton.onclick = () => {
        if (currentPage > 1) {
          mostrarHeroes(currentPage - 1);
        }
      };
      pagination.appendChild(prevButton);

      // Page numbers
      const maxButtons = 5; // Maximum number of page buttons to show
      let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(pageCount, startPage + maxButtons - 1);

      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";
        button.onclick = () => mostrarHeroes(i);
        pagination.appendChild(button);
      }

      // Next button
      const nextButton = document.createElement("button");
      nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
      nextButton.disabled = currentPage === pageCount;
      nextButton.onclick = () => {
        if (currentPage < pageCount) {
          mostrarHeroes(currentPage + 1);
        }
      };
      pagination.appendChild(nextButton);
    }

    window.onload = cargarCatalogo;