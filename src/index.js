document.addEventListener("DOMContentLoaded", () => {
  const ramenMenu = document.getElementById('ramen-menu');
  const ramenDetailImage = document.querySelector('.detail-image');
  const ramenDetailName = document.querySelector('.name');
  const ramenDetailRestaurant = document.querySelector('.restaurant');
  const ratingDisplay = document.getElementById('rating-display');
  const commentDisplay = document.getElementById('comment-display');
  const newRamenForm = document.getElementById('new-ramen');
  const baseURL = 'http://localhost:3000/ramens'; // Assuming JSON server for ramen data

  // Fetch all ramen data
  function fetchRamenData() {
    fetch(baseURL)
      .then((response) => response.json())
      .then((ramens) => {
        ramens.forEach(renderRamen);
        displayRamenDetails(ramens[0]); // Show details of the first ramen on page load
      });
  }

  // Render ramen images in the ramen menu
  function renderRamen(ramen) {
    const ramenImage = document.createElement('img');
    ramenImage.src = ramen.image;
    ramenImage.alt = ramen.name;
    ramenImage.addEventListener('click', () => displayRamenDetails(ramen));
    ramenMenu.appendChild(ramenImage);
  }

  // Display ramen details
  function displayRamenDetails(ramen) {
    ramenDetailImage.src = ramen.image;
    ramenDetailImage.alt = ramen.name;
    ramenDetailName.textContent = ramen.name;
    ramenDetailRestaurant.textContent = ramen.restaurant;
    ratingDisplay.textContent = ramen.rating;
    commentDisplay.textContent = ramen.comment;

    // Update form submit event for editing the current ramen's rating and comment
    document.getElementById('submit-button').onclick = (e) => {
      e.preventDefault();
      const updatedRating = document.getElementById('new-rating').value;
      const updatedComment = document.getElementById('new-comment').value;
      updateRamen(ramen.id, updatedRating, updatedComment);
    };
  }

  // Update ramen rating and comment (PATCH request)
  function updateRamen(id, newRating, newComment) {
    fetch(`${baseURL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rating: newRating,
        comment: newComment,
      }),
    })
      .then((response) => response.json())
      .then((updatedRamen) => {
        // Reflect the changes in the frontend
        ratingDisplay.textContent = updatedRamen.rating;
        commentDisplay.textContent = updatedRamen.comment;
      });
  }

  // Handle new ramen creation (POST request)
  newRamenForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newRamen = {
      name: document.getElementById('new-name').value,
      restaurant: document.getElementById('new-restaurant').value,
      image: document.getElementById('new-image').value,
      rating: document.getElementById('new-rating').value,
      comment: document.getElementById('new-comment').value,
    };

    fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRamen),
    })
      .then((response) => response.json())
      .then((createdRamen) => {
        renderRamen(createdRamen);
      });
  });

  // Delete ramen (DELETE request)
  function deleteRamen(id) {
    fetch(`${baseURL}/${id}`, {
      method: 'DELETE',
    }).then(() => {
      // Optionally, you could remove the ramen from the frontend
      location.reload(); // This reloads the page to remove deleted ramen visually
    });
  }

  // Initialize page by fetching ramen data
  fetchRamenData();
});
