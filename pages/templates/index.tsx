import React from 'react';
import Header from 'next/head';
import { Layout } from '../../layouts';
import { Templates } from '../../components';

export default function TemplatesPage() {
  return (
    <>
      <Header>
        <title>Zoogle</title>
      </Header>
      <Layout><Templates /></Layout>
    </>
  );
};

