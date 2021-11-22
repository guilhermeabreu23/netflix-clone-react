import React, { useEffect, useState } from 'react';
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';

/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default () => {

  // eslint-disable-next-line no-unused-vars
  //variáveis para as funções abaixo
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState([]);
  const [blackHeader, setBlackHeader] = useState(false);
  //--------------------------------


  /// função para carregar as listas de filmes da API, e para carregar um filme em destaque no começo da página
  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista total de filmes
      let list = await Tmdb.getHomelist();
      setMovieList(list);
      //-------------------------------

      //Pegando um filme aleatório para colocar em Destaque do começo da página
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      //-----------------------------------------------------------------------
    }
    loadAll();
  }, []);
  ///-------------------------------------------------------------------------------------------------



  ///efeito para remover o fundo do header quando o usuario scrollar para baixo
  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])
  ///--------------------------------------------------------------------------




  return (
    <div className="page">

      <Header black={blackHeader} />
      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className='lists'>
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por Guilherme Abreu, 2021. <br />
        Este projeto foi realizado com o intuito de estudo/prática, todos os direitos de imagem são da Netflix.<br />
        Todos os dados utilizados neste projeto foram retirados através da API do site Themoviedb.org
      </footer>


      {movieList.length <= 0 &&
        <div className="loading">
          <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" alt="Carregando"></img>
        </div>
      }
    </div >
  )
}