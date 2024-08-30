import { useState, useEffect, useRef } from 'react';
import './TagsInput.css';
import { ModifyIcon } from '../MenuItems/Icons/ModifyIcon';
import { TrashCanDeleteIcon } from '../MenuItems/Icons/TrashCanDeleteIcon';
import { ApplyIcon } from '../MenuItems/Icons/ApplyIcon';
import { ConfirmationPopup } from '../MenuItems/Popups/ConfirmationPopup';
import { useCustomConfirmationPopup } from '../Hooks/useCustomConfirmationPopup';

type Props = {
  tags: string[];
  selectedTags: (tags: string[]) => void;
  setPage: (idx: number) => void;
};

export const TagsInput = ({ selectedTags, tags, setPage }: Props) => {
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverClass, setHoverClass] = useState<string>('');
  const [editMode, setEditMode] = useState<number | null>(null);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {showConfirmationPopup, confirmationPopupContent, confirmationPopupType, confirmationPopupHandler, customPopup, closeConfirmationPopup} = useCustomConfirmationPopup();
  const [firstDeleteTried, setFirstDeleteTried] = useState<boolean>(false);

  useEffect(() => {
    setCurrentTags(tags);
  }, [tags, inputRef]);

  useEffect(() => {
    if (editMode === null && lastClickedIndex !== null) {
      setPage(lastClickedIndex);
    }
    if (editMode !== null && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(inputRef.current.value.length, inputRef.current.value.length);
      adjustInputWidth();
    } else if (editMode === null && inputRef.current) {
      inputRef.current.blur();
    }
  }, [editMode, lastClickedIndex]);

  const handleLeftClick = (index: number) => {
    setLastClickedIndex(index);
    if (editMode === index) {
      setEditMode(null);
    } else {
      setEditMode(index);
      adjustInputWidth();
    }
  };

  const removeTagsHandler = (indexToRemove: number) => {
    if(!firstDeleteTried){
      setFirstDeleteTried(true);
      confirmRemoveTagHandler(indexToRemove);
    } else{
      removeTags(indexToRemove);
    }
  }

  const removeTags = (indexToRemove: number): void => {
    const newTags = currentTags.filter((_, index) => index !== indexToRemove);
    setCurrentTags(newTags);
    selectedTags(newTags);

    const newIndex = indexToRemove > 0 ? indexToRemove - 1 : 0;
    setLastClickedIndex(newIndex < newTags.length ? newIndex : null);
};

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    const target = event.target as HTMLInputElement;
    if (event.key === 'Enter' && target.value !== '') {
      const newTags = [...currentTags, target.value];
      setCurrentTags(newTags);
      selectedTags(newTags);
      target.value = '';
      event.preventDefault();
      setLastClickedIndex(tags.length);
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

  const confirmRemoveTagHandler = async (indexToRemove: number) => customPopup('warning2', `This button removes ${currentTags[indexToRemove]}.`, `Maybe you misspressed?`, () => () => {closeConfirmationPopup(); removeTags(indexToRemove)});
  const globalAbortHandler = () => closeConfirmationPopup();

  return (
    <>
      <div className="tags-input">
        <div className='taginputbox__wrapper'>
          <label className='tags-input__total-label'>{tags.length} students</label>
          <input
            className="taginputbox"
            type="text"
            onKeyDown={addTags}
            placeholder="Add student names here"
          />
        </div>
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
                    onClick={() => removeTagsHandler(index)}
                  ></span>
                  <TrashCanDeleteIcon 
                    className="tag-close-icon"
                    onMouseEnter={() => handleMouseEnter('hover-right', index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => removeTagsHandler(index)}
                  />
                </>
              }
            </li>
          ))}
        </ul>
      </div>
      <ConfirmationPopup
        title={confirmationPopupContent[0]}
        text={confirmationPopupContent[1]}
        show={showConfirmationPopup}
        confirmationPopupType={confirmationPopupType}
        abortClick={() => globalAbortHandler()}
        // @ts-ignore
        confirmClick={(inputContent?: string) => { confirmationPopupHandler(inputContent) }}
        abortBtnPlaceholder='Yes take me Back'
        okBtnPlaceholder='Delete Student'
      />
    </>
  );
};