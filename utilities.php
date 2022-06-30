<?php

use Stripe\Util\Util;

if (!function_exists('str_contains')) {
  function str_contains(string $haystack, string $needle)
  {
    return empty($needle) || strpos($haystack, $needle) !== false;
  }
}

function convertToHoursMins($time, $format = '%02d:%02d')
{
  if ($time < 1) {
    return;
  }
  $hours = floor($time / 60);
  $minutes = ($time % 60);
  return sprintf($format, $hours, $minutes);
}

function is_decimal($val)
{
  return is_numeric($val) && floor($val) != $val;
}

function hexToRgb($hex, $alpha = false)
{
  $hex      = str_replace('#', '', $hex);
  $length   = strlen($hex);
  $rgb['r'] = hexdec($length == 6 ? substr($hex, 0, 2) : ($length == 3 ? str_repeat(substr($hex, 0, 1), 2) : 0));
  $rgb['g'] = hexdec($length == 6 ? substr($hex, 2, 2) : ($length == 3 ? str_repeat(substr($hex, 1, 1), 2) : 0));
  $rgb['b'] = hexdec($length == 6 ? substr($hex, 4, 2) : ($length == 3 ? str_repeat(substr($hex, 2, 1), 2) : 0));
  if ($alpha) {
    $rgb['a'] = $alpha;
  }
  return $rgb;
}

function luma($r, $g, $b)
{
  return (0.2126 * $r + 0.7152 * $g + 0.0722 * $b) / 255;
}

function getAllLang()
{
  $url = file_get_contents("https://api.themoviedb.org/3/configuration/languages?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f");
  $url = json_decode($url, true); // true : JSON objects will be returned as associative arrays
  $languages = [];
  // foreach ($url as $lang) {
  //   if (!str_contains($lang['iso_639_1'], 'xx')) {
  //     if ($lang['name'] == '' || str_contains($lang['name'], '?')) {
  //       $value = [
  //         'name' => $lang['english_name'],
  //         'value' => $lang['iso_639_1']
  //       ];
  //       array_push($languages, $value);
  //     } else {
  //       $value = [
  //         'name' => $lang['name'] . ' (' . $lang['english_name'] . ')',
  //         'value' => $lang['iso_639_1']
  //       ];
  //       array_push($languages, $value);
  //     }
  //   }
  // }
  foreach ($url as $lang) {
    if ($lang['iso_639_1'] == 'fr' || $lang['iso_639_1'] == 'en') {
      $value = [
        'name' => $lang['name'],
        'value' => $lang['iso_639_1']
      ];
      array_push($languages, $value);
    }
  }
  sort($languages);
  return $languages;
}

function getMovies($type, $lang)
{
  $content = file_get_contents('https://api.themoviedb.org/3/movie/' . $type . '?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=' . $lang);
  $content = json_decode($content, true); // true : JSON objects will be returned as associative arrays
  $content = $content['results'];
  $movies = [];
  foreach ($content as $movie) {
    $value = [
      'id' => $movie['id'],
      'originalTitle' => $movie['original_title'],
      'title' => $movie['title'],
      'image' => 'https://image.tmdb.org/t/p/w300' . $movie['poster_path'],
      'date' => $movie['release_date'],
      'note' => $movie['vote_average'],
    ];
    array_push($movies, $value);
  }
  return $movies;
}

function getSimilar($id, $lang)
{
  $content = file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '/recommendations?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=' . $lang);
  $content = json_decode($content, true); // true : JSON objects will be returned as associative arrays
  $content = $content['results'];
  $movies = [];

  foreach ($content as $movie) {
    if ($movie['poster_path'] != null) {
      $pic = 'https://image.tmdb.org/t/p/w300' . $movie['poster_path'];
    } else {
      $pic = 'images/noPic2.jpg';
    }
    $value = [
      'id' => $movie['id'],
      'originalTitle' => $movie['original_title'],
      'title' => $movie['title'],
      'image' => $pic,
      'date' => $movie['release_date'],
      'note' => $movie['vote_average'],
    ];
    array_push($movies, $value);
  }
  return $movies;
}

