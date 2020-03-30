import React from 'react';
import styled from 'styled-components';
import { Section, Title } from '../Section';
import { Icon } from '../../../../shared/components/Icon';
import { useTranslation } from 'react-i18next';
import { ws } from '../../../../shared/utils/whitespace';

export const Home = () => {
  const [t] = useTranslation();
  return (
    <>
      <Section>
        <Title>About</Title>
        <Description>{ws(t('about'))}</Description>
      </Section>
      <Section>
        <Title>Installation</Title>
        <Description>{ws(t('installationMessage'))}</Description>
        <Links>
          <Icon.Link
            href="https://chrome.google.com/webstore/detail/multi-row-tweetdeck/cjlaagghmikageagedknpkmapcjodnno"
            icon="chrome"
          />
          <Icon.Link href="https://addons.mozilla.org/ja/firefox/addon/multirow-tweetdeck/" icon="firefox" />
        </Links>
      </Section>
    </>
  );
};

const Description = styled.section`
  padding-left: 2px;
  font-weight: 500;
  letter-spacing: 0.08em;
`;

const Links = styled.div`
  padding: 16px 20px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  font-size: 40px;
`;
