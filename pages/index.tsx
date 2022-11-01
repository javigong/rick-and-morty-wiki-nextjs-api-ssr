import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

type Data = {
  [key: string | number]: string | [] | {} | null | undefined | Data;
  results: Results[];
  info: { next: string };
  data: {};
  id: number;
  name: string;
  image: string;
};

type Results = {
  [key: string | number]: string | [] | {} | Results;
};

export default function Home({ data }: { data: Data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, setResults] = useState(defaultResults);
  const [page, setPage] = useState({ ...info, current: defaultEndpoint });
  const { current } = page;

  function handleLoadMore() {
    setPage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      setPage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        setResults(nextData.results);
        return;
      }

      setResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wubba Lubba Dub Dub!</h1>

        <p className={styles.description}>Rick and Morty Character Wiki</p>

        <ul className={styles.grid}>
          {results.map((result: any) => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                <a href="#">
                  <Image
                    width={250}
                    height={250}
                    src={image}
                    alt={`${name} Thumbnail`}
                  />

                  <h3>{name}</h3>
                </a>
              </li>
            );
          })}
        </ul>
        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
