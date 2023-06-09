import React from 'react';
import Header from 'next/head';
import { Playground } from '../components';
import { Layout } from '../layouts';

export default function HomePage() {
  return (
    <>
      <Header>
        <title>Zoogle</title>
      </Header>
      <Layout><Playground /></Layout>
    </>
  );
}
