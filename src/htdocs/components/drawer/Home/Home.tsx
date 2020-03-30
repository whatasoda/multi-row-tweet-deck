import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Section, Title } from '../Section';
import { Icon } from '../../../../shared/components/Icon';
import { ws } from '../../../../shared/utils/whitespace';
import whatasoda from '../../../../../assets/whatasoda.png';

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
            icon="chrome"
            target="_blank"
            href="https://chrome.google.com/webstore/detail/multi-row-tweetdeck/cjlaagghmikageagedknpkmapcjodnno"
          />
          <Icon.Link
            icon="firefox"
            target="_blank"
            href="https://addons.mozilla.org/ja/firefox/addon/multirow-tweetdeck/"
          />
        </Links>
      </Section>
      <Section>
        <Title>Contact</Title>
        <Description>{t('contact')}</Description>
        <MyAccount>@whatasoda</MyAccount>
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

const MyAccount = styled.a`
  display: block;
  padding: 0 0 0 60px;
  margin: 6px 0;
  font-size: 20px;
  line-height: 50px;
  position: relative;
  &:before {
    content: '';
    display: block;
    height: 50px;
    width: 50px;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-image: url(${whatasoda});
    background-size: contain;
    border-radius: 25px;
  }
`;
