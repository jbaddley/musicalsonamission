import Head from "next/head";

export const CommonHead = () => {
  return (
    <Head>
      <title>Musicals On A Mission</title>
      <meta name='description' content='Tools to produce your next musical!' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <link rel='icon' href='/assets/16w/moam-icon.png' />
    </Head>
  );
};
