export default function TagFilter({ tags, activeTag, onTagChange }) {
  return (
    <div className="tag-filter" id="tag-filter">
      <button
        className={`tag-filter__btn ${!activeTag ? 'active' : ''}`}
        onClick={() => onTagChange('')}
      >
        All Posts
      </button>
      {tags.map(tag => (
        <button
          key={tag.name}
          className={`tag-filter__btn ${activeTag === tag.name ? 'active' : ''}`}
          onClick={() => onTagChange(tag.name)}
        >
          #{tag.name} ({tag.count})
        </button>
      ))}
    </div>
  );
}
