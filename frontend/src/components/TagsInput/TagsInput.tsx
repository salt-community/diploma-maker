import { useState, useEffect } from 'react';
import './TagsInput.css';
import { ModifyIcon } from '../MenuItems/Icons/ModifyIcon';
import { TrashCanDeleteIcon } from '../MenuItems/Icons/TrashCanDeleteIcon';

type Props = {
  tags: string[];
  selectedTags: (tags: string[]) => void;
};

export const TagsInput = ({ selectedTags, tags }: Props) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverClass, setHoverClass] = useState<string>('');

  useEffect(() => {
    setCurrentTags(tags);
  }, [tags]);

  const removeTags = (indexToRemove: number): void => {
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    setCurrentTags(newTags);
    selectedTags(newTags);
  };

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' && target.value !== '') {
      const newTags = [...currentTags, target.value];
      setCurrentTags(newTags);
      selectedTags(newTags);
      target.value = '';
      event.preventDefault();
    }
  };

  const handleMouseEnter = (hoverType: string, index: number) => {
    setHoverIndex(index);
    setHoverClass(hoverType);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoverClass('');
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
          <li
            key={index}
            className={`tag ${hoverIndex === index ? hoverClass : ''}`}
          >
            <ModifyIcon 
              className="tag-open-icon"
              onMouseEnter={() => handleMouseEnter('hover-left', index)}
              onMouseLeave={handleMouseLeave}
            />
            <span
              className="left-click-boundingbox"
              onMouseEnter={() => handleMouseEnter('hover-left', index)}
              onMouseLeave={handleMouseLeave}
            ></span>
            <span className="tag-title">{tag}</span>
            <span
              className="right-click-boundingbox"
              onMouseEnter={() => handleMouseEnter('hover-right', index)}
              onMouseLeave={handleMouseLeave}
              onClick={() => removeTags(index)}
            ></span>
            <TrashCanDeleteIcon 
              className="tag-close-icon"
              onMouseEnter={() => handleMouseEnter('hover-right', index)}
              onMouseLeave={handleMouseLeave}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};