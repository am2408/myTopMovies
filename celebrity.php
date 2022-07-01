<?php

if (!isset($_COOKIE["lang"])) {
  setcookie("lang", "fr");
}

$id = $_GET['id'];

include 'utilities.php';

$languages = getAllLang();
$celebrity = getCelebrity($id, $_COOKIE["lang"]);

include 'celebrity.phtml';

