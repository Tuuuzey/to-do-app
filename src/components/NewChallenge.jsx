import { useContext, useRef, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { ChallengesContext } from '../store/challenges-context.jsx';
import Modal from './Modal.jsx';
import images from '../assets/images.js';

export default function NewChallenge({ isOpen, onDone }) {
  const title = useRef();
  const description = useRef();
  const deadline = useRef();

  const [scope, animate] = useAnimate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrorIndicator, setShowErrorIndicator] = useState(false);

  const { addChallenge } = useContext(ChallengesContext);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function handleSelectImage(image) {
    setSelectedImage(image);
    if (validationErrors.image) {
      setValidationErrors(prev => ({ ...prev, image: false }));
    }
  }

  function validateForm(challenge) {
    const errors = {};
    if (!challenge.title.trim()) {
      errors.title = true;
    }
    if (!challenge.description.trim()) {
      errors.description = true;
    }
    if (!challenge.deadline.trim()) {
      errors.deadline = true;
    }
    if (!challenge.image) {
      errors.image = true;
    }
    return errors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const challenge = {
      title: title.current.value,
      description: description.current.value,
      deadline: deadline.current.value,
      image: selectedImage,
    };

    const errors = validateForm(challenge);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      if (!prefersReducedMotion) {
        const inputs = [title.current, description.current, deadline.current];
        inputs.forEach((input, index) => {
          animate(
            input,
            { x: [0, -6, 6, -4, 4, 0] },
            { type: 'tween', duration: 0.5, ease: 'easeOut', delay: index * 0.05 }
          );
        });
      } else {
        setShowErrorIndicator(true);
        setTimeout(() => setShowErrorIndicator(false), 2000);
        if (errors.title) {
          title.current.focus();
        } else if (errors.description) {
          description.current.focus();
        } else if (errors.deadline) {
          deadline.current.focus();
        }
      }
      return;
    }

    setValidationErrors({});
    setShowErrorIndicator(false);
    onDone();
    addChallenge(challenge);
  }

  function handleInputChange(inputName) {
    if (validationErrors[inputName]) {
      setValidationErrors(prev => ({ ...prev, [inputName]: false }));
    }
  }

  return (
    <Modal isOpen={isOpen} title="New Challenge" onClose={onDone}>
      <form id="new-challenge" onSubmit={handleSubmit}>
        {showErrorIndicator && (
          <div className="error-banner" role="alert">
            Please fill in all required fields and select an image.
          </div>
        )}

        <p>
          <label htmlFor="title">Title</label>
          <motion.input
            ref={title}
            type="text"
            name="title"
            id="title"
            className={validationErrors.title ? 'error' : ''}
            onChange={() => handleInputChange('title')}
            aria-invalid={validationErrors.title ? 'true' : 'false'}
            aria-describedby={validationErrors.title ? 'title-error' : undefined}
          />
          {validationErrors.title && (
            <span id="title-error" className="error-message" role="alert">
              Title is required
            </span>
          )}
        </p>

        <p>
          <label htmlFor="description">Description</label>
          <motion.textarea
            ref={description}
            name="description"
            id="description"
            className={validationErrors.description ? 'error' : ''}
            onChange={() => handleInputChange('description')}
            aria-invalid={validationErrors.description ? 'true' : 'false'}
            aria-describedby={validationErrors.description ? 'description-error' : undefined}
          />
          {validationErrors.description && (
            <span id="description-error" className="error-message" role="alert">
              Description is required
            </span>
          )}
        </p>

        <p>
          <label htmlFor="deadline">Deadline</label>
          <motion.input
            ref={deadline}
            type="date"
            name="deadline"
            id="deadline"
            className={validationErrors.deadline ? 'error' : ''}
            onChange={() => handleInputChange('deadline')}
            aria-invalid={validationErrors.deadline ? 'true' : 'false'}
            aria-describedby={validationErrors.deadline ? 'deadline-error' : undefined}
          />
          {validationErrors.deadline && (
            <span id="deadline-error" className="error-message" role="alert">
              Deadline is required
            </span>
          )}
        </p>

        <motion.ul
          id="new-challenge-images"
          className={validationErrors.image ? 'error' : ''}
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {images.map((image) => (
            <motion.li
              variants={{
                hidden: { opacity: 0, scale: 0.5 },
                visible: { opacity: 1, scale: 1 },
              }}
              transition={{ type: 'spring' }}
              key={image.alt}
              onClick={() => handleSelectImage(image)}
              className={selectedImage === image ? 'selected' : undefined}
            >
              <img {...image} />
            </motion.li>
          ))}
        </motion.ul>

        {validationErrors.image && (
          <span className="error-message" role="alert">
            Please select an image
          </span>
        )}

        <p className="new-challenge-actions">
          <button type="button" onClick={onDone}>
            Cancel
          </button>
          <button>Add Challenge</button>
        </p>
      </form>
    </Modal>
  );
}
