import React from 'react';
import Header from 'next/head';
import { Layout } from '../../layouts';
import { CreateTemplate } from '../../components';

export default function CreateTemplatePage() {
  return (
    <>
      <Header>
        <title>Zoogle</title>
      </Header>
      <Layout isAlertWhenNavigate={true}><CreateTemplate /></Layout>
    </>
  );
};
