import React, { useState, useEffect } from 'react';
import { Icon } from '../../shared/components/Icon';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface LanguageSelectionProps {
  className?: string;
}

export const LanguageSelection = ({ className }: LanguageSelectionProps) => {
  const [, i18n] = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (i18n.language !== language) i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (!opened) return;

    const handleClick = () => setOpened(false);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, [opened]);

  return (
    <div className={className} style={{ position: 'relative' }}>
      <Icon.Button icon="language" onClick={() => setOpened(!opened)} />
      {opened && (
        <Languages>
          <Language onClick={() => setLanguage('ja')}>日本語</Language>
          <Language onClick={() => setLanguage('en')}>English</Language>
        </Languages>
      )}
    </div>
  );
};

const Languages = styled.div`
  font-size: 20px;
  position: absolute;
  left: calc(100% + 10px);
  bottom: 0;
  width: 150px;
  background-color: ${({ theme: { color } }) => color.cellsBackground};
  display: flex;
  flex-direction: column;
  padding: 2px;
`;

const Language = styled.button`
  color: ${({ theme: { color } }) => color.primaryText};
  background-color: ${({ theme: { color } }) => color.cellBackground};
  margin: 2px;
  height: 34px;
  &:hover {
    background-color: ${({ theme: { color } }) => color.cellBackground}66;
  }
`;
