 <div>
    <h4>Leave a Review</h4>
    <form action="">
      <div class="mb-3 mt-3">
        <label for="rating" class="form-label">Rating</label>
        <input
          type="range"
          min="1"
          max="5"
          id="rating"
          name="review[rating]"
          class="form-control"
        />
      </div>
      <div  class="mb-3 mt-3">
        <label for="comment" class="form-label">Comment</label>
        <textarea
          name="review[comment]"
          id="comment"
          cols="30"
          class="form-control"
          rows="5"
        ></textarea>
      </div>
      <button class="btn btn-outline-dark">Submit</button>
    </form>
  </div>