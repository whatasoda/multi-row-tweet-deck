import React from 'react';
import styled from 'styled-components';
import { Section, Title } from '../Section';
import { Icon } from '../../../../shared/components/Icon';

export const Home = () => {
  return (
    <>
      <Section>
        <Title>About</Title>
        <Description>
          MultiRow TweetDeck extends your TweetDeck layout with customizable rows. <br />
          <br />
          You can try customization of layouts on this page because this also serves as a setting page. <br />
          <br />
          Even if you make your layout before installation, the configuration is loaded from the extension later. <br />
          <br />
          So feel free to try it. Just switching to the setting mode by the buttons on the left. <br />
        </Description>
      </Section>
      <Section>
        <Title>Installation</Title>
        <Description>MultiRow TweetDeck supports GoogleChrome and Firefox. Click icons below to get!</Description>
        <Links>
          <Icon.Link
            href="https://chrome.google.com/webstore/detail/multi-row-tweetdeck/cjlaagghmikageagedknpkmapcjodnno"
            icon="chrome"
          />
          <Icon.Link
            href="https://chrome.google.com/webstore/detail/multi-row-tweetdeck/cjlaagghmikageagedknpkmapcjodnno"
            icon="firefox"
          />
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
