import { useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChallengesContext } from '../store/challenges-context.jsx';
import ChallengeItem from './ChallengeItem.jsx';
import ChallengeTabs from './ChallengeTabs.jsx';

export default function Challenges() {
  const { challenges } = useContext(ChallengesContext);
  const [selectedType, setSelectedType] = useState('active');
  const [expanded, setExpanded] = useState(null);

  function handleSelectType(newType) {
    setSelectedType(newType);
  }

  function handleViewDetails(id) {
    setExpanded((prevId) => (prevId === id ? null : id));
  }

  const filteredChallenges = {
    active: challenges.filter((challenge) => challenge.status === 'active'),
    completed: challenges.filter((challenge) => challenge.status === 'completed'),
    failed: challenges.filter((challenge) => challenge.status === 'failed'),
  };

  const displayedChallenges = filteredChallenges[selectedType];

  return (
    <div id="challenges">
      <ChallengeTabs
        challenges={filteredChallenges}
        onSelectType={handleSelectType}
        selectedType={selectedType}
      />

    <AnimatePresence mode="wait">
      <motion.div
        key={selectedType}
        layout
        layoutRoot
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <ol className="challenge-items">
          <AnimatePresence mode="popLayout">
            {displayedChallenges.map((challenge) => (
              <ChallengeItem
                key={challenge.id}
                challenge={challenge}
                onViewDetails={() => handleViewDetails(challenge.id)}
                isExpanded={expanded === challenge.id}
              />
            ))}
          </AnimatePresence>
        </ol>
      </motion.div>
    </AnimatePresence>


      <AnimatePresence>
        {displayedChallenges.length === 0 && (
          <motion.p
            key="fallback"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            No challenges found.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