function getMovie($id, $lang)
{
  $movieDetails = [];

  // MOVIE'S INFO //

  $contentMovie = file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=' . $lang);
  $contentMovie = json_decode($contentMovie, true); // true : JSON objects will be returned as associative arrays

  // MOVIE'S PRODUCTIONS / COMPANIES

  $productionCompanies = [];

  foreach ($contentMovie['production_companies'] as $prod) {
    if ($prod['logo_path'] != null) {
      $prodInfo = [
        'image' => 'https://image.tmdb.org/t/p/w200' . $prod['logo_path'],
        'name' => $prod['name']
      ];

      array_push($productionCompanies, $prodInfo);
    }
  }

  if (count($productionCompanies) == 0) {
    $productionCompanies = 'nope';
  }

  // MOVIE'S GENRES

  $genres = [];

  foreach ($contentMovie['genres'] as $genreName) {
    array_push($genres, $genreName['name']);
  }

  // MOVIE'S BACKGROUND

  if ($contentMovie['backdrop_path'] != '') {
    $backPic = 'https://image.tmdb.org/t/p/original' . $contentMovie['backdrop_path'];
  } else {
    $backPic = 'nope';
  }

  // GET BACKGROUND'S MAIN COLOR

  if ($backPic != 'nope') {
    $image = imagecreatefromjpeg($backPic);
    $thumb = imagecreatetruecolor(1, 1);
    imagecopyresampled($thumb, $image, 0, 0, 0, 0, 1, 1, imagesx($image), imagesy($image));
    $mainColor = strtoupper(dechex(imagecolorat($thumb, 0, 0)));
    if (round(luma(hexToRgb($mainColor)['r'], hexToRgb($mainColor)['g'], hexToRgb($mainColor)['b']), 1) >= 0.5) {
      $mainColor = '0, 0, 0, ';
    } else {
      $mainColor = hexToRgb($mainColor)['r'] . ', ' . hexToRgb($mainColor)['g'] . ', ' . hexToRgb($mainColor)['b'] . ', ';
    }
  } else {
    $mainColor = 'nope';
  }

  // MOVIE WEBSITE

  if ($contentMovie['homepage'] != '') {
    $web = $contentMovie['homepage'];
  } else {
    $web = 'nope';
  }

  // GET SIMILAR MOVIES

  $similar = getSimilar($contentMovie['id'], $lang);

  // MOVIE'S POSTER

  if ($contentMovie['poster_path'] != null) {
    $pic = 'https://image.tmdb.org/t/p/w400' . $contentMovie['poster_path'];
  } else {
    $pic = 'images/noPic2.jpg';
  }

  // MOVIE'S CAST

  $castContent = file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '/credits?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language=' . $lang);
  $castContent = json_decode($castContent, true); // true : JSON objects will be returned as associative arrays

  $cast = [];

  foreach ($castContent['cast'] as $people) {
    if ($people['profile_path'] != null) {
      $peopleInfo = [
        'id' => $people['id'],
        'name' => $people['name'],
        'originalName' => $people['original_name'],
        'image' => 'https://image.tmdb.org/t/p/w300' . $people['profile_path'],
        'characters' => $people['character'],
      ];
    } else {
      $peopleInfo = [
        'id' => $people['id'],
        'name' => $people['name'],
        'originalName' => $people['original_name'],
        'image' => 'images/noPic.png',
        'characters' => $people['character'],
      ];
    }
    array_push($cast, $peopleInfo);
  }

  // MOVIE'S CREW

  $crew = null;

  foreach ($castContent['crew'] as $people) {
    // if (!in_array($people['name'], array_column($crew, 'name'))) {
    //   if ($people['profile_path'] != null) {
    //     $peopleInfo = [
    //       'name' => $people['name'],
    //       'originalName' => $people['original_name'],
    //       'image' => 'https://image.tmdb.org/t/p/w300' . $people['profile_path'],
    //       'job' => $people['job'],
    //     ];
    //   } else {
    //     $peopleInfo = [
    //       'name' => $people['name'],
    //       'originalName' => $people['original_name'],
    //       'image' => 'images/noPic.png',
    //       'job' => $people['job'],
    //     ];
    //   }
    //   array_push($crew, $peopleInfo);
    // } else {
    //   $job = $crew[array_search($people['name'], array_column($crew, 'name'))]['job'];
    //   $job .= ' / ' . $people['job'];
    //   $crew[array_search($people['name'], array_column($crew, 'name'))]['job'] = $job;
    // }
    if ($people['job'] == 'Director') {
      $crew = [
        'name' => $people['name'],
        'originalName' => $people['original_name'],
        'image' => 'https://image.tmdb.org/t/p/w300' . $people['profile_path'],
        'job' => $people['job'],
      ];
    }
  }

  // MOVIE'S TRAILER / TEASER

  $trailers = json_decode(file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '/videos?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f'), true);
  $continue = true;

  foreach ($trailers['results'] as $trailer) {
    if (strtolower($trailer['name']) == 'official trailer' && $continue) {
      $video = '//www.youtube.com/embed/' . $trailer['key'] . '?&modestbranding=1&fs=1&autohide=1';
      $continue = false;
    }
  }

  if (!isset($video)) {
    foreach ($trailers['results'] as $trailer) {
      if (strtolower($trailer['type']) == 'trailer' && $continue) {
        $video = '//www.youtube.com/embed/' . $trailer['key'] . '?&modestbranding=1&fs=1&autohide=1';
        $continue = false;
      }
    }
  }

  if (!isset($video)) {
    foreach ($trailers['results'] as $trailer) {
      if (strtolower($trailer['type']) == 'teaser' && $continue) {
        $video = '//www.youtube.com/embed/' . $trailer['key'] . '?&modestbranding=1&fs=1&autohide=1';
        $continue = false;
      }
    }
  }

  if (!isset($video)) {
    $video = 'nope';
  }

  // MOVIE'S PICS

  $pics = [];

  $images = json_decode(file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '/images?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f'), true);
  foreach ($images['backdrops'] as $image) {
    // list($width, $height) = getimagesize('https://image.tmdb.org/t/p/w500' . $image['file_path']);
    // if ($width > $height) {
    array_push($pics, $image['file_path']);
    // }
  }

  // foreach ($images['posters'] as $image) {
  //   // list($width, $height) = getimagesize('https://image.tmdb.org/t/p/w92' . $image['file_path']);
  //   // if ($width > $height) {
  //     array_push($pics, 'https://image.tmdb.org/t/p/original' . $image['file_path']);
  //   // }
  // }

  $movieDetails = [
    'id' => $contentMovie['id'],
    'originalTitle' => $contentMovie['original_title'],
    'originalLanguage' => $contentMovie['original_language'],
    'title' => $contentMovie['title'],
    'poster' => $pic,
    'background' => $backPic,
    'mainColor' => $mainColor,
    'website' => $web,
    'genres' => $genres,
    'synop' => $contentMovie['overview'],
    'productionCompanies' => $productionCompanies,
    'time' => convertToHoursMins($contentMovie['runtime'], '%02dh%02dm'),
    'date' => $contentMovie['release_date'],
    'note' => $contentMovie['vote_average'],
    'cast' => $cast,
    'crew' => $crew,
    'pagePic' => 'https://image.tmdb.org/t/p/w200' . $contentMovie['poster_path'],
    'video' => $video,
    'pics' => $pics,
    'similar' => $similar,
  ];

  return $movieDetails;
}

