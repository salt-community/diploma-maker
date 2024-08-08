import { useState, useEffect, useRef } from 'react';
import './TagsInput.css';
import { ModifyIcon } from '../MenuItems/Icons/ModifyIcon';
import { TrashCanDeleteIcon } from '../MenuItems/Icons/TrashCanDeleteIcon';
import { ApplyIcon } from '../MenuItems/Icons/ApplyIcon';

type Props = {
  tags: string[];
  selectedTags: (tags: string[]) => void;
  setPage: (idx: number) => void;
};

export const TagsInput = ({ selectedTags, tags, setPage }: Props) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverClass, setHoverClass] = useState<string>('');
  const [editMode, setEditMode] = useState<number | null>();
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentTags(tags);
  }, [tags, inputRef]);

  useEffect(() => {
    if (editMode !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      adjustInputWidth();
    } else if (editMode === null && inputRef.current) {
      inputRef.current.blur();
    }
  }, [editMode]);

  const handleLeftClick = (index: number) => {
    if (editMode === index) {
      setEditMode(null);
      setPage(index);
    } else {
      setEditMode(index);
      setPage(index);
      adjustInputWidth();
    }
  };

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

  const applyChanges = (index: number) => {
    if (inputRef.current) {
      const newTags = [...currentTags];
      newTags[index] = inputRef.current.value;
      setCurrentTags(newTags);
      selectedTags(newTags);
      setEditMode(null);
    }
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      applyChanges(index);
      event.preventDefault();
    }
  };

  const adjustInputWidth = () => {
    if (inputRef.current) {
      inputRef.current.style.width = 'auto';
      inputRef.current.style.width = `${inputRef.current.scrollWidth}px`;
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
          <li
            key={index}
            className={`tag ${hoverIndex === index ? hoverClass : ''} ${editMode === index ? 'edit-mode' : ''}`}
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
              onClick={() => handleLeftClick(index)}
            ></span>
            {editMode === index ? (
              <input
                ref={inputRef}
                className='tag-title__input'
                type="text"
                defaultValue={tag}
                onBlur={() => applyChanges(index)}
                onKeyDown={(e) => handleEditKeyDown(e, index)}
                onMouseEnter={() => handleMouseEnter('hover-edit', index)}
                onMouseLeave={handleMouseLeave}
                onInput={adjustInputWidth}
              />
            ) : (
              <span className="tag-title">{tag}</span>
            )}
            {editMode === index ? 
              <>
                <ApplyIcon 
                  className="tag-apply-icon"
                  onMouseEnter={() => handleMouseEnter('hover-edit', index)}
                  onMouseLeave={handleMouseLeave}
                />
                <span
                  className="left-click-boundingbox"
                  onMouseEnter={() => handleMouseEnter('hover-edit', index)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => applyChanges(index)}
                ></span>
              </>
              :
              <>
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
                  onClick={() => removeTags(index)}
                />
              </>
            }
          </li>
        ))}
      </ul>
    </div>
  );
};
