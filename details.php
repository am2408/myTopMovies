<?php

if (!isset($_COOKIE["lang"])) {
  setcookie("lang", "fr");
}

$id = $_GET['id'];

include 'utilities.php';

$languages = getAllLang();
$movieDetails = getMovie($id, $_COOKIE["lang"]);

include 'details.phtml';