function search($search, $lang)
{
  'https://api.themoviedb.org/3/search/movie?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&query=' . $search . '&page=1&language=' . $lang;
}

function getCelebrity($id, $lang)
{
  $celebrityDetails = [];

  // MOVIE'S INFO //

  $contentCelebrity = json_decode(file_get_contents('https://api.themoviedb.org/3/person/'.$id.'?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language='.$lang), true);
  $celebrityMovies = json_decode(file_get_contents('https://api.themoviedb.org/3/person/'.$id.'/movie_credits?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language='.$lang), true);
  $celebrityTv = json_decode(file_get_contents('https://api.themoviedb.org/3/person/'.$id.'/tv_credits?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f&language='.$lang), true);

var_dump($celebrityMovies);

  // // MOVIE'S GENRES

  // $genres = [];

  // foreach ($contentMovie['genres'] as $genreName) {
  //   array_push($genres, $genreName['name']);
  // }

  // $cast = [];

  // foreach ($castContent['cast'] as $people) {
  //   if ($people['profile_path'] != null) {
  //     $peopleInfo = [
  //       'id' => $people['id'],
  //       'name' => $people['name'],
  //       'originalName' => $people['original_name'],
  //       'image' => 'https://image.tmdb.org/t/p/w300' . $people['profile_path'],
  //       'characters' => $people['character'],
  //     ];
  //   } else {
  //     $peopleInfo = [
  //       'id' => $people['id'],
  //       'name' => $people['name'],
  //       'originalName' => $people['original_name'],
  //       'image' => 'images/noPic.png',
  //       'characters' => $people['character'],
  //     ];
  //   }
  //   array_push($cast, $peopleInfo);
  // }

  // // MOVIE'S PICS

  // $pics = [];

  // $images = json_decode(file_get_contents('https://api.themoviedb.org/3/movie/' . $id . '/images?api_key=c8e8c5853cd1fa6ba48f561f7b4f168f'), true);
  // foreach ($images['backdrops'] as $image) {
  //   // list($width, $height) = getimagesize('https://image.tmdb.org/t/p/w500' . $image['file_path']);
  //   // if ($width > $height) {
  //   array_push($pics, $image['file_path']);
  //   // }
  // }

  // $movieDetails = [
  //   'id' => $contentMovie['id'],
  //   'originalTitle' => $contentMovie['original_title'],
  //   'originalLanguage' => $contentMovie['original_language'],
  //   'title' => $contentMovie['title'],
  //   'poster' => $pic,
  //   'background' => $backPic,
  //   'mainColor' => $mainColor,
  //   'website' => $web,
  //   'genres' => $genres,
  //   'synop' => $contentMovie['overview'],
  //   'productionCompanies' => $productionCompanies,
  //   'time' => convertToHoursMins($contentMovie['runtime'], '%02dh%02dm'),
  //   'date' => $contentMovie['release_date'],
  //   'note' => $contentMovie['vote_average'],
  //   'cast' => $cast,
  //   'crew' => $crew,
  //   'pagePic' => 'https://image.tmdb.org/t/p/w200' . $contentMovie['poster_path'],
  //   'video' => $video,
  //   'pics' => $pics,
  //   'similar' => $similar,
  // ];

  // return $movieDetails;
}
