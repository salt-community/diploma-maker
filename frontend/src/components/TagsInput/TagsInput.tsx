import { useState } from 'react';
import './TagsInput.css';

type Props = {
  selectedTags: (tags: string[]) => void;
}

const TagsInput = ({selectedTags}: Props) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);

  const removeTags = (indexToRemove: number): void => {
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    setCurrentTags(newTags);
    selectedTags(newTags);
  };

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' && target.value !== "") {
      const newTags = [...currentTags, target.value];
      setCurrentTags(newTags);
      selectedTags(newTags);
      target.value = "";
      event.preventDefault();
    }
  };

  return (
    <div className="tags-input">
      <input
        className="taginputbox"
        type="text"
        onKeyDown={addTags}
        placeholder="Press enter to add name"
      />
      <ul id="tags">
        {currentTags.map((tag, index) => (
          <li onClick={() => removeTags(index)} key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <svg className="tag-close-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
              <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsInput;