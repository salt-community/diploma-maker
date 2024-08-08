import { useState, useEffect, useRef } from 'react';
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
  const [editMode, setEditMode] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setCurrentTags(tags);
  }, [tags]);

  useEffect(() => {
    if (editMode !== null && inputRef.current) {
      adjustWidth(inputRef.current);
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
    } else if (editMode === null && inputRef.current) {
      inputRef.current.blur();
    }
  }, [editMode]);
  
  const handleLeftClick = (index: number) => {
    if (editMode === index) {
      setEditMode(null);
    } else {
      setEditMode(index);
    }
  };
  

  const adjustWidth = (input: HTMLInputElement) => {
    const text = input.placeholder || input.value;
    const span = document.createElement('span');
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.textContent = text;
    document.body.appendChild(span);
    input.style.width = `${span.offsetWidth - 40}px`;
    document.body.removeChild(span);
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

  return (
    <div className="tags-input">
      <h1 className='not-implemented'>(modify currently not implemented)</h1>
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
              onClick={() => setEditMode(editMode === index ? null : index)}
            ></span>
            {editMode === index ? (
              <input
                ref={inputRef}
                className='tag-title__input'
                type="text"
                defaultValue={tag}
                onBlur={() => setEditMode(null)}
                onMouseEnter={() => handleMouseEnter('hover-left', index)}
                onMouseLeave={handleMouseLeave}
                onInput={(e) => adjustWidth(e.currentTarget)}
              />
            ) : (
              <span className="tag-title">{tag}</span>
            )}
            {editMode === index ? 
              <>
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
