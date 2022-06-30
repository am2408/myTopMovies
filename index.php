<?php
include 'utilities.php';

if (!isset($_COOKIE["lang"])) {
  setcookie("lang", "fr", "SameSite=None");
  $popularMovies = getMovies('popular', 'fr');

  $topRatedMovies = getMovies('top_rated', 'fr');

  $upcomingMovies = getMovies('upcoming', 'fr');
} else {
  $popularMovies = getMovies('popular', $_COOKIE["lang"]);

  $topRatedMovies = getMovies('top_rated', $_COOKIE["lang"]);

  $upcomingMovies = getMovies('upcoming', $_COOKIE["lang"]);
}


$languages = getAllLang();

include 'index.phtml';
